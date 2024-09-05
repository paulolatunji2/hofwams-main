import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import getSession from "@/lib/getSession";
import { getAllEvents } from "@/actions/event-actions";
import { EventResponseType } from "@/types";

import { EventsComp } from "@/components/gen/events-comp";

const AllEventsPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const events = await getAllEvents();

  if (!events.data) {
    return (
      <div className=" h-[70vh] flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl">No events found.</h1>
      </div>
    );
  }

  return (
    <main className="text-emerald-950 dark:text-emerald-50">
      <h1 className="text-4xl mb-10 font-bold">All Events</h1>
      <EventsComp
        events={events.data as EventResponseType[]}
        eventDetailsRoute="/dashboard/admin/event"
        createEventRoute="/dashboard/admin/event/create"
      />
    </main>
  );
};

export default AllEventsPage;
