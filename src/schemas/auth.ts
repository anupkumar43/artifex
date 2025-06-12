import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
});
