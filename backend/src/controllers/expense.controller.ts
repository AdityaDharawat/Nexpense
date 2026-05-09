import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../utils/appError";
import { createExpense, deleteExpense, findExpenseById, getUserExpenses, updateExpense } from "../services/expense.service";
import { createAuditLog } from "../services/audit.service";

export const createExpenseAction = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Authentication required", 401));

  const { title, description, amount, category } = req.body;
  const receiptUrl = req.file ? await uploadReceiptFile(req.file) : undefined;

  const expense = await createExpense(req.user.id, { title, description, amount, category, receiptUrl });
  await createAuditLog({ userId: req.user.id, action: "Create expense", entity: "Expense", entityId: expense.id, details: { title, amount, category }, ip: req.ip, userAgent: req.get("User-Agent") });

  res.status(201).json({ status: "success", data: { expense } });
});

export const listExpenses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  const result = await getUserExpenses(req.user.id, req.query as any);
  res.status(200).json({ status: "success", data: result });
});

export const updateExpenseAction = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  const expense = await findExpenseById(req.params.id);
  if (!expense || expense.userId !== req.user.id) return next(new AppError("Expense not found", 404));

  const updateResult = await updateExpense(req.params.id, req.user.id, req.body);
  if (updateResult.count === 0) return next(new AppError("Unable to update expense. Only pending requests can be edited.", 400));

  await createAuditLog({ userId: req.user.id, action: "Update expense", entity: "Expense", entityId: req.params.id, details: req.body, ip: req.ip, userAgent: req.get("User-Agent") });

  res.status(200).json({ status: "success", data: { updated: updateResult.count } });
});

export const deleteExpenseAction = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  const result = await deleteExpense(req.params.id, req.user.id);
  if (result.count === 0) return next(new AppError("Unable to delete expense. Only pending requests can be removed.", 400));

  await createAuditLog({ userId: req.user.id, action: "Delete expense", entity: "Expense", entityId: req.params.id, ip: req.ip, userAgent: req.get("User-Agent") });

  res.status(200).json({ status: "success", data: { deleted: result.count } });
});

const uploadReceiptFile = async (file: Express.Multer.File) => {
  const { uploadReceipt } = await import("../uploads/cloudinary");
  return uploadReceipt(file.buffer, file.originalname);
};
