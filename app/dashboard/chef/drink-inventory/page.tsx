import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { DataTable } from "@/components/data-table/data-table";
import { drinkColumns } from "@/components/gen/drink-column";

import getSession from "@/lib/getSession";
import { getAllDrinks } from "@/actions/event-actions";

const InventoryPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.CHEF) {
    redirect("/auth");
  }

  const drinks = await getAllDrinks();

  return (
    <main className="text-emerald-950 dark:text-emerald-50 px-4">
      <h1 className="text-3xl font-bold mb-10">Drink Inventory</h1>
      {drinks.data && (
        <DataTable
          data={drinks.data}
          columns={drinkColumns}
          filterBy="name"
          facetedFilterBy={["drinkCategoryName"]}
        />
      )}
    </main>
  );
};

export default InventoryPage;
