import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as unknown as JwtPayload;
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}; 