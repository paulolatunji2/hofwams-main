"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IngredientInventory } from "@prisma/client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomFormField } from "@/components/gen/custom-form-field";
import { MultiSelectField } from "@/components/gen/multi-select-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { Input } from "@/components/ui/input";

import { generateFullMealPlanSchema } from "@/schema/meal-plan";
import { createMealPlanForEvent } from "@/actions/event-planning-actions";

interface Props {
  mealName: string[];
  ingredientInventory: IngredientInventory[];
  chefs: { id: string; name: string }[];
  eventId: string;
}

export const CreateOrEditMealPlanForm = ({
  mealName,
  ingredientInventory,
  chefs,
  eventId,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicSchema, setDynamicSchema] = useState(
    generateFullMealPlanSchema([""])
  );

  const form = useForm<z.infer<typeof dynamicSchema>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {
      name: mealName[0],
      description: "",
      note: "",
      ingredientNames: [],
      chefIds: [],
    },
  });

  const ingredientNames = form.watch("ingredientNames");

  useEffect(() => {
    setDynamicSchema(generateFullMealPlanSchema(ingredientNames));
  }, [ingredientNames]);

  const onSubmit = async (data: z.infer<typeof dynamicSchema>) => {
    const { name, description, note, ingredientNames, chefIds, ...rest } = data;

    const ingredients = ingredientNames.map((ingredientName: string) => ({
      ingredientName,
      assignedQuantity: (rest as { [key: string]: number })[
        `${ingredientName}_assignedQuantity`
      ],
    }));

    const transformedData = {
      name,
      description,
      note,
      ingredients,
      chefIds,
    };

    setIsLoading(true);
    toast.loading("Creating meal plan...", { id: eventId });

    try {
      const response = await createMealPlanForEvent(eventId, transformedData);
      if (response.success) {
        toast.success("MealPlan created successfully!", { id: eventId });
      } else if (response.error) {
        toast.error(response.error as string, { id: eventId });
      }
    } catch (error) {
      console.error("Error creating meal plan:", error);
      toast.error("Failed to create meal plan", { id: eventId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4">
        <CustomFormField
          form={form}
          name="name"
          label="Name"
          type="select"
          selectItems={mealName}
        />
        <CustomFormField
          form={form}
          name="description"
          label="Description"
          type="textarea"
        />
        <CustomFormField form={form} name="note" label="Note" type="textarea" />

        {/* Ingredients Section */}
        <MultiSelectField
          form={form}
          name={"ingredientNames"}
          label={`Ingredient Name`}
          options={ingredientInventory.map((ingredient) => ingredient.name)}
        />
        {Array.from(ingredientNames).map((ingredient, index) => (
          <FormField
            key={index}
            control={form.control}
            name={`${ingredient}_assignedQuantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Assigned Quantity for ${ingredient}`}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    defaultValue={
                      form.getValues(`${ingredient}_assignedQuantity`) || 0
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <MultiSelectField
          form={form}
          name={"chefIds"}
          label={`Chefs`}
          options={chefs}
          placeholder="Select at least one chef"
        />

        <LoadingButton isLoading={isLoading} type="submit">
          Submit
        </LoadingButton>
      </form>
    </Form>
  );
};
