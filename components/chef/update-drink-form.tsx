"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Drink } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { ComboboxForm } from "@/components/gen/combobox-form";
import { CreateDrinkCategoryDialog } from "@/components/organizer/create-drink-category";
import { CustomDateField } from "@/components/gen/custom-date-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { CreateMeasuringUnitDialog } from "./create-measuring-unit";

import { updateDrinkSchema, UpdateDrinkValues } from "@/schema/event";
import { getDrinkCategories, updateDrink } from "@/actions/event-actions";
import { getAllUnits } from "@/actions/chef-actions";

interface Props {
  drink: Drink;
  setIsOpen: (open: boolean) => void;
}

export const UpdateDrinkForm = ({ drink, setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateDrinkValues>({
    resolver: zodResolver(updateDrinkSchema),
    defaultValues: {
      name: drink.name,
      category: drink.drinkCategoryName,
      expiryDate: drink.expiryDate || new Date(),
      quantity: drink.quantity ?? 0,
      measuringUnitName: drink.measuringUnitName || "",
    },
  });

  const drinkCategories = useQuery({
    queryKey: ["drinkCategories"],
    queryFn: async () => await getDrinkCategories(),
  });

  const units = useQuery({
    queryKey: ["units"],
    queryFn: async () => await getAllUnits(),
  });

  const onSubmit = async (values: UpdateDrinkValues) => {
    setIsLoading(true);
    try {
      const res = await updateDrink(drink.id, values);
      if (res.success) {
        toast.success("Drink updated successfully");
        form.reset();
        setIsOpen(false);
      } else if (res.error) {
        toast.error(res.error as string);
      }
    } catch (error) {
      console.error("Update drink error:", error);
      toast.error("An error occurred while updating the drink.");
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
          options={drinkCategories.data?.data || []}
          createOption={<CreateDrinkCategoryDialog />}
        />
        <CustomDateField name="expiryDate" label="Expiry Date" form={form} />

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
          options={units.data?.data || []}
        />

        <LoadingButton isLoading={isLoading}>Update</LoadingButton>
      </form>
    </Form>
  );
};
