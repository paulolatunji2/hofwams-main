"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Drink } from "@prisma/client";
import { format } from "date-fns";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableColumnFooter } from "@/components/data-table/column-footer";
import { DrinkRowAction } from "@/components/chef/drink-row-action";

export const drinkColumns: ColumnDef<Drink>[] = [
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
    accessorKey: "drinkCategoryName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Category" />;
    },
    cell: ({ row }) => {
      const { drinkCategoryName } = row.original;
      return <div className="font-medium text-left ">{drinkCategoryName}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "expiryDate",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Expiry Date" />;
    },
    cell: ({ row }) => {
      const { expiryDate } = row.original;
      return (
        <div className="font-medium">
          {expiryDate ? format(new Date(expiryDate), "yyyy-MM-dd") : "N/A"}
        </div>
      );
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
      const drink = row.original;
      return <DrinkRowAction drink={drink} />;
    },
  },
];
