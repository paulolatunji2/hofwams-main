import { ChefProfile, ChefType, Event, Guest } from "@prisma/client";

export interface EventResponseType extends Event {
  meals: string[];
  drinks: string[];
}

export interface MealResponseType {
  name: string;
  type: string;
}

export interface DrinkResponseType {
  name: string;
  type: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
}

export interface ChefProfileResponseType extends ChefProfile {
  name: string;
  cuisines: string[];
}

export interface CuisineResponseType {
  name: string;
}

export interface GuestResponseType extends Guest {
  fullName: string;
  allergies: string[];
  preferredDishes: string[];
  preferredDrinks: string[];
}

export interface UserResponseType {
  id: string;
  name: string;
  email: string;
  role: string;
  chefType: ChefType | null;
  createdAt: Date | string;
}

export interface MealPlanValues {
  name: string;
  description?: string;
  note?: string;
  ingredients: {
    ingredientName: string;
    assignedQuantity: number;
  }[];
  chefIds: string[];
}

export interface MealPlanResponseType {
  eventName: string;
  name: string;
  chefs: string[];
  ingredientUsage: MealPlanDataModel[];
}

export interface MealPlanDataModel {
  mealPlanId: string;
  mealPlanName: string;
  assignedQuantity: number;
  ingredientName: string;
  quantityUsed: number | null;
  unit: string;
  chefs: string[];
}
