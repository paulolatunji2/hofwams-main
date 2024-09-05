"use client";

import { useState } from "react";

import { CustomDialog } from "@/components/gen/custom-dialog";
import { CreateOrUpdateIngredientForm } from "./update-ingredient-form";

export const CreateInventory = ({ units }: { units: string[] }) => {
  const [showCreateIngredientDialog, setShowCreateIngredientDialog] =
    useState(false);

  return (
    <CustomDialog
      title="Add Ingredient"
      isOpen={showCreateIngredientDialog}
      setIsOpen={setShowCreateIngredientDialog}
    >
      <CreateOrUpdateIngredientForm
        type="create"
        setIsOpen={setShowCreateIngredientDialog}
        units={units}
      />
    </CustomDialog>
  );
};
