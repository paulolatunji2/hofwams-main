import { Drink, Meal } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function saltAndHashPassword(password: string): Promise<string> {
  const saltRounds = 10; // Adjust the cost factor according to your security requirements
  const salt = await bcrypt.genSalt(saltRounds); // Asynchronously generate a salt
  const hash = await bcrypt.hash(password, salt); // Asynchronously hash the password
  return hash; // Return the hash directly as a string
}

export const getInitials = (fullName: string) => {
  return fullName
    ?.split(" ")
    ?.map((word) => word[0].toUpperCase())
    .join("");
};

export const extractMenuName = (
  menuArr: Drink[] | Meal[]
) => {
  if (!menuArr) return [];
  return menuArr?.map((item) => item.name);
};
