import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import getSession from "@/lib/getSession";
import { getAllIngredientInventories } from "@/actions/ingredient-inventory-actions";
import { DataTable } from "@/components/data-table/data-table";
import { inventoryColumns } from "@/components/chef/inventory-column";

const InventoryPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const ingredients = await getAllIngredientInventories();

  return (
    <main className="text-emerald-950 dark:text-emerald-50 px-4">
      <h1 className="text-3xl font-bold mb-10">Ingredients Inventory</h1>

      {ingredients.data && (
        <DataTable
          data={ingredients.data}
          columns={inventoryColumns}
          filterBy="name"
          facetedFilterBy={[]}
        />
      )}
    </main>
  );
};

export default InventoryPage;
