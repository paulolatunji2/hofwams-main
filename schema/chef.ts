import { z } from "zod";

import { requiredString } from "./auth";
import { Department } from "@prisma/client";

export const createChefProfileSchema = z.object({
  specialty: requiredString,
  nationality: requiredString,
  cuisines: z.array(requiredString),
});

export type CreateChefProfileValues = z.infer<typeof createChefProfileSchema>;

export const updateChefProfileSchema = z.object({
  nationality: z.string().optional(),
  specialty: z.string().optional(),
  cuisines: z.array(z.string()).optional(),
});

export type UpdateChefProfileValues = z.infer<typeof updateChefProfileSchema>;

export const createCuisineSchema = z.object({
  name: requiredString,
});

export type CreateCuisineValues = z.infer<typeof createCuisineSchema>;

export const updateCuisineSchema = z.object({
  name: z.string().optional(),
});

export type UpdateCuisineValues = z.infer<typeof updateCuisineSchema>;

export const assignDepartmentSchema = z.object({
  department: z.nativeEnum(Department),
});

export type AssignDepartmentValues = z.infer<typeof assignDepartmentSchema>;

export const createMeasuringUnitSchema = z.object({
  name: requiredString,
});

export type CreateMeasuringUnitValues = z.infer<
  typeof createMeasuringUnitSchema
>;
