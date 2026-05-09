import { Router } from "express";
import { login, logout, me, refreshToken, register, forgotPassword, resetPasswordAction } from "../controllers/auth.controller";
import { validateRequest } from "../middleware/validation.middleware";
import { authRateLimiter } from "../middleware/rateLimiter.middleware";
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from "../validations/auth.validation";

const router = Router();

router.post("/register", authRateLimiter, validateRequest(registerSchema), register);
router.post("/login", authRateLimiter, validateRequest(loginSchema), login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", me);
router.post("/forgot-password", authRateLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authRateLimiter, validateRequest(resetPasswordSchema), resetPasswordAction);

export default router;
