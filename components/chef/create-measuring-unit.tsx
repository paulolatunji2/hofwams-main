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
import { createMeasuringUnit } from "@/actions/chef-actions";
import {
  createMeasuringUnitSchema,
  CreateMeasuringUnitValues,
} from "@/schema/chef";

export const CreateMeasuringUnitDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateMeasuringUnitValues>({
    resolver: zodResolver(createMeasuringUnitSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateMeasuringUnitValues) => {
    setIsLoading(true);

    const { name } = data;
    toast.loading("Creating measuring unit...", { id: name });

    try {
      const response = await createMeasuringUnit(data);
      if (response.success) {
        toast.success("Measuring Unit created successfully!", { id: name });
        form.reset();
        setIsOpen(false);
      } else if (response.error) {
        toast.error(response.error as string, { id: name });
      }
    } catch (error) {
      console.error("Error creating measuring unit:", error);
      toast.error("An error occurred while creating the measuring unit.", {
        id: data.name,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
          onClick={() => setIsOpen(true)}
        >
          <PlusSquare className="mr-2 h-4 w-4" />
          Create Measuring Unit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mr-auto sm:mx-auto text-emerald-500">
            Measuring Unit
          </DialogTitle>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
};
