import { UserRole } from "@prisma/client";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import { getEvent } from "@/actions/event-actions";
import getSession from "@/lib/getSession";
import { getMealPlanByEvent } from "@/actions/event-planning-actions";
import { DataTable } from "@/components/data-table/data-table";
import { mealPlanColumns } from "@/components/chef/meal-plan-column";
import { getAllEventGuest } from "@/actions/guest-actions";
import { eventGuestsColumns } from "@/components/gen/guest-column";

const EventDetailsPage = async ({
  params,
}: {
  params: { eventId: string };
}) => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const eventInfo = await getEvent(params.eventId);
  if (eventInfo.error) return null;

  const formattedDate = eventInfo.data?.date
    ? format(eventInfo.data.date, "MMMM d, yyyy")
    : "";
  const formattedTime = eventInfo.data?.date
    ? format(eventInfo.data.date, "hh:mm a")
    : "";

  const mealPlans = await getMealPlanByEvent(params.eventId);
  const allIngredients =
    mealPlans.data?.flatMap((event) => event.ingredientUsage) ?? [];

  const eventGuests = await getAllEventGuest(params.eventId);

  return (
    <main className="max-w-7xl mx-auto text-emerald-950 dark:text-emerald-50">
      <h1 className="text-4xl mb-10 font-bold shadow py-2">Event Details</h1>

      <div className="grid grid-cols-2 shadow-xl rounded-md my-8">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Event ID:</h2>
          <p>{eventInfo.data?.id}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Event Name:</h2>
          <p>{eventInfo.data?.name}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Event Date:</h2>
          <p>{formattedDate}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Event Time:</h2>
          <p>{formattedTime}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Max Number of Guests:</h2>
          <p>{eventInfo.data?.maxNumberOfGuests}</p>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold">Allowance for Extra Guests:</h2>
          <p>{eventInfo.data?.allowExtraGuest ? "Yes" : "No"}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Max Number of Extra Guests:</h2>
          <p>{eventInfo.data?.maxNumberOfExtraGuest ?? "0"}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Allowance for Minor:</h2>
          <p>{eventInfo.data?.allowMinor ? "Yes" : "No"}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Available Slots:</h2>
          <p>{eventInfo.data?.availableSlot}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Slot Taken:</h2>
          <p>{eventInfo.data?.slotTaken}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Meal Time:</h2>
          <p>{eventInfo.data?.mealTimeType}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Location:</h2>
          <p>{eventInfo.data?.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 shadow-lg rounded-md my-8">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Meals:</h2>
          <p>{eventInfo.data?.meals.join(", ")}</p>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold">Drinks:</h2>
          <p>{eventInfo.data?.drinks.join(", ")}</p>
        </div>
      </div>

      <div className="shadow-lg rounded-md my-8 p-4">
        <h2 className="text-3xl mb-10 font-bold shadow py-2">Meal Plan</h2>
        {mealPlans?.data && (
          <DataTable
            data={allIngredients}
            columns={mealPlanColumns}
            facetedFilterBy={["ingredientName"]}
            filterBy="mealPlanName"
          />
        )}
      </div>

      <div className="shadow-lg rounded-md my-8 p-4">
        <h2 className="text-3xl mb-10 font-bold shadow py-2">Guests</h2>
        {eventGuests?.data && (
          <DataTable
            data={eventGuests.data}
            columns={eventGuestsColumns}
            facetedFilterBy={["allergies", "mealSize", "dietary"]}
            filterBy="fullName"
          />
        )}
      </div>
    </main>
  );
};

export default EventDetailsPage;
