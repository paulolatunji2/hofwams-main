import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { DataTable } from "@/components/data-table/data-table";
import { inventoryColumns } from "@/components/chef/inventory-column";
import { CreateInventory } from "@/components/chef/create-inventory";

import getSession from "@/lib/getSession";
import { getAllIngredientInventories } from "@/actions/ingredient-inventory-actions";
import { getAllUnits } from "@/actions/chef-actions";

const InventoryPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.CHEF) {
    redirect("/auth");
  }

  const ingredients = await getAllIngredientInventories();

  const measuringUnits = await getAllUnits();

  return (
    <main className="text-emerald-950 dark:text-emerald-50 px-4">
      <h1 className="text-3xl font-bold mb-10">Ingredients Inventory</h1>
      <div className="flex justify-end mb-8">
        <CreateInventory units={measuringUnits.data || []} />
      </div>
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
