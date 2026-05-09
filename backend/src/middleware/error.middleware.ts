import type { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err instanceof AppError ? err : new AppError(err.message || "Internal server error", 500);
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
