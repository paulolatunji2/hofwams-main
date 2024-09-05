"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createMeal } from "@/actions/event-actions";
import { mealSchema, MealValues } from "@/schema/event";
import { CreateMealOrDrinkDialog } from "./create-meal-dialog";

export const CreateMeal = ({
  mealCategoryOptions,
}: {
  mealCategoryOptions: string[];
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MealValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const onSubmit = async (data: MealValues) => {
    setIsLoading(true);
    try {
      const response = await createMeal(data);
      if (response.success) {
        toast.success("Meal created successfully!");
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.log({ error });
      toast.error("An error occurred while creating the meal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateMealOrDrinkDialog
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      categoryType="Meal"
      selectItems={mealCategoryOptions}
    />
  );
};
