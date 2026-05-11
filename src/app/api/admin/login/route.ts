import { NextResponse } from "next/server";
import { verifyCredentials, createSession } from "@/lib/auth";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || !body.username || !body.password) {
    return NextResponse.json({ ok: false, error: "Kullanıcı adı ve şifre zorunlu." }, { status: 400 });
  }

  const { success, role } = await verifyCredentials(body.username, body.password);

  if (!success) {
    await logAudit("SYSTEM", "LOGIN_FAILED", "UPDATE", { username: body.username }, "SYSTEM");
    return NextResponse.json({ ok: false, error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  }

  await createSession(role || "STAFF");
  await logAudit("SYSTEM", "LOGIN_SUCCESS", "UPDATE", { username: body.username, role }, body.username);

  return NextResponse.json({ ok: true });
}

