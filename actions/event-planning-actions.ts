"use server";

import { ChefType, UserRole } from "@prisma/client";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ResponseType } from "./user-actions";
import { IngredientUsageValues } from "@/schema/ingredient-inventory";
import { MealPlanResponseType, MealPlanValues } from "@/types";
import { revalidatePath } from "next/cache";

export const checkUserAuthorization = (
  role: UserRole,
  chefType?: ChefType
): boolean => {
  return (
    role === UserRole.CHEF &&
    (!chefType || chefType === ChefType.EXECUTIVE_CHEF)
  );
};

const getEvent = async (eventId: string) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      meals: true,
      mealPlan: true, // Fetch existing meal plans
    },
  });
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found.`);
  }
  return event;
};

const getChefProfiles = async (chefId: string[]) => {
  const chefs = await prisma.chefProfile.findMany({
    where: { id: { in: chefId } },
  });

  if (chefs.length !== chefId.length) {
    const missingChefs = chefId.filter(
      (id) => !chefs.some((chef) => chef.id === id)
    );

    return { error: `Chef(s) not found: ${missingChefs.join(", ")}` };
  }

  return chefs;
};

export async function createMealPlanForEvent(
  eventId: string,
  data: MealPlanValues
): Promise<ResponseType> {
  try {
    const session = await auth();
    const { id: userId, role, chefType } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole, chefType as ChefType))
      throw new Error("Not authorized.");

    const event = await getEvent(eventId);
    const { name: mealName, description, note, ingredients, chefIds } = data;

    // Validate chefs
    const chefs = await getChefProfiles(chefIds);
    if ("error" in chefs) return chefs;

    const meal = event.meals.find((m) => m.name === mealName);

    if (!meal) {
      return {
        error: `No meal with name '${mealName}' found for this ${event.name} event.`,
      };
    }

    // Check if the meal plan already exists
    const existingMealPlan = event.mealPlan.find(
      (plan) => plan.eventId === eventId && plan.name.includes(meal.name)
    );

    if (existingMealPlan) {
      return {
        error: `A meal plan for the meal '${meal.name}' has already been created.`,
      };
    }

    // Check if we can create more meal plans
    if (event.mealPlan.length >= event.meals.length) {
      throw new Error(
        `Cannot create more meal plans. The event already has meal plans for all meals.`
      );
    }

    // Create the meal plan within a transaction
    await prisma.$transaction(async (prisma) => {
      const mealPlan = await prisma.mealPlan.create({
        data: {
          name: `${meal.name} Plan`,
          description: description || `Meal plan for ${meal.name}`,
          note,
          eventId: event.id,
          chef: {
            connect: chefIds?.map((chefId) => ({ id: chefId })),
          },
        },
      });

      // Fetch all ingredients at once
      const ingredientNames = ingredients.map(
        (assignment) => assignment.ingredientName
      );
      const ingredientInventories = await prisma.ingredientInventory.findMany({
        where: {
          name: {
            in: ingredientNames,
            mode: "insensitive",
          },
        },
      });

      // Check for missing ingredients
      const missingIngredients = ingredientNames.filter(
        (name) => !ingredientInventories.some((inv) => inv.name === name)
      );
      if (missingIngredients.length > 0) {
        return {
          error: `Inventory not found for ingredients: ${missingIngredients.join(
            ", "
          )}.`,
        };
      }

      // Check if there is enough stock
      for (const assignment of ingredients) {
        const ingredientInventory = ingredientInventories.find(
          (inv) =>
            inv.name.toLowerCase() === assignment.ingredientName.toLowerCase()
        );

        if (
          !ingredientInventory ||
          ingredientInventory.availableQuantity < assignment.assignedQuantity
        ) {
          return {
            error: `Insufficient stock for ingredient: ${assignment.ingredientName}.`,
          };
        }

        // Update ingredient inventory and create usage record
        await prisma.ingredientInventory.update({
          where: { id: ingredientInventory.id },
          data: {
            availableQuantity: { decrement: assignment.assignedQuantity },
          },
        });

        // Create an IngredientUsage record for each ingredient in the meal plan
        await prisma.ingredientUsage.create({
          data: {
            ingredientName: ingredientInventory.name,
            assignedQuantity: assignment.assignedQuantity,
            mealPlanId: mealPlan.id,
            measuringUnitName: ingredientInventory.measuringUnitName,
          },
        });
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Create meal plan error:", error);
    return {
      error:
        error ||
        "An error occurred while creating the meal plan. Please try again.",
    };
  }
}

export const getMealPlanByEvent = async (
  eventId: string
): Promise<ResponseType<MealPlanResponseType[]>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const mealPlans = await prisma.mealPlan.findMany({
      where: { eventId },
      include: {
        chef: {
          include: {
            user: { select: { name: true } },
          },
        },
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        ingredientUsage: {
          select: {
            mealPlanId: true,
            ingredientName: true,
            assignedQuantity: true,
            measuringUnitName: true,
            quantityUsed: true,
          },
        },
      },
    });

    if (!mealPlans)
      throw new Error(`Meal plan for event ID ${eventId} not found.`);

    // Transform the data into a more readable structure
    const transformedData = mealPlans.map((mealPlan) => ({
      eventName: mealPlan.event.name,
      name: mealPlan.name,
      chefs: mealPlan.chef.map(({ user }) => user.name),
      ingredientUsage: mealPlan.ingredientUsage.map((usage) => ({
        ingredientName: usage.ingredientName,
        assignedQuantity: usage.assignedQuantity,
        unit: usage.measuringUnitName,
        quantityUsed: usage.quantityUsed,
        mealPlanId: usage.mealPlanId,
        mealPlanName: mealPlan.name,
        chefs: mealPlan.chef.map(({ user }) => user.name),
      })),
    }));

    return { success: true, data: transformedData };
  } catch (error) {
    console.error("Get meal plan by event error:", error);
    return {
      error: error || "An error occurred while getting the meal plan by event.",
    };
  }
};

export const updateIngredientUsage = async (
  mealPlanId: string,
  data: IngredientUsageValues
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId) throw new Error("Not authenticated.");

    if (!checkUserAuthorization(role as UserRole))
      throw new Error("Not authorized.");

    const { ingredientName, quantityUsed } = data;

    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: { ingredientUsage: true },
    });

    if (!mealPlan)
      return { error: `Meal plan with ID ${mealPlanId} not found.` };

    const ingredientUsage = mealPlan.ingredientUsage.find(
      (usage) => usage.ingredientName === ingredientName
    );

    if (!ingredientUsage)
      return {
        error: `Ingredient usage for ingredient '${ingredientName}' not found.`,
      };

    await prisma.ingredientUsage.update({
      where: { id: ingredientUsage.id },
      data: { quantityUsed: quantityUsed },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Update ingredient usage error:", error);
    return {
      error: error || "An error occurred while updating ingredient usage.",
    };
  }
};
