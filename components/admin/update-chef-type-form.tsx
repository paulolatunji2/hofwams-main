import { zodResolver } from "@hookform/resolvers/zod";
import { ChefType } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { assignChefRole } from "@/actions/admin-actions";
import { updateChefTypeSchema, UpdateChefTypeValues } from "@/schema/user";

export const UpdateChefTypeForm = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateChefTypeValues>({
    resolver: zodResolver(updateChefTypeSchema),
    defaultValues: {
      chefType: ChefType.COMMI_1,
    },
  });

  const onSubmit = async (data: UpdateChefTypeValues) => {
    console.log(data);
    try {
      setIsLoading(true);
      const response = await assignChefRole(userId, data.chefType);

      if (response.success) {
        toast.success("Chef type updated successfully!");
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.error("Error updating chef type:", error);
      toast.error(
        "An error occurred while updating the chef type. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          name="chefType"
          label="Chef Type"
          type="select"
          form={form}
          selectItems={[
            "EXECUTIVE_CHEF",
            "EXECUTIVE_SOUS_CHEF",
            "SOUS_CHEF",
            "CHEF_DE_PARTIE",
            "DEMI_ChHEF_DE_PARTIE",
            "COMMI_1",
            "COMMI_2",
          ]}
          placeholder="Assign chef type"
        />

        <DialogFooter className="gap-4 justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton isLoading={isLoading} type="submit">
            Submit
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  );
};
