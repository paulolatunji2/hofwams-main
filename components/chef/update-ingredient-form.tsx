"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IngredientInventory, ShelfLifeUnit } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { CustomDateField } from "@/components/gen/custom-date-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { ComboboxForm } from "@/components/gen/combobox-form";
import { CreateMeasuringUnitDialog } from "./create-measuring-unit";

import {
  ingredientInventorySchema,
  IngredientInventoryValues,
} from "@/schema/ingredient-inventory";
import {
  createIngredientInventory,
  updateIngredientInventory,
} from "@/actions/ingredient-inventory-actions";

interface Props {
  ingredient?: IngredientInventory;
  type: "create" | "update";
  setIsOpen?: (isOpen: boolean) => void;
  units?: string[];
}

export const CreateOrUpdateIngredientForm = ({
  ingredient,
  type,
  setIsOpen,
  units,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IngredientInventoryValues>({
    resolver: zodResolver(ingredientInventorySchema),
    defaultValues: {
      name: ingredient?.name || "",
      purchaseDate: ingredient?.purchaseDate || new Date(),
      expiryDate: ingredient?.expiryDate || new Date(),
      availableQuantity: ingredient?.availableQuantity || 0,
      unit: ingredient?.measuringUnitName || "",
    },
  });

  const onSubmit = async (values: IngredientInventoryValues) => {
    setIsLoading(true);

    try {
      const response =
        type === "create"
          ? await createIngredientInventory(values)
          : await updateIngredientInventory(ingredient?.id!, values);

      if (response.success) {
        toast.success(`Ingredient ${type}ed successfully!`);
        form.reset();
        setIsOpen?.(false);
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomFormField form={form} name="name" label={"Name"} />
        <CustomFormField
          form={form}
          name="shelfLife"
          label={"Shelf Life"}
          type="number"
        />
        <CustomFormField
          form={form}
          name="shelfLifeUnit"
          label={"Shelf Life Unit"}
          type="select"
          selectItems={[
            ShelfLifeUnit.DAY,
            ShelfLifeUnit.WEEK,
            ShelfLifeUnit.MONTH,
            ShelfLifeUnit.YEAR,
          ]}
        />
        <CustomDateField form={form} name="expiryDate" label={"Expiry Date"} />

        <CustomFormField
          form={form}
          name="availableQuantity"
          label={"Available Quantity"}
          type="number"
        />

        <ComboboxForm
          form={form}
          name="unit"
          label={"Unit"}
          createOption={<CreateMeasuringUnitDialog />}
          options={units || []}
        />

        <LoadingButton isLoading={isLoading} type="submit">
          {type === "create" ? "Create" : "Update"}
        </LoadingButton>
      </form>
    </Form>
  );
};
