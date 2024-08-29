"use server";

import { revalidatePath } from "next/cache";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { signUpSchema, SignUpValues } from "@/schema/auth";
import { saltAndHashPassword } from "@/utils";

const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const register = async (
  data: SignUpValues
): Promise<{ success?: boolean; error?: string }> => {
  try {
    // Validate data against the schema
    const { name, email } = signUpSchema.parse(data);

    // Check if user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      await login("resend", email);
    }

    // Hash the password
    // const hashedPassword = await saltAndHashPassword(password);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    await login("resend", user.email);

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed, please try again later." };
  }
};

export const login = async (provider: string, email?: string) => {
  await signIn(provider, { email, redirectTo: "/" });
  revalidatePath("/");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
  revalidatePath("/");
};

// export const loginWithCredentials = async (data: SignInValues) => {
//   const { email, password } = signInSchema.parse(data);

//   const rawFormData = {
//     email,
//     password,
//     redirectTo: "/",
//   };

//   const existingUser = await getUserByEmail(email);
//   console.log({ existingUser });

//   try {
//     await signIn("credentials", rawFormData);
//   } catch (error: any) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return { error: "Invalid credentials!" };
//         default:
//           return { error: "Something went wrong!" };
//       }
//     }

//     throw error;
//   }
//   revalidatePath("/");
// };
