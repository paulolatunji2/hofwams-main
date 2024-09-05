import { z } from "zod";

import {
  Dietary,
  EventTimeType,
  MealSize,
  ShelfLifeUnit,
} from "@prisma/client";
import { requiredString } from "./auth";

export const eventSchema = z
  .object({
    name: requiredString,
    description: requiredString,
    maxNumberOfGuests: z.coerce
      .number()
      .int()
      .positive("Max number of guests must be a positive integer"),
    allowExtraGuest: z.boolean(),
    maxNumberOfExtraGuest: z.coerce
      .number()
      .int()
      .positive("Max number of extra guests must be a positive integer")
      .optional(),
    allowMinor: z.boolean(),
    meals: z.array(z.string()),
    drinks: z.array(z.string()),
    mealTimeType: z.nativeEnum(EventTimeType),
    time: requiredString,
    date: z.coerce.date(),
    location: requiredString,
  })
  .refine(
    (data) =>
      !data.allowExtraGuest ||
      (data.allowExtraGuest && data.maxNumberOfExtraGuest !== undefined),
    {
      path: ["maxNumberOfExtraGuest"], // Point to the field that failed validation
      message:
        "Max number of extra guests must be provided when allowing extra guests",
    }
  );

export type EventValues = z.infer<typeof eventSchema>;

export const mealSchema = z.object({
  name: requiredString,
  category: requiredString,
});

export type MealValues = z.infer<typeof mealSchema>;

export const updateMealSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  shelfLife: z.coerce.number().positive().optional(),
  quantity: z.coerce.number().optional(),
  shelfLifeUnit: z.nativeEnum(ShelfLifeUnit).optional(),
  measuringUnitName: z.string().optional(),
});

export type UpdateMealValues = z.infer<typeof updateMealSchema>;

export const mealCategorySchema = z.object({
  name: requiredString,
});

export type MealCategoryValues = z.infer<typeof mealCategorySchema>;

export const drinkSchema = z.object({
  name: requiredString,
  category: requiredString,
});

export type DrinkValues = z.infer<typeof drinkSchema>;

export const updateDrinkSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  expiryDate: z.coerce.date().optional(),
  quantity: z.coerce.number().optional(),
  measuringUnitName: z.string().optional(),
});

export type UpdateDrinkValues = z.infer<typeof updateDrinkSchema>;

export const drinkCategorySchema = z.object({
  name: requiredString,
});

export type DrinkCategoryValues = z.infer<typeof drinkCategorySchema>;

export const updateEventSchema = z.object({
  name: z.string().optional(),
  maxNumberOfGuests: z.coerce
    .number()
    .int()
    .positive("Max number of guests must be a positive integer")
    .optional(),
  allowExtraGuest: z.boolean().optional(),
  maxNumberOfExtraGuest: z.coerce
    .number()
    .int()
    .positive("Max number of extra guests must be a non-negative integer")
    .optional(),
  allowMinor: z.boolean().optional(),
  time: z.string().optional(),
  date: z.coerce.date().optional(),
  location: z.string().optional(),
});

export type UpdateEventValues = z.infer<typeof updateEventSchema>;

export const eventRegistrationSchema = z
  .object({
    firstName: requiredString,
    lastName: requiredString,
    email: requiredString.email("Invalid email address"),
    phoneNumber: requiredString
      .min(11, "Phone number is required")
      .max(14, "Phone number is required"),
    age: z.coerce.number().int().positive("Age must be a positive integer"),
    nationality: requiredString,
    comingWithExtra: z.boolean().optional().default(false),
    numberOfExtra: z.coerce.number().int().optional().nullable(),
    numberOfAdults: z.coerce.number().int().optional().nullable(),
    numberOfMinors: z.coerce.number().int().optional().nullable(),
    extraType: z
      .array(z.enum(["ADULT", "MINOR"]))
      .optional()
      .nullable(),
    preferredDishes: z.array(z.string()),
    preferredDrinks: z.array(z.string()),
    dietary: z.nativeEnum(Dietary),
    allergies: z.array(z.string()).optional(),
    mealSize: z.nativeEnum(MealSize),
  })
  .refine(
    (data) => {
      const numberOfAdults = data.numberOfAdults ?? 0;
      const numberOfMinors = data.numberOfMinors ?? 0;
      const numberOfExtra = data.numberOfExtra ?? 0;

      return numberOfExtra === numberOfAdults + numberOfMinors;
    },
    {
      message:
        "The number of extra attendees must be equal to the sum of adults and minors.",
      path: ["numberOfExtra"],
    }
  );

export type EventRegistrationValues = z.infer<typeof eventRegistrationSchema>;

export const createAllergySchema = z.object({
  name: requiredString,
});

export type CreateAllergyValues = z.infer<typeof createAllergySchema>;
