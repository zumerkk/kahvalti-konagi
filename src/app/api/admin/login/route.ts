import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession, verifyCredentials } from "@/lib/auth";

export const runtime = "nodejs";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Veriler geçersiz." }, { status: 400 });
  }

  const ok = await verifyCredentials(parsed.data.username, parsed.data.password);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Kullanıcı adı veya şifre hatalı." }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}

