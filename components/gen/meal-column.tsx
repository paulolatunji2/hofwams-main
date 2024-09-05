"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Meal } from "@prisma/client";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableColumnFooter } from "@/components/data-table/column-footer";
import { MealRowAction } from "@/components/chef/meal-row-action";

export const mealsColumns: ColumnDef<Meal>[] = [
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
    accessorKey: "mealCategoryName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell: ({ row }) => {
      const { mealCategoryName } = row.original;
      return <div className="font-medium text-left ">{mealCategoryName}</div>;
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
    cell: ({ row }) => {
      const { shelfLife } = row.original;
      return <div className="font-medium text-center">{shelfLife}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },

  {
    accessorKey: "shelfLifeUnit",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Shelf Life Unit" />;
    },
    cell: ({ row }) => {
      const { shelfLifeUnit } = row.original;
      return <div className="font-medium text-center">{shelfLifeUnit}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const { quantity } = row.original;
      return <div className="font-medium text-left ">{quantity}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "measuringUnitName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Measuring Unit" />;
    },
    cell: ({ row }) => {
      const { measuringUnitName } = row.original;
      return <div className="font-medium text-center">{measuringUnitName}</div>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meal = row.original;
      return <MealRowAction meal={meal} />;
    },
  },
];
