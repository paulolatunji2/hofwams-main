import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { DataTable } from "@/components/data-table/data-table";
import { mealsColumns } from "@/components/gen/meal-column";

import getSession from "@/lib/getSession";
import { getAllMeals } from "@/actions/event-actions";

const InventoryPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const meals = await getAllMeals();

  return (
    <main className="text-emerald-950 dark:text-emerald-50 px-4">
      <h1 className="text-3xl font-bold mb-10">Meal Inventory</h1>
      {meals.data && (
        <DataTable
          data={meals.data}
          columns={mealsColumns}
          filterBy="name"
          facetedFilterBy={["mealCategoryName"]}
        />
      )}
    </main>
  );
};

export default InventoryPage;
