"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IngredientInventory } from "@prisma/client";
import { format } from "date-fns";
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
import { CreateOrUpdateIngredientForm } from "./update-ingredient-form";

export const inventoryColumns: ColumnDef<IngredientInventory>[] = [
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
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="InventoryID" />;
    },
    cell: ({ row }) => {
      const { id } = row.original;
      return <div className="font-medium text-left ">{id}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      const { name } = row.original;
      return <div className="font-medium text-left ">{name}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "shelfLife",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Shelf Life" />;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "shelfLifeUnit",
    header: "Shelf Life Unit",
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
    cell: ({ row }) => {
      const { expiryDate } = row.original;
      return (
        <div className="font-medium text-left ">
          {format(new Date(expiryDate), "PPP p")}
        </div>
      );
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "availableQuantity",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Available Quantity" />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    id: "actions",
    cell: ({ row }) => {
      const ingredient = row.original;
      return <RowActions ingredient={ingredient} />;
    },
  },
];

const RowActions = ({ ingredient }: { ingredient: IngredientInventory }) => {
  const [showEditIngredientDialog, setShowEditIngredientDialog] =
    useState(false);

  return (
    <>
      <CustomDialog
        trigger={false}
        title="Update Ingredient"
        isOpen={showEditIngredientDialog}
        setIsOpen={setShowEditIngredientDialog}
      >
        <CreateOrUpdateIngredientForm
          ingredient={ingredient}
          type="update"
          setIsOpen={setShowEditIngredientDialog}
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
            onSelect={() => setShowEditIngredientDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Update Ingredient
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
