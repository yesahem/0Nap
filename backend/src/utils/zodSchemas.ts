import { z } from "zod";

export const addUrlSchema = z.object({
  url: z.url(),
  interval: z.coerce.number().int().min(1).max(10080), // 1 min to 7days 
});

export const registerSchema = z.object({
  email: z.email("Invalid email format"),
password: z
    .string()
    .min(8, "password at least 8 characters long")
    .max(15, "password can't exceeds 15 characters")
    .regex(/[A-Z]/, "passwordmmust contains at least one uppercase characters")
    .regex(/[a-z]/, "password must contains at least one lowercase characters")
    .regex(/[0-9]/, "password must contains at least one number ")
    .regex(
      /[!@#$%?<>&*]/,
      "password must contains at least one special characters from one of them !@#$%?<>&*]",
    ),
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(18, "Full name too long")
});

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required")
}); 