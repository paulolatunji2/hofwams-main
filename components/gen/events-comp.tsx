"use client";

import { useState, useMemo } from "react";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { EventCard } from "@/components/gen/event-card";

import { EventResponseType } from "@/types";

export const EventsComp = ({
  events,
  eventDetailsRoute,
  createEventRoute,
}: {
  events: EventResponseType[];
  eventDetailsRoute: string;
  createEventRoute: string;
}) => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    return events?.filter(
      (event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, events]);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-5xl">
          <SearchIcon className="absolute left-3 top-2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search events..."
            className="h-10 w-full rounded-md border-transparent bg-muted pl-10 focus:border-primary focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Link
          href={createEventRoute}
          className="bg-emerald-100 py-2 px-4 rounded-md dark:bg-emerald-600"
        >
          Create Event
        </Link>
      </div>

      {filteredEvents?.length === 0 && (
        <div className="h-[50vh] flex items-center justify-center text-3xl font-semibold">
          No event available
        </div>
      )}

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-10">
        {filteredEvents?.map((event) => (
          <EventCard key={event.id} {...event} route={eventDetailsRoute} />
        ))}
      </div>
    </>
  );
};
