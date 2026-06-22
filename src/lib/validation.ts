import { z } from "zod";
import { HabitType } from "@prisma/client";

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const logSchema = z.object({
  type: z.nativeEnum(HabitType),
  value: z.number().positive("Value must be greater than 0").max(100000),
  unit: z.string().min(1).max(16),
  // Optional ISO timestamp; defaults to now on the server.
  loggedAt: z.string().datetime().optional(),
});

export type LogInput = z.infer<typeof logSchema>;

export const goalSchema = z.object({
  type: z.nativeEnum(HabitType),
  target: z.number().positive().max(100000),
  unit: z.string().min(1).max(16),
});
