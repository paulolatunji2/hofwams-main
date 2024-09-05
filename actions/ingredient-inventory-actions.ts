"use server";

import { IngredientInventory, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ResponseType } from "./user-actions";
import {
  ingredientInventorySchema,
  IngredientInventoryValues,
  updateIngredientInventorySchema,
  UpdateIngredientInventoryValues,
} from "@/schema/ingredient-inventory";
import { checkUserAuthorization } from "./event-planning-actions";
import { revalidatePath } from "next/cache";

export const createIngredientInventory = async (
  values: IngredientInventoryValues
): Promise<ResponseType<IngredientInventory>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const { name, unit, ...rest } = ingredientInventorySchema.parse(values);

    const existingIngredient = await prisma.ingredientInventory.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: name,
        },
      },
    });

    if (existingIngredient) {
      return { error: "Ingredient already exists!" };
    }

    const ingredientInventory = await prisma.ingredientInventory.create({
      data: { name, measuringUnitName: unit, ...rest },
    });

    revalidatePath("/dashboard/chef/inventory");
    return { success: true, data: ingredientInventory };
  } catch (error) {
    console.error("Create ingredient inventory error:", error);
    return {
      error:
        error || "An error occurred while creating the ingredient inventory.",
    };
  }
};

export const getIngredientInventory = async (
  id: string
): Promise<ResponseType<IngredientInventory>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const ingredientInventory = await prisma.ingredientInventory.findUnique({
      where: { id },
    });

    if (!ingredientInventory) {
      throw new Error("Ingredient inventory not found.");
    }

    return { success: true, data: ingredientInventory };
  } catch (error) {
    console.error("Get ingredient inventory error:", error);
    return {
      error:
        error || "An error occurred while getting the ingredient inventory.",
    };
  }
};

export const getAllIngredientInventories = async (): Promise<
  ResponseType<IngredientInventory[]>
> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const ingredientInventories = await prisma.ingredientInventory.findMany();

    if (ingredientInventories.length === 0) {
      return { data: [], error: "No ingredient inventories found." };
    }

    return { success: true, data: ingredientInventories };
  } catch (error) {
    console.error("Get ingredient inventories error:", error);
    return {
      error:
        error || "An error occurred while getting the ingredient inventories.",
    };
  }
};

export const updateIngredientInventory = async (
  id: string,
  values: UpdateIngredientInventoryValues
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const data = updateIngredientInventorySchema.parse(values);

    const existingIngredientInventory =
      await prisma.ingredientInventory.findUnique({
        where: { id },
      });

    if (!existingIngredientInventory) {
      return { error: "Ingredient inventory not found." };
    }

    await prisma.ingredientInventory.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/chef/inventory");
    return { success: true };
  } catch (error) {
    console.error("Update ingredient inventory error:", error);
    return {
      error:
        error || "An error occurred while updating the ingredient inventory.",
    };
  }
};

export const deleteIngredientInventory = async (
  id: string
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const existingIngredientInventory =
      await prisma.ingredientInventory.findUnique({
        where: { id },
      });

    if (!existingIngredientInventory) {
      throw new Error("Ingredient inventory not found.");
    }

    await prisma.ingredientInventory.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Delete ingredient inventory error:", error);
    return {
      error:
        error || "An error occurred while deleting the ingredient inventory.",
    };
  }
};
