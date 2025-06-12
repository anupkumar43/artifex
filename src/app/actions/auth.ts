"use server";

import { db } from "~/server/db";
import { env } from "~/env";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signInSchema } from "~/schemas/auth";

export const signup = async (
  email: string,
  password: string,
): Promise<string | void> => {
  // Validate input
  const parsed = signInSchema.safeParse({ email, password });

  if (!parsed.success) {
    return "Invalid email or password format";
  }

  const { email: parsedEmail, password: parsedPassword } = parsed.data;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: parsedEmail },
  });

  if (existingUser) {
    return "User already exists";
  }

  // Hash password securely
  const hashedPassword = await bcrypt.hash(parsedPassword, 10);

  // Initialize Stripe

  // Create Stripe customer

  // Create user in DB
  await db.user.create({
    data: {
      email: parsedEmail,
      password: hashedPassword,
    },
  });

  // Redirect to signin
  redirect("/signin");
};
