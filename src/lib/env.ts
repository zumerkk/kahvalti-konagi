import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL eksik"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET en az 32 karakter olmalı"),
  ADMIN_USERNAME: z.string().min(3, "ADMIN_USERNAME en az 3 karakter olmalı"),
  ADMIN_PASSWORD_HASH: z.string().min(10, "ADMIN_PASSWORD_HASH eksik veya geçersiz"),
  PII_ENCRYPTION_KEY: z.string().min(40, "PII_ENCRYPTION_KEY eksik veya geçersiz (base64)"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  
  // İsteğe bağlı API entegrasyonları
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_GSC_ID: z.string().optional(),
  SMS_API_KEY: z.string().optional(),
  EMAIL_API_KEY: z.string().optional(),
});

let envData: z.infer<typeof envSchema>;

try {
  envData = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Geçersiz Ortam Değişkenleri:", error.flatten().fieldErrors);
  }
  // Yalnızca test ortamı dışındaysa süreci durdur (Vitest için esneklik)
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Eksik veya hatalı ortam değişkenleri nedeniyle uygulama başlatılamadı.");
  } else {
    envData = {
      DATABASE_URL: "test-db-url",
      AUTH_SECRET: "test-secret-123456789012345678901234567890",
      ADMIN_USERNAME: "admin",
      ADMIN_PASSWORD_HASH: "test-hash-1234567890",
      PII_ENCRYPTION_KEY: "5HRDYhnj52dSCe/hxwW5t3nJAHXbASIxdeqaso1ALs0=",
      NODE_ENV: "test",
    } as any;
  }
}

export const env = envData;
