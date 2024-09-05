import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { CreateOrEditEventForm } from "@/components/gen/create-edit-event-form";

import getSession from "@/lib/getSession";
import {
  getAllDrinks,
  getAllMeals,
  getDrinkCategories,
  getEvent,
  getMealCategories,
} from "@/actions/event-actions";
import { extractMenuName } from "@/utils";

const EditEventPage = async ({ params }: { params: { eventId: string } }) => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const eventInfo = await getEvent(params.eventId);

  if (eventInfo.error || !eventInfo.data)
    return <div>Error: Event not found</div>;

  const meals = await getAllMeals();
  const drinks = await getAllDrinks();
  const mealCategoryOptions = await getMealCategories();
  const drinkCategoryOptions = await getDrinkCategories();

  const allMeals = extractMenuName(meals.data ?? []);
  const allDrinks = extractMenuName(drinks.data ?? []);

  return (
    <main className="p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-bold mb-10">Edit Event</h1>
      <CreateOrEditEventForm
        eventInfo={eventInfo.data}
        meals={allMeals}
        drinks={allDrinks}
        mealCategoryOptions={mealCategoryOptions.data ?? []}
        drinkCategoryOptions={drinkCategoryOptions.data ?? []}
      />
    </main>
  );
};

export default EditEventPage;
