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

interface CreateMealOrDrinkDialogProps {
  categoryType: "Meal" | "Drink";
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  selectItems?: string[];
  placeholder?: string;
  type?: string;
}

export const CreateMealOrDrinkDialog = ({
  isLoading,
  categoryType,
  form,
  onSubmit,
  selectItems,
  placeholder,
  type,
}: CreateMealOrDrinkDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
          onClick={() => setIsOpen(true)}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create {categoryType}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mr-auto sm:mx-auto text-emerald-500">
            {categoryType}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-8">
            <CustomFormField form={form} name="name" label={"Name"} />
            <CustomFormField
              form={form}
              name="type"
              label={"Type"}
              selectItems={selectItems}
              placeholder={placeholder}
              type={type}
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
      </DialogContent>
    </Dialog>
  );
};
