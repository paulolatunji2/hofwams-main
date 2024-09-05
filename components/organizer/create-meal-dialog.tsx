"use client";

import { useState } from "react";
import { PlusSquare } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { ComboboxForm } from "../gen/combobox-form";
import { CreateMealCategoryDialog } from "./create-meal-category";
import { CustomFormDialog } from "../gen/custom-form-dialog";
import { CreateDrinkCategoryDialog } from "./create-drink-category";

interface CreateMealOrDrinkDialogProps {
  categoryType: "Meal" | "Drink";
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  selectItems: string[];
  placeholder?: string;
  type?: string;
}

export const CreateMealOrDrinkDialog = ({
  isLoading,
  categoryType,
  form,
  onSubmit,
  selectItems,
}: CreateMealOrDrinkDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CustomFormDialog
      title={categoryType === "Meal" ? "Meal" : "Drink"}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form className="space-y-8">
          <CustomFormField form={form} name="name" label={"Name"} />
          <ComboboxForm
            form={form}
            name="category"
            label={"Category"}
            options={selectItems}
            createOption={
              categoryType === "Meal" ? (
                <CreateMealCategoryDialog />
              ) : (
                <CreateDrinkCategoryDialog />
              )
            }
          />

          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
              >
                Cancel
              </Button>
            </DialogClose>
            <LoadingButton
              isLoading={isLoading}
              type="button"
              onClick={() => onSubmit(form.getValues())}
            >
              Submit
            </LoadingButton>
          </DialogFooter>
        </form>
      </Form>
    </CustomFormDialog>
  );
};
