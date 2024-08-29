"use client";

import { toast } from "sonner";

import { DeleteDialog } from "../gen/delete-dialog";
import { deleteEvent } from "@/actions/event-actions";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  eventId: string;
}

export const DeleteEventDialog = ({ open, setOpen, eventId }: Props) => {
  const handleDelete = async () => {
    toast.loading("Deleting event...", { id: eventId });
    try {
      const response = await deleteEvent(eventId);
      if (response.success) {
        toast.success("User deleted successfully!", { id: eventId });
      } else if (response.error) {
        toast.error(response.error as string, { id: eventId });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(
        "An error occurred while deleting the event. Please try again.",
        { id: eventId }
      );
    }
  };

  return (
    <DeleteDialog
      handleDelete={handleDelete}
      open={open}
      setOpen={setOpen}
      entity="event"
    />
  );
};
