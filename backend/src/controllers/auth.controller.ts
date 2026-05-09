import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../utils/appError";
import { createTokenPair, authenticateUser, generatePasswordResetToken, registerUser, revokeRefreshToken, resetPassword, locateSession } from "../services/auth.service";
import { config } from "../config/config";

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const user = await registerUser(name, email, password);
  const tokens = await createTokenPair({ id: user.id, email: user.email, role: user.role, name: user.name });

  res.cookie("accessToken", tokens.accessToken, config.cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, config.cookieOptions);

  res.status(201).json({ status: "success", data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  const tokens = await createTokenPair({ id: user.id, email: user.email, role: user.role, name: user.name });

  res.cookie("accessToken", tokens.accessToken, config.cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, config.cookieOptions);

  res.status(200).json({ status: "success", data: { user: { id: user.id, email: user.email, name: user.name, role: user.role } } });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return next(new AppError("Refresh token missing", 401));

  const session = await locateSession(refreshToken);
  if (!session) return next(new AppError("Invalid refresh token", 401));

  const tokens = await createTokenPair({ id: session.user.id, email: session.user.email, role: session.user.role, name: session.user.name });

  await revokeRefreshToken(refreshToken);

  res.cookie("accessToken", tokens.accessToken, config.cookieOptions);
  res.cookie("refreshToken", tokens.refreshToken, config.cookieOptions);

  res.status(200).json({ status: "success" });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ status: "success", message: "Logged out successfully" });
});

export const me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) return next(new AppError("Authentication required", 401));
  res.status(200).json({ status: "success", data: { user: req.user } });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const token = await generatePasswordResetToken(email);

  res.status(200).json({ status: "success", data: { resetToken: token } });
});

export const resetPasswordAction = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await resetPassword(token, password);
  res.status(200).json({ status: "success", message: "Password updated successfully" });
});
