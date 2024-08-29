"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTableColumnFooter } from "@/components/data-table/column-footer";

import { GuestResponseType } from "@/types";

export const eventGuestsColumns: ColumnDef<GuestResponseType>[] = [
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
    accessorKey: "fullName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Name" />;
    },
    cell: ({ row }) => {
      const { fullName } = row.original;
      return <div className="font-medium text-left ">{fullName}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
    cell: ({ row }) => {
      const { email } = row.original;
      return <div className="font-medium text-left ">{email}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Phone Number" />;
    },
    cell: ({ row }) => {
      const { phoneNumber } = row.original;
      return <div className="font-medium text-center">{phoneNumber}</div>;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Age" />;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "nationality",
    header: "Nationality",
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "preferredDrinks",
    header: "Preferred Drinks",
    cell: ({ row }) => {
      const { preferredDrinks } = row.original;
      return (
        <div className="font-medium text-left ">
          {preferredDrinks.join(", ")}
        </div>
      );
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "preferredDishes",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Preferred Dishes" />;
    },
    cell: ({ row }) => {
      const { preferredDishes } = row.original;
      return (
        <div className="font-medium text-center">
          {preferredDishes.join(", ")}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "allergies",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Allergies" />;
    },
    cell: ({ row }) => {
      const { allergies } = row.original;
      return (
        <div className="font-medium text-center">
          {allergies.join(", ") || "N/A"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "mealSize",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Meal Size" />;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "dietary",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Dietary" />;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
];
