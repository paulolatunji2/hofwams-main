"use client";

import { format } from "date-fns";
import { Edit, MapPin, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RiMore2Fill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteEventDialog } from "../admin/delete-event-dialog";
import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

interface EventCardProps {
  id: string;
  name: string;
  date: Date;
  location: string;
  route: string;
}

export function EventCard({ id, name, date, location, route }: EventCardProps) {
  const router = useRouter();

  const formattedDate = format(date, "MMMM d, yyyy");
  const formattedTime = format(date, "hh:mm a");

  const { data: session } = useSession();

  return (
    <Card className="rounded-lg bg-background p-4 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        {session?.user.role === UserRole.ADMIN && <EventActions eventId={id} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex gap-2">
          Date: <time dateTime={date.toISOString()}>{formattedDate}</time>
        </div>
        <div className="flex gap-2">
          Time: <time dateTime={date.toISOString()}>{formattedTime}</time>
        </div>
        <div className="flex gap-4 items-center">
          <MapPin />
          <p>{location}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="mt-auto"
          onClick={() => router.push(`${route}/${id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

const EventActions = ({ eventId }: { eventId: string }) => {
  const [showDeleteEventDialog, setShowDeleteEventDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <DeleteEventDialog
        open={showDeleteEventDialog}
        setOpen={setShowDeleteEventDialog}
        eventId={eventId}
      />

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
            onSelect={() =>
              router.push(`/dashboard/admin/event/edit/${eventId}`)
            }
          >
            <Edit className="h-4 w-4 text-muted-foreground" />
            Edit Event
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex items-center gap-2"
            onSelect={() => setShowDeleteEventDialog((prev) => !prev)}
          >
            <Trash2Icon className="h-4 w-4 text-muted-foreground" />
            Delete Event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
