"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { CustomFormDialog } from "@/components/gen/custom-form-dialog";

import { mealCategorySchema, MealCategoryValues } from "@/schema/event";
import { createMealCategory } from "@/actions/event-actions";

export const CreateMealCategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<MealCategoryValues>({
    resolver: zodResolver(mealCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: MealCategoryValues) => {
    setIsLoading(true);

    const { name } = data;
    toast.loading("Creating meal category...", { id: name });

    try {
      const response = await createMealCategory(data);
      if (response.success) {
        toast.success("Meal category created successfully!", { id: name });
        form.reset();
        setIsOpen(false);
      } else if (response.error) {
        toast.error(response.error as string, { id: name });
      }
    } catch (error) {
      console.error("Error creating meal category:", error);
      toast.error("An error occurred while creating the meal category.", {
        id: data.name,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomFormDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Meal Category"
    >
      <Form {...form}>
        <form className="space-y-8">
          <CustomFormField form={form} name="name" label={"Name"} />

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
