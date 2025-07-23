import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: err.issues });
  }
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
}; 