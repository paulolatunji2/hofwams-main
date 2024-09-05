"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDrink } from "@/actions/event-actions";
import { drinkSchema, DrinkValues } from "@/schema/event";
import { CreateMealOrDrinkDialog } from "./create-meal-dialog";

export const CreateDrink = ({
  drinksCategories,
}: {
  drinksCategories: string[];
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DrinkValues>({
    resolver: zodResolver(drinkSchema),
    defaultValues: {
      name: "",
      category: "",
    },
  });

  const onSubmit = async (data: DrinkValues) => {
    setIsLoading(true);
    try {
      const response = await createDrink(data);
      if (response.success) {
        toast.success("Drink created successfully!");
        form.reset();
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.log({ error });
      toast.error("An error occurred while creating the drink.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CreateMealOrDrinkDialog
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      categoryType="Drink"
      selectItems={drinksCategories}
    />
  );
};
