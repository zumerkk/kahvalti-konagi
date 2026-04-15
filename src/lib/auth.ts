import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "kk_admin";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET eksik (env).");
  return new TextEncoder().encode(s);
}

export async function verifyCredentials(username: string, password: string) {
  const u = process.env.ADMIN_USERNAME ?? "";
  const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
  if (!u || !hash) return false;
  if (username !== u) return false;
  return bcrypt.compare(password, hash);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
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

