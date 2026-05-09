import prisma from "../prisma/client";

export const createAuditLog = async (data: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}) => {
  return prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      entity: data.entity,
      entityId: data.entityId,
      details: data.details,
      ip: data.ip,
      userAgent: data.userAgent,
    },
  });
};
