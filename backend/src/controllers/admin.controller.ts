import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../utils/appError";
import { adminListExpenses, changeExpenseStatus, findExpenseById } from "../services/expense.service";
import { createAuditLog } from "../services/audit.service";
import { createNotification } from "../services/notification.service";

export const listAllExpenses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const result = await adminListExpenses(req.query as any);
  res.status(200).json({ status: "success", data: result });
});

export const approveExpense = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  const { status, remark } = req.body;
  const expense = await findExpenseById(req.params.id);
  if (!expense) return next(new AppError("Expense not found", 404));

  const updatedExpense = await changeExpenseStatus(req.params.id, req.user.id, status, remark);
  await createAuditLog({ userId: req.user.id, action: `${status.toLowerCase()} expense`, entity: "Expense", entityId: req.params.id, details: { status, remark }, ip: req.ip, userAgent: req.get("User-Agent") });
  await createNotification({ userId: expense.userId, title: `Expense ${status.toLowerCase()}`, message: `Your expense request "${expense.title}" was ${status.toLowerCase()}.`, type: status === "APPROVED" ? "SUCCESS" : "WARNING" });

  res.status(200).json({ status: "success", data: { expense: updatedExpense } });
});
