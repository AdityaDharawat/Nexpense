import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validateRequest } from "../middleware/validation.middleware";
import { approveExpense, listAllExpenses } from "../controllers/admin.controller";
import { approveExpenseSchema, expenseQuerySchema } from "../validations/expense.validation";

const router = Router();

router.use(authenticate, authorize(["ADMIN"]));
router.get("/expenses", validateRequest(expenseQuerySchema), listAllExpenses);
router.patch("/expenses/:id", validateRequest(approveExpenseSchema), approveExpense);

export default router;
