import { prisma } from "./prisma";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE";
type AuditEntity = "RESERVATION" | "SETTINGS" | "ORDER" | "ORDER_ITEM" | "PAYMENT" | "SYSTEM";

// Structured logger
export const logger = {
  info: (msg: string, meta?: any) => console.log(JSON.stringify({ level: "info", timestamp: new Date().toISOString(), message: msg, ...meta })),
  warn: (msg: string, meta?: any) => console.warn(JSON.stringify({ level: "warn", timestamp: new Date().toISOString(), message: msg, ...meta })),
  error: (msg: string, meta?: any) => console.error(JSON.stringify({ level: "error", timestamp: new Date().toISOString(), message: msg, ...meta })),
};

export async function logAudit(
  entity: AuditEntity,
  entityId: string,
  action: AuditAction,
  details: any,
  adminUser?: string
) {
  const detailsStr = JSON.stringify(details);
  
  // 1. Structured log for external monitoring (Datadog, CloudWatch, etc.)
  logger.info(`Audit: ${action} on ${entity}`, { entityId, action, adminUser: adminUser || "SYSTEM", details });

  // 2. Database log for internal Admin Panel
  try {
    await prisma.auditLog.create({
      data: {
        entity,
        entityId,
        action,
        details: detailsStr,
        adminUser: adminUser || "SYSTEM",
      },
    });
  } catch (error) {
    logger.error("Failed to write audit log to database", { error: (error as Error).message });
  }
}
