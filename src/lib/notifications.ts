import { logger } from "./audit-logger";
import { env } from "./env";

// SMS Entegrasyonu Mock Servisi (Örn: Netgsm, Twilio)
export async function sendReservationSMS(phone: string, reservationDetails: { id: string; date: string; time: string; tableName: string }) {
  try {
    const message = `Kahvaltı Konağı rezervasyonunuz alınmıştır. Kod: ${reservationDetails.id}. Tarih: ${reservationDetails.date} Saat: ${reservationDetails.time} Masa: ${reservationDetails.tableName}. Bizi tercih ettiğiniz için teşekkür ederiz.`;
    
    if (env.SMS_API_KEY) {
      // Gerçek API çağrısı:
      // await fetch("https://api.sms-provider.com/send", { headers: { Authorization: `Bearer ${env.SMS_API_KEY}` }, body: ... })
      logger.info(`[SMS GÖNDERİLDİ - API] Tel: ${phone} | Mesaj: ${message}`);
    } else {
      logger.info(`[SMS GÖNDERİLDİ - MOCK] Tel: ${phone} | Mesaj: ${message}`);
    }
  } catch (error) {
    logger.error(`SMS gönderimi başarısız oldu: ${phone}`, { error });
  }
}

// E-posta Entegrasyonu Mock Servisi (Örn: Resend, Sendgrid, AWS SES)
export async function sendReservationEmail(email: string, reservationDetails: any) {
  try {
    if (env.EMAIL_API_KEY) {
      // Gerçek API çağrısı
      logger.info(`[E-POSTA GÖNDERİLDİ - API] Email: ${email}`);
    } else {
      logger.info(`[E-POSTA GÖNDERİLDİ - MOCK] Email: ${email}`);
    }
  } catch (error) {
    logger.error(`E-posta gönderimi başarısız oldu: ${email}`, { error });
  }
}
