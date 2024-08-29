"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Department } from "@prisma/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";

import { assignDepartmentSchema, AssignDepartmentValues } from "@/schema/chef";
import { assignDepartment } from "@/actions/chef-actions";

export const AssignDepartmentForm = ({ chefId }: { chefId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AssignDepartmentValues>({
    resolver: zodResolver(assignDepartmentSchema),
    defaultValues: {
      department: Department.HOT_KITCHEN,
    },
  });

  const onSubmit = async (values: AssignDepartmentValues) => {
    setIsLoading(true);
    try {
      const response = await assignDepartment(chefId, values.department);
      if (response.success) {
        toast.success("Department assigned successfully!");
        form.reset();
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.error("Error assigning department:", error);
      toast.error("An error occurred while assigning the department.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          type="select"
          name="department"
          label="Select Department"
          form={form}
          selectItems={[
            Department.BAKERY,
            Department.COLD_KITCHEN,
            Department.COLD_KITCHEN,
            Department.HOT_KITCHEN,
          ]}
        />
        <LoadingButton isLoading={isLoading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};
