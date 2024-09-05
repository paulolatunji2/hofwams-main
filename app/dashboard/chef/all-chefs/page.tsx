import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/data-table/data-table";
import { allChefColumns } from "@/components/chef/all-chef-column";

import { getAllChefProfiles } from "@/actions/chef-actions";
import getSession from "@/lib/getSession";

const AllChefsPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.CHEF) {
    redirect("/auth");
  }

  const chefs = await getAllChefProfiles();
  // console.log({ chefs });

  return (
    <main className="text-emerald-950 dark:text-emerald-50">
      <h1 className="text-4xl mb-10 font-bold">All Chefs</h1>
      {chefs?.data && (
        <DataTable
          data={chefs.data}
          columns={allChefColumns}
          facetedFilterBy={["role", "department", "cuisines"]}
          filterBy="name"
        />
      )}
    </main>
  );
};

export default AllChefsPage;
