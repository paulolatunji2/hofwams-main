import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

import { assignUserRole } from "@/actions/admin-actions";
import { updateUserRoleSchema, UpdateUserRoleValues } from "@/schema/user";

export const UpdateUserRoleForm = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateUserRoleValues>({
    resolver: zodResolver(updateUserRoleSchema),
    defaultValues: {
      role: UserRole.CHEF,
    },
  });

  const onSubmit = async (data: UpdateUserRoleValues) => {
    console.log(data);
    try {
      setIsLoading(true);
      const response = await assignUserRole(userId, data.role);

      if (response.success) {
        toast.success("User role updated successfully!");
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error(
        "An error occurred while updating the user role. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          name="role"
          label="User Role"
          type="select"
          form={form}
          selectItems={["ADMIN", "CHEF"]}
          placeholder="Assign role"
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
