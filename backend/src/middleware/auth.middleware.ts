import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import { AppError } from "../utils/appError";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new AppError("Authentication required", 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
