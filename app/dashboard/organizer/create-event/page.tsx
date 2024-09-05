import { redirect } from "next/navigation";

import {
  getAllDrinks,
  getAllMeals,
  getDrinkCategories,
  getMealCategories,
} from "@/actions/event-actions";
import { CreateOrEditEventForm } from "@/components/gen/create-edit-event-form";
import getSession from "@/lib/getSession";
import { extractMenuName } from "@/utils";

const CreateEventPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth");
  }

  const meals = await getAllMeals();
  const drinks = await getAllDrinks();
  const mealCategoryOptions = await getMealCategories();
  const drinkCategoryOptions = await getDrinkCategories();

  const allMeals = extractMenuName(meals.data ?? []);
  const allDrinks = extractMenuName(drinks.data ?? []);

  return (
    <main>
      <div className="p-8 w-full max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-10">
          Create New Event
        </h1>
        <CreateOrEditEventForm
          meals={allMeals}
          drinks={allDrinks}
          mealCategoryOptions={mealCategoryOptions.data ?? []}
          drinkCategoryOptions={drinkCategoryOptions.data ?? []}
        />
      </div>
    </main>
  );
};

export default CreateEventPage;
