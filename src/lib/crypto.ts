import crypto from "crypto";

function getKey() {
  const base64 = process.env.PII_ENCRYPTION_KEY;
  if (!base64) throw new Error("PII_ENCRYPTION_KEY eksik (env).");
  const key = Buffer.from(base64, "base64");
  if (key.length !== 32) throw new Error("PII_ENCRYPTION_KEY 32 byte olmalı (base64).");
  return key;
}

export function encryptPII(plain: string) {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // base64(iv).base64(tag).base64(enc)
  return `${iv.toString("base64")}.${tag.toString("base64")}.${enc.toString("base64")}`;
}

export function decryptPII(payload: string) {
  const key = getKey();
  const [ivB64, tagB64, encB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !encB64) throw new Error("Şifreli veri formatı hatalı.");
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const enc = Buffer.from(encB64, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(enc), decipher.final()]);
  return plain.toString("utf8");
}

