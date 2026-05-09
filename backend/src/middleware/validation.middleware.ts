import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../utils/appError";

export const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!result.success) {
      const issue = result.error.issues[0];
      return next(new AppError(issue.message, 400));
    }
    req.body = result.data.body;
    req.query = result.data.query;
    req.params = result.data.params;
    next();
  };
};
