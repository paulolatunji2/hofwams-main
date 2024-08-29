import { z } from "zod";
import { ShelfLifeUnit, Unit } from "@prisma/client";

import { requiredString } from "./auth";

export const ingredientInventorySchema = z.object({
  name: requiredString,
  shelfLife: z.coerce.number().int().positive(),
  shelfLifeUnit: z.nativeEnum(ShelfLifeUnit),
  expiryDate: z.coerce.date(),
  availableQuantity: z.coerce.number().int().positive(),
  unit: z.nativeEnum(Unit),
});

export type IngredientInventoryValues = z.infer<
  typeof ingredientInventorySchema
>;

export const updateIngredientInventorySchema = z.object({
  name: z.string().optional(),
  shelfLife: z.coerce.number().int().positive().optional(),
  shelfLifeUnit: z.nativeEnum(ShelfLifeUnit).optional(),
  expiryDate: z.coerce.date().optional(),
  availableQuantity: z.coerce.number().int().positive().optional(),
  unit: z.nativeEnum(Unit).optional(),
});

export type UpdateIngredientInventoryValues = z.infer<
  typeof updateIngredientInventorySchema
>;

export const ingredientUsageSchema = z.object({
  ingredientName: requiredString,
  quantityUsed: z.coerce.number().int().optional(),
});

export type IngredientUsageValues = z.infer<typeof ingredientUsageSchema>;
