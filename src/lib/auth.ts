import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "./env";
import { prisma } from "./prisma";
import { logger } from "./audit-logger";

const COOKIE_NAME = "kk_admin";

function getSecret() {
  return new TextEncoder().encode(env.AUTH_SECRET);
}

export async function verifyCredentials(username: string, password: string) {
  try {
    // 1. Check DB for User (RBAC integration)
    const dbUser = await prisma.user.findUnique({ where: { username } });
    
    if (dbUser && dbUser.isActive) {
      const isValid = await bcrypt.compare(password, dbUser.passwordHash);
      if (isValid) {
        logger.info(`DB Login successful: ${username}`);
        return { success: true, role: dbUser.role };
      }
    }
  } catch (error) {
    // DB error or missing table (if not migrated yet), fallback to ENV
  }

  // 2. Fallback to ENV Super Admin
  const u = env.ADMIN_USERNAME;
  const hash = env.ADMIN_PASSWORD_HASH;
  if (username === u) {
    const isValid = await bcrypt.compare(password, hash);
    if (isValid) {
      logger.info(`ENV Login successful: ${username}`);
      return { success: true, role: "SUPER_ADMIN" };
    }
  }
  
  return { success: false, role: null };
}

export async function createSession(role: string = "SUPER_ADMIN") {
  const token = await new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function isAdminRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return false;
  const token = match[1];
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export function redirectToLogin() {
  const url = new URL("/admin/login", "http://localhost");
  return NextResponse.redirect(url.pathname);
}

