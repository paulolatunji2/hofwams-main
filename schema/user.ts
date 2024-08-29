import { ChefType, UserRole } from "@prisma/client";
import { z } from "zod";

// import { passwordValidation } from "./auth";

export const updateUserProfileSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  image: z.string().optional(),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;

// export const changePasswordSchema = z
//   .object({
//     oldPassword: passwordValidation,
//     newPassword: passwordValidation,
//     confirmNewPassword: z
//       .string()
//       .min(8, "Confirm Password must be at least 8 characters long"),
//   })
//   .refine((data) => data.newPassword === data.confirmNewPassword, {
//     path: ["confirmNewPassword"],
//     message: "Passwords do not match",
//   });

// export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export type UpdateUserRoleValues = z.infer<typeof updateUserRoleSchema>;

export const updateChefTypeSchema = z.object({
  chefType: z.nativeEnum(ChefType),
});

export type UpdateChefTypeValues = z.infer<typeof updateChefTypeSchema>;
