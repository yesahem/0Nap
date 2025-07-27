import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
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
  fullName: z.string().min(3, "Full name must be at least 3 characters").max(18, "Full name too long"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>; 