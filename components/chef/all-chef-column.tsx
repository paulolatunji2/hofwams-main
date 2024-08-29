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
import { AssignDepartmentForm } from "./assign-department-form";

import { ChefProfileResponseType } from "@/types";

export const allChefColumns: ColumnDef<ChefProfileResponseType>[] = [
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
      return <DataTableColumnHeader column={column} title="ChefID" />;
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
    accessorKey: "role",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Role" />;
    },
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
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
    accessorKey: "specialty",
    header: "Specialty",
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
  },
  {
    accessorKey: "cuisines",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Cuisines" />;
    },
    cell: ({ row }) => {
      const { cuisines } = row.original;
      return (
        <div className="font-medium text-left capitalize">
          {cuisines.join(", ")}
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
    accessorKey: "department",
    header: "Department",
    footer: ({ column, table }) => {
      return <DataTableColumnFooter column={column} table={table} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const chef = row.original;
      return <RowActions chef={chef} />;
    },
  },
];

const RowActions = ({ chef }: { chef: ChefProfileResponseType }) => {
  const [showAssignDptDialog, setShowAssignDptDialog] = useState(false);

  return (
    <>
      <CustomDialog
        trigger={false}
        title="Assign Department"
        isOpen={showAssignDptDialog}
        setIsOpen={setShowAssignDptDialog}
      >
        <AssignDepartmentForm chefId={chef.id} />
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
            onSelect={() => setShowAssignDptDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Assign Department
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
