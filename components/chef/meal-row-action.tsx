"use client";

import { Meal } from "@prisma/client";
import { Edit } from "lucide-react";
import { useState } from "react";
import { RiMore2Fill } from "react-icons/ri";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/gen/custom-dialog";
import { UpdateMealForm } from "./update-meal-form";

interface Props {
  meal: Meal;
}

export const MealRowAction = ({ meal }: Props) => {
  const [showEditMealDialog, setShowEditMealDialog] = useState(false);

  return (
    <>
      <CustomDialog
        trigger={false}
        title="Update Drink"
        isOpen={showEditMealDialog}
        setIsOpen={setShowEditMealDialog}
      >
        <UpdateMealForm meal={meal} setIsOpen={setShowEditMealDialog} />
      </CustomDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <RiMore2Fill />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => setShowEditMealDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Update Meal
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
