"use client";

import { toast } from "sonner";

import { deleteUser } from "@/actions/admin-actions";
import { DeleteDialog } from "@/components/gen/delete-dialog";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId: string;
}

export const DeleteUserDialog = ({ open, setOpen, userId }: Props) => {
  const handleDelete = async () => {
    toast.loading("Deleting user...", { id: userId });
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        toast.success("User deleted successfully!", { id: userId });
      } else if (response.error) {
        toast.error(response.error as string, { id: userId });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        "An error occurred while deleting the user. Please try again.",
        { id: userId }
      );
    }
  };

  return (
    <DeleteDialog
      handleDelete={handleDelete}
      open={open}
      setOpen={setOpen}
      entity="user"
    />
  );
};
