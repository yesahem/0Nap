import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, fullName } = req.body;
    console.log(req.body);
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, fullName } });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    next(err);
  }
}; 