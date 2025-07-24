import { z } from "zod";

export const addUrlSchema = z.object({
  url: z.string().url(),
  interval: z.coerce.number().int().min(1).max(1440), // 1 min to 24 hours
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name too long")
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
}); 