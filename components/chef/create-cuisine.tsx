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
import { createCuisine } from "@/actions/chef-actions";
import { createCuisineSchema, CreateCuisineValues } from "@/schema/chef";

export const CreateCuisineDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCuisineValues>({
    resolver: zodResolver(createCuisineSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: CreateCuisineValues) => {
    setIsLoading(true);

    toast.loading("Creating cuisine...", { id: data.name });

    try {
      const response = await createCuisine(data);
      if (response.success) {
        toast.success("Cuisine created successfully!", { id: data.name });
        form.reset();
      } else if (response.error) {
        toast.error(response.error as string, { id: data.name });
      }
    } catch (error) {
      console.error("Error creating cuisine:", error);
      toast.error("An error occurred while creating the cuisine.", {
        id: data.name,
      });
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
          Create Cuisine
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mr-auto sm:mx-auto text-emerald-500">
            Cuisine
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
