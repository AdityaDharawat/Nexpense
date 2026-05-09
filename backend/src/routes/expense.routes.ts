import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { createExpenseAction, deleteExpenseAction, listExpenses, updateExpenseAction } from "../controllers/expense.controller";
import { createExpenseSchema, expenseQuerySchema, updateExpenseSchema } from "../validations/expense.validation";
import { receiptUpload } from "../uploads/multer";

const router = Router();

router.use(authenticate);
router.post("/", receiptUpload.single("receipt"), validateRequest(createExpenseSchema), createExpenseAction);
router.get("/", validateRequest(expenseQuerySchema), listExpenses);
router.patch("/:id", validateRequest(updateExpenseSchema), updateExpenseAction);
router.delete("/:id", deleteExpenseAction);

export default router;
