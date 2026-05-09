import { Router } from "express";
import authRoutes from "./auth.routes";
import expenseRoutes from "./expense.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/admin", adminRoutes);

export default router;
