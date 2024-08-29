"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2Icon } from "lucide-react";
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
import { DeleteUserDialog } from "./delete-user-dialog";
import { UpdateUserRoleForm } from "./update-user-role-form";
import { UpdateChefTypeForm } from "./update-chef-type-form";

import { UserResponseType } from "@/types";

export const columns: ColumnDef<UserResponseType>[] = [
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
      return <DataTableColumnHeader column={column} title="UserID" />;
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
    accessorKey: "email",
    header: "Email",
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
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Created at" />;
    },

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
      const user = row.original;
      return <RowActions user={user} />;
    },
  },
];

const RowActions = ({ user }: { user: UserResponseType }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditRoleDialog, setShowEditRoleDialog] = useState(false);
  const [showEditChefTypeDialog, setShowEditChefTypeDialog] = useState(false);

  return (
    <>
      <DeleteUserDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        userId={user.id}
      />

      <CustomDialog
        title="Edit User Role"
        isOpen={showEditRoleDialog}
        setIsOpen={setShowEditRoleDialog}
        trigger={false}
      >
        <UpdateUserRoleForm userId={user.id} />
      </CustomDialog>

      <CustomDialog
        title="Edit Chef Type"
        isOpen={showEditChefTypeDialog}
        setIsOpen={setShowEditChefTypeDialog}
        trigger={false}
      >
        <UpdateChefTypeForm userId={user.id} />
      </CustomDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-8 h-8 p-0">
            <RiMore2Fill />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => setShowEditRoleDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Edit User Role
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => setShowEditChefTypeDialog((prev) => !prev)}
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Edit Chef Type
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <Trash2Icon className="h-4 w-4 text-muted-foreground" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
