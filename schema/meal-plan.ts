import { z } from "zod";

import { requiredString } from "./auth";

export const baseSchema = z.object({
  name: requiredString,
  description: z.string().trim().optional(),
  note: z.string().trim().optional(),
  ingredientNames: z.array(requiredString),
  chefIds: z.array(z.string()),
});

const extendSchemaForIngredients = (ingredientNames: string[]) => {
  const dynamicFields: Record<string, z.ZodTypeAny> = {};

  ingredientNames.forEach((ingredient) => {
    dynamicFields[`${ingredient}_assignedQuantity`] = z.coerce
      .number()
      .positive({
        message: `Assigned quantity for ${ingredient} must be a positive number.`,
      })
      .refine((value) => value > 0, {
        message: `Assigned quantity for ${ingredient} is required.`,
      });
  });

  return z.object(dynamicFields);
};

export const generateFullMealPlanSchema = (ingredientNames: string[]) => {
  if (ingredientNames.length > 0) {
    const dynamicSchema = extendSchemaForIngredients(ingredientNames);
    return baseSchema.merge(dynamicSchema);
  }
  return baseSchema;
};
