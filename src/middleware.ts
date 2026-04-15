import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "kk_admin";

function getSecret() {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET eksik (env).");
  return new TextEncoder().encode(s);
}

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
  if (req.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};

