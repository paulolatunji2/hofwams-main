"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Meal, ShelfLifeUnit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { ComboboxForm } from "@/components/gen/combobox-form";
import { LoadingButton } from "@/components/gen/loading-button";
import { CreateMealCategoryDialog } from "@/components/organizer/create-meal-category";
import { CreateMeasuringUnitDialog } from "./create-measuring-unit";

import { updateMealSchema, UpdateMealValues } from "@/schema/event";
import { getMealCategories, updateMeal } from "@/actions/event-actions";
import { getAllUnits } from "@/actions/chef-actions";

interface Props {
  meal: Meal;
  setIsOpen: (open: boolean) => void;
}

export const UpdateMealForm = ({ meal, setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateMealValues>({
    resolver: zodResolver(updateMealSchema),
    defaultValues: {
      name: meal.name,
      category: meal.mealCategoryName,
      shelfLife: meal.shelfLife ?? 0,
      shelfLifeUnit: meal.shelfLifeUnit ?? ShelfLifeUnit.DAY,
      quantity: meal.quantity ?? 0,
      measuringUnitName: meal.measuringUnitName || "",
    },
  });

  const mealCategories = useQuery({
    queryKey: ["mealCategories"],
    queryFn: async () => await getMealCategories(),
  });

  const units = useQuery({
    queryKey: ["units"],
    queryFn: async () => await getAllUnits(),
  });

  const onSubmit = async (values: UpdateMealValues) => {
    setIsLoading(true);
    try {
      const res = await updateMeal(meal.id, values);
      if (res.success) {
        toast.success("Drink updated successfully");
        form.reset();
        setIsOpen(false);
      } else if (res.error) {
        toast.error(res.error as string);
      }
    } catch (error) {
      console.error("Update meal error:", error);
      toast.error("An error occurred while updating the meal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
        <CustomFormField name="name" label="Name" form={form} />

        <ComboboxForm
          form={form}
          name="category"
          label={"Category"}
          options={mealCategories.data?.data ?? []}
          createOption={<CreateMealCategoryDialog />}
        />

        <CustomFormField
          name="shelfLife"
          label="Shelf Life"
          form={form}
          type="number"
        />

        <CustomFormField
          name="shelfLifeUnit"
          label="Shelf Life Unit"
          form={form}
          type="select"
          selectItems={[
            ShelfLifeUnit.DAY,
            ShelfLifeUnit.WEEK,
            ShelfLifeUnit.MONTH,
            ShelfLifeUnit.YEAR,
          ]}
        />

        <CustomFormField
          name="quantity"
          label="Quantity"
          form={form}
          type="number"
        />

        <ComboboxForm
          form={form}
          name="measuringUnitName"
          label={"Unit"}
          createOption={<CreateMeasuringUnitDialog />}
          options={units.data?.data ?? []}
        />

        <LoadingButton isLoading={isLoading}>Update</LoadingButton>
      </form>
    </Form>
  );
};
