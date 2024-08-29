import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { getAllDrinks, getAllMeals } from "@/actions/event-actions";
import getSession from "@/lib/getSession";
import { extractMenuName } from "@/utils";

import { CreateOrEditEventForm } from "@/components/gen/create-edit-event-form";

const CreateEventPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const meals = await getAllMeals();
  const drinks = await getAllDrinks();

  const allMeals = extractMenuName(meals.data ?? []);
  const allDrinks = extractMenuName(drinks.data ?? []);

  return (
    <div className="overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
      <div className="p-8 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-10">
          Create New Event
        </h1>
        <CreateOrEditEventForm meals={allMeals} drinks={allDrinks} />
      </div>
    </div>
  );
};

export default CreateEventPage;
