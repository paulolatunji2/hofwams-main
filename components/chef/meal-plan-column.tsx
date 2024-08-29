"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { useState } from "react";
import { RiMore2Fill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableColumnFooter } from "@/components/data-table/column-footer";
import { CustomDialog } from "@/components/gen/custom-dialog";
import { IngredientUsageForm } from "./ingredient-form";
import { MealPlanDataModel } from "@/types";

export const mealPlanColumns: ColumnDef<MealPlanDataModel>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "mealPlanId",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="MealPlanID" />;
    },
    cell: ({ row }) => {
      const { mealPlanId } = row.original;
      return <div className="font-medium text-left ">{mealPlanId}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "mealPlanName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Plan Name" />;
    },
    cell: ({ row }) => {
      const { mealPlanName } = row.original;
      return <div className="font-medium text-left ">{mealPlanName}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "chefs",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Chefs" />;
    },
    cell: ({ row }) => {
      const { chefs } = row.original;
      return <div className="font-medium text-center">{chefs.join(", ")}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "ingredientName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Ingredient Name" />;
    },
    cell: ({ row }) => {
      const { ingredientName } = row.original;
      return <div className="font-medium text-center">{ingredientName}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "assignedQuantity",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader column={column} title="Assigned Quantity" />
      );
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "quantityUsed",
    header: "Quantity Used",
    cell: ({ row }) => {
      const { quantityUsed } = row.original;
      return <div className="font-medium text-left ">{quantityUsed ?? 0}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const ingredient = row.original;
      return <RowActions ingredient={ingredient} />;
    },
  },
];

const RowActions = ({ ingredient }: { ingredient: MealPlanDataModel }) => {
  const [showIngredientUsageDialog, setShowIngredientUsageDialog] =
    useState(false);

  return (
    <>
      <CustomDialog
        trigger={false}
        title="Update Ingredient Usage"
        isOpen={showIngredientUsageDialog}
        setIsOpen={setShowIngredientUsageDialog}
      >
        <IngredientUsageForm
          ingredientUsage={ingredient}
          mealPlanId={ingredient.mealPlanId}
          setIsOpen={setShowIngredientUsageDialog}
        />
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
            onSelect={() => setShowIngredientUsageDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Update Ingredient Usage
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
