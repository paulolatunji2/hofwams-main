"use client";

import { useState } from "react";

import { CustomDialog } from "./custom-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { createAllergy } from "@/actions/guest-actions";
import { createAllergySchema, CreateAllergyValues } from "@/schema/event";

export const CreateAllergy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateAllergyValues>({
    resolver: zodResolver(createAllergySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateAllergyValues) => {
    setIsLoading(true);

    const { name } = data;

    toast.loading("Creating allergy...", { id: name });

    try {
      const response = await createAllergy(name);
      if (response.success) {
        toast.success("Allergy created successfully!", { id: name });
        form.reset();
        setIsOpen(false);
      } else if (response.error) {
        toast.error(response.error as string, { id: name });
      }
    } catch (error) {
      console.error("Error creating allergy:", error);
      toast.error("An error occurred while creating the allergy.", {
        id: name,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomDialog isOpen={isOpen} setIsOpen={setIsOpen} title="Create Allergy">
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
    </CustomDialog>
  );
};
