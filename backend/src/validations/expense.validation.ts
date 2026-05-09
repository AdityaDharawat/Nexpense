import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be greater than zero"),
    category: z.string().min(2, "Category is required"),
  }),
});

export const updateExpenseSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    amount: z.number().positive().optional(),
    category: z.string().optional(),
  }),
});

export const expenseQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    category: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().default(1).min(1),
    limit: z.coerce.number().default(20).min(1).max(100),
  }),
});

export const approveExpenseSchema = z.object({
  body: z.object({
    remark: z.string().optional(),
    status: z.enum(["APPROVED", "REJECTED"]),
  }),
});
