import prisma from "../prisma/client";

export const createNotification = async (data: {
  userId: string;
  title: string;
  message: string;
  type?: string;
  metadata?: Record<string, any>;
}) => {
  return prisma.notification.create({
    data: {
      userId: data.userId,
      title: data.title,
      message: data.message,
      type: data.type || "INFO",
      metadata: data.metadata,
    },
  });
};
