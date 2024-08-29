"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { auth, signOut } from "@/lib/auth";
import prisma from "@/lib/db";

import {
  updateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/schema/user";
import { saltAndHashPassword } from "@/utils";

export type ResponseType<T = any> = {
  success?: boolean;
  error?: string | {};
  data?: T | null;
};

export async function updateUserProfile(
  values: UpdateUserProfileValues
): Promise<ResponseType> {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      return { error: "Unauthorized access. Please log in." };
    }

    // Validate input data
    const userData = updateUserProfileSchema.parse(values);

    // Update user profile in the database
    await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    // Revalidate path if necessary
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      error:
        "An error occurred while updating the profile. Please try again later.",
    };
  }
}

// export const changePassword = async (
//   values: ChangePasswordValues
// ): Promise<ResponseType> => {
//   try {
//     const session = await auth();
//     const { id: userId } = session?.user || {};

//     const { oldPassword, newPassword } = changePasswordSchema.parse(values);

//     if (!userId) {
//       return { error: "Unauthorized access. Please log in." };
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (!user || !user.hashedPassword) {
//       return { error: "User not found." };
//     }

//     const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);

//     if (!isMatch) {
//       return { error: "Incorrect old password!" };
//     }

//     // Hash the password
//     const hashedPassword = await saltAndHashPassword(newPassword);

//     await prisma.user.update({
//       where: { id: userId },
//       data: { hashedPassword },
//     });

//     await signOut({ redirectTo: "/" });

//     return { success: true };
//   } catch (error) {
//     console.error("Change password error:", error);
//     return {
//       error:
//         "An error occurred while changing the password. Please try again later.",
//     };
//   }
// };
