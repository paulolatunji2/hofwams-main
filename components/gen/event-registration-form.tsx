"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dietary, MealSize } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { MultiSelectField } from "./multi-select-field";
import { CreateAllergy } from "./create-allergy";
import { LoadingButton } from "./loading-button";

import {
  eventRegistrationSchema,
  EventRegistrationValues,
} from "@/schema/event";
import { EventResponseType } from "@/types";
import { registerForEvent } from "@/actions/guest-actions";

export const EventRegistrationForm = ({
  eventInfo,
  allergies,
}: {
  eventInfo: EventResponseType;
  allergies: string[];
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { id, name, allowExtraGuest, allowMinor } = eventInfo;

  const router = useRouter();

  const form = useForm<EventRegistrationValues>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      age: 10,
      nationality: "",
      comingWithExtra: false,
      numberOfExtra: 1,
      numberOfAdults: 1,
      numberOfMinors: 0,
      extraType: ["ADULT"],
      preferredDishes: [],
      preferredDrinks: [],
      dietary: Dietary.VEGAN,
      allergies: [],
      mealSize: MealSize.REGULAR_SIZE,
    },
  });

  const onSubmit = async (data: EventRegistrationValues) => {
    setIsLoading(true);
    try {
      const response = await registerForEvent(id, data);
      if (response.success) {
        toast.success(
          `Congratulations, you have successfully registered for ${name} 🎊!`
        );
        form.reset();
        router.push("/");
      } else if (response.error) {
        toast.error(response.error as string);
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField
          compulsory
          name="firstName"
          label="First Name"
          form={form}
        />

        <CustomFormField
          compulsory
          name="lastName"
          label="Last Name"
          form={form}
        />

        <CustomFormField
          compulsory
          name="email"
          label="Email"
          form={form}
          type="email"
        />

        <CustomFormField
          compulsory
          form={form}
          name="phoneNumber"
          label="Phone Number"
          type="tel"
        />
        <CustomFormField
          compulsory
          name="age"
          label="Age"
          form={form}
          type="number"
        />

        <CustomFormField
          compulsory
          name="nationality"
          label="Nationality"
          form={form}
        />

        {allowExtraGuest && (
          <CustomFormField
            form={form}
            name="comingWithExtra"
            label="Coming with Extra"
            type="checkbox"
          />
        )}

        {form.watch("comingWithExtra") && (
          <div className="space-y-4">
            <CustomFormField
              form={form}
              name="numberOfExtra"
              label="Number of Extra Guests"
              type="number"
            />

            <CustomFormField
              form={form}
              name="numberOfAdults"
              label="Number of Adults"
              type="number"
            />

            {allowMinor && (
              <CustomFormField
                form={form}
                name="numberOfMinors"
                label="Number of Minors"
                type="number"
              />
            )}

            <MultiSelectField
              name="extraType"
              label="Extra Type"
              form={form}
              options={["ADULT", "MINOR"]}
            />
          </div>
        )}

        <MultiSelectField
          name="preferredDishes"
          label="Preferred Dishes"
          form={form}
          options={eventInfo.meals}
          placeholder="Select your preferred dishes"
        />

        <MultiSelectField
          name="preferredDrinks"
          label="Preferred Drinks"
          form={form}
          options={eventInfo.drinks}
          placeholder="Select your preferred drinks"
        />

        <CustomFormField
          compulsory
          name="dietary"
          label="Dietary Preferences"
          type="select"
          form={form}
          selectItems={[
            "VEGETARIAN",
            "VEGAN",
            "GLUTEN_FREE",
            "LACTOSE_FREE",
            "DAIRY_FREE",
            "NUT_FREE",
            "PESCATARIAN",
            "PALEO",
            "KETO",
            "HALAL",
            "KOSHER",
            "LOW_CARB",
            "LOW_SODIUM",
            "LOW_FAT",
            "MEDITERRANEAN",
            "INTERMITTENT_FASTING",
            "FODMAP",
          ]}
        />

        <MultiSelectField
          name="allergies"
          label="Allergies"
          form={form}
          options={allergies}
          placeholder="Select your allergies"
          createMenu={<CreateAllergy />}
        />

        <CustomFormField
          compulsory
          name="mealSize"
          label="Meal Size"
          type="select"
          form={form}
          selectItems={[
            MealSize.REGULAR_SIZE,
            MealSize.LARGE_SIZE,
            MealSize.LARGE_SIZE_PLUS_TAKE_AWAY,
            MealSize.REGULAR_SIZE_PLUS_TAKE_AWAY,
            MealSize.SMALL_SIZE,
            MealSize.SMALL_SIZE_PLUS_TAKE_AWAY,
          ]}
        />

        <LoadingButton
          className="w-full max-w-md mx-auto flex"
          isLoading={isLoading}
          type="submit"
        >
          Register
        </LoadingButton>
      </form>
    </Form>
  );
};
