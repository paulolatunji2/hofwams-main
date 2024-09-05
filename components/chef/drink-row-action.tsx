"use client";

import { Drink } from "@prisma/client";
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
import { CustomDialog } from "../gen/custom-dialog";
import { UpdateDrinkForm } from "./update-drink-form";

interface Props {
  drink: Drink;
}

export const DrinkRowAction = ({ drink }: Props) => {
  const [showEditDrinkDialog, setShowEditDrinkDialog] = useState(false);

  return (
    <>
      <CustomDialog
        trigger={false}
        title="Update Drink"
        isOpen={showEditDrinkDialog}
        setIsOpen={setShowEditDrinkDialog}
      >
        <UpdateDrinkForm drink={drink} setIsOpen={setShowEditDrinkDialog} />
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
            onSelect={() => setShowEditDrinkDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Update Drink
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
