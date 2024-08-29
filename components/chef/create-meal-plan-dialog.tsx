"use client";

import { IngredientInventory } from "@prisma/client";
import { useState } from "react";

import { CustomDialog } from "@/components/gen/custom-dialog";
import { CreateOrEditMealPlanForm } from "./create-edit-meal-plan-form";
import { ScrollArea } from "../ui/scroll-area";

interface Props {
  mealName: string[];
  ingredientInventory: IngredientInventory[];
  chefs: { id: string; name: string }[];
  eventId: string;
}

export const CreateMealPlanDialog = ({
  mealName,
  ingredientInventory,
  chefs,
  eventId,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CustomDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Create Meal Plan"
      trigger={true}
    >
      <ScrollArea className="h-[500px]">
        <CreateOrEditMealPlanForm
          mealName={mealName}
          ingredientInventory={ingredientInventory}
          chefs={chefs}
          eventId={eventId}
        />
      </ScrollArea>
    </CustomDialog>
  );
};
