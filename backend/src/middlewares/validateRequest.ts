import type { Request, Response, NextFunction } from "express";
import { addUrlSchema, registerSchema, loginSchema } from "../utils/zodSchemas.js";
import { ZodError } from "zod";

export const validateAddUrl = (req: Request, res: Response, next: NextFunction) => {
  try {
    addUrlSchema.parse(req.body);
    next();
  } catch (err: any) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.issues });
    } else {
      res.status(400).json({ error: "Invalid request" });
    }
  }
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (err: any) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.issues });
    } else {
      res.status(400).json({ error: "Invalid request" });
    }
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (err: any) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: err.issues });
    } else {
      res.status(400).json({ error: "Invalid request" });
    }
  }
}; 