"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EventTimeType } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { MultiSelectField } from "@/components/gen/multi-select-field";
import { CreateMeal } from "@/components/organizer/create-meal";
import { CreateDrink } from "@/components/organizer/create-drink";
import { CustomDateField } from "./custom-date-field";

import { eventSchema, EventValues } from "@/schema/event";
import { createEvent, updateEvent } from "@/actions/event-actions";
import { EventResponseType } from "@/types";

interface CreateOrEditEventFormProps {
  meals: string[];
  drinks: string[];
  eventInfo?: EventResponseType;
}

export const CreateOrEditEventForm = ({
  meals,
  drinks,
  eventInfo,
}: CreateOrEditEventFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const formattedTime = eventInfo?.date ? format(eventInfo.date, "hh:mm") : "";

  const form = useForm<EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: eventInfo?.name || "",
      description: eventInfo?.description || "",
      maxNumberOfGuests: eventInfo?.maxNumberOfGuests || 0,
      allowExtraGuest: eventInfo?.allowExtraGuest || false,
      maxNumberOfExtraGuest: eventInfo?.maxNumberOfExtraGuest || undefined,
      allowMinor: eventInfo?.allowMinor || false,
      meals: eventInfo?.meals || [],
      drinks: eventInfo?.drinks || [],
      mealTimeType: eventInfo?.mealTimeType || EventTimeType.DINNER,
      time: formattedTime,
      date: eventInfo?.date || new Date(),
      location: eventInfo?.location || "",
    },
  });

  const allowExtraGuest = form.watch("allowExtraGuest");

  const router = useRouter();

  const onSubmit = async (data: EventValues) => {
    setIsLoading(true);
    console.log({ data });

    const route = eventInfo
      ? "/dashboard/admin/events"
      : "/dashboard/organizer/events";

    const successMessage = eventInfo
      ? "Event updated successfully!"
      : "Event created successfully!";

    try {
      const response = eventInfo
        ? await updateEvent(eventInfo.id, data)
        : await createEvent(data);

      if (response.success) {
        toast.success(successMessage);
        router.push(route);
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.log({ error });
      toast.error(
        `An error occurred while ${
          eventInfo ? "updating" : "creating"
        } the event.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField name="name" label="Event Name" form={form} />
        <CustomFormField
          name="description"
          label="Event Description"
          form={form}
          type="textarea"
        />
        <CustomFormField
          name="maxNumberOfGuests"
          label="Max Number of Guests"
          type="number"
          form={form}
        />
        <CustomFormField
          name="allowExtraGuest"
          label="Allow Extra Guest"
          type="checkbox"
          form={form}
        />
        {allowExtraGuest && (
          <CustomFormField
            name="maxNumberOfExtraGuest"
            label="Max Number of Extra Guests"
            type="number"
            form={form}
          />
        )}

        <CustomFormField
          name="allowMinor"
          label="Allow Minor"
          type="checkbox"
          form={form}
        />

        <MultiSelectField
          options={meals}
          name="meals"
          form={form}
          createMenu={<CreateMeal />}
          label="Meals"
        />

        <MultiSelectField
          options={drinks}
          name="drinks"
          form={form}
          createMenu={<CreateDrink />}
          label="Drinks"
        />

        <CustomFormField
          name="mealTimeType"
          label="Meal Time"
          type="select"
          form={form}
          selectItems={["BREAKFAST", "LUNCH", "DINNER"]}
          placeholder="Select meal time"
        />

        <div className="grid grid-cols-2 items-center gap-4">
          <CustomFormField
            name="time"
            label="Event Time"
            type="time"
            form={form}
          />

          <CustomDateField form={form} label="Event Date" name="date" />
        </div>
        <CustomFormField name="location" label="Event Location" form={form} />

        <div className="flex">
          <LoadingButton
            isLoading={isLoading}
            type="submit"
            className="w-full max-w-[400px] mx-auto"
          >
            Submit
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};
