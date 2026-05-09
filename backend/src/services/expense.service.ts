import prisma from "../prisma/client";

export const createExpense = async (userId: string, data: { title: string; description?: string; amount: number; category: string; receiptUrl?: string; }) => {
  return prisma.expense.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      amount: data.amount,
      category: data.category,
      receiptUrl: data.receiptUrl,
    },
  });
};

export const updateExpense = async (expenseId: string, userId: string, payload: Partial<{ title: string; description: string; amount: number; category: string; receiptUrl: string; }>) => {
  return prisma.expense.updateMany({
    where: { id: expenseId, userId, status: "PENDING" },
    data: { ...payload },
  });
};

export const deleteExpense = async (expenseId: string, userId: string) => {
  return prisma.expense.deleteMany({ where: { id: expenseId, userId, status: "PENDING" } });
};

export const getUserExpenses = async (userId: string, query: { status?: string; category?: string; search?: string; page?: number; limit?: number; }) => {
  const where: any = { userId };

  if (query.status) where.status = query.status;
  if (query.category) where.category = query.category;
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.expense.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const findExpenseById = async (expenseId: string) => {
  return prisma.expense.findUnique({ where: { id: expenseId } });
};

export const adminListExpenses = async (query: { status?: string; category?: string; search?: string; page?: number; limit?: number; }) => {
  const where: any = {};

  if (query.status) where.status = query.status;
  if (query.category) where.category = query.category;
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { user: true, approver: true },
    }),
    prisma.expense.count({ where }),
  ]);

  return { items, total, page, limit };
};

export const changeExpenseStatus = async (expenseId: string, approverId: string, status: "APPROVED" | "REJECTED", remark?: string) => {
  return prisma.expense.update({
    where: { id: expenseId },
    data: {
      status,
      approverId,
      remark,
      approvedAt: new Date(),
    },
  });
};
