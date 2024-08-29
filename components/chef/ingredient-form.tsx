"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";

import {
  ingredientUsageSchema,
  IngredientUsageValues,
} from "@/schema/ingredient-inventory";
import { updateIngredientUsage } from "@/actions/event-planning-actions";

interface Props {
  ingredientUsage: {
    ingredientName: string;
    quantityUsed: number | null;
  };
  mealPlanId: string;
  setIsOpen: (open: boolean) => void;
}
export const IngredientUsageForm = ({
  ingredientUsage,
  mealPlanId,
  setIsOpen,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IngredientUsageValues>({
    resolver: zodResolver(ingredientUsageSchema),
    defaultValues: {
      ingredientName: ingredientUsage.ingredientName,
      quantityUsed: ingredientUsage.quantityUsed || 0,
    },
  });

  const onSubmit = async (data: IngredientUsageValues) => {
    setIsLoading(true);
    try {
      const response = await updateIngredientUsage(mealPlanId, data);
      if (response.success) {
        toast.success("Ingredient usage updated successfully!");
        form.reset();
        setIsOpen(false);
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.error("Error updating ingredient usage:", error);
      toast.error("An error occurred while updating the ingredient usage.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          form={form}
          name="ingredientName"
          label="Ingredient Name"
          type="text"
          readonly={true}
        />
        <CustomFormField
          form={form}
          name="quantityUsed"
          label="Quantity Used"
          type="number"
        />

        <LoadingButton isLoading={isLoading} type="submit">
          Update
        </LoadingButton>
      </form>
    </Form>
  );
};
