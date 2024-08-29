"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { MultiSelectField } from "@/components/gen/multi-select-field";
import { CreateCuisineDialog } from "./create-cuisine";

import {
  createChefProfileSchema,
  CreateChefProfileValues,
} from "@/schema/chef";
import { ChefProfileResponseType } from "@/types";
import { LoadingButton } from "../gen/loading-button";
import { CustomDialog } from "../gen/custom-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { createChefProfile, updateChefProfile } from "@/actions/chef-actions";

interface ChefProfileProps {
  cuisines: string[];
  data?: ChefProfileResponseType;
}

export const ChefProfile = ({ data, cuisines }: ChefProfileProps) => {
  return (
    <Card className="w-full max-w-2xl p-6 bg-background rounded-lg shadow-lg border-none mx-auto my-10">
      <CardHeader>
        <CardTitle>Chef Profile</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold text-lg">Role</h2>
          <p className="text-slate-400 text-sm">{data?.role}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Nationality</h2>
          <p className="text-slate-400 text-sm">{data?.nationality}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Specialty</h2>
          <p className="text-slate-400 text-sm">{data?.specialty}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Cuisines</h2>
          <p className="text-slate-400 text-sm">{data?.cuisines.join(", ")}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg">Department</h2>
          <p className="text-slate-400 text-sm">{data?.department || "N/A"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <CreateOrUpdateChefProfile
          type="edit"
          cuisines={cuisines}
          data={data}
        />
      </CardFooter>
    </Card>
  );
};

interface Props {
  cuisines: string[];
  type: "create" | "edit";
  data?: ChefProfileResponseType;
}

export const CreateOrUpdateChefProfile = ({ cuisines, type, data }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<CreateChefProfileValues>({
    resolver: zodResolver(createChefProfileSchema),
    defaultValues: {
      nationality: data?.nationality || "",
      specialty: data?.specialty || "",
      cuisines: data?.cuisines || [],
    },
  });

  const onSubmit = async (data: CreateChefProfileValues) => {
    setIsLoading(true);
    const status = type === "create" ? "Created" : "Updated";
    toast.loading(`${type === "create" ? "Creating" : "Updating"} profile...`, {
      id: data.nationality,
    });
    try {
      const response =
        type === "create"
          ? await createChefProfile(data)
          : await updateChefProfile(data);

      if (response.success) {
        toast.success(`${status} profile successfully!`, {
          id: data.nationality,
        });
        setIsOpen(false);
      } else if (response.error) {
        toast.error(response.error as string, { id: data.nationality });
      }
    } catch (error) {
      console.error("Error creating/updating profile:", error);
      toast.error(
        `An error occurred while ${
          type === "create" ? "creating" : "updating"
        } the profile.`,
        {
          id: data.nationality,
        }
      );
    }
  };

  const title =
    type === "create" ? "Create Chef Profile" : "Update Chef Profile";

  return (
    <CustomDialog title={title} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField name="nationality" label="Nationality" form={form} />
          <CustomFormField name="specialty" label="Specialty" form={form} />
          <MultiSelectField
            options={cuisines}
            name="cuisines"
            form={form}
            createMenu={<CreateCuisineDialog />}
            label="Cuisines"
          />
          <LoadingButton isLoading={isLoading} type="submit">
            Submit
          </LoadingButton>
        </form>
      </Form>
    </CustomDialog>
  );
};
