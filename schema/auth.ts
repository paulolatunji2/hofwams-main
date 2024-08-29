import { z } from "zod";

export const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  name: requiredString.min(1),
  email: requiredString.email("Invalid email"),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: requiredString.email("Invalid email"),
});

export type SignInValues = z.infer<typeof signInSchema>;
