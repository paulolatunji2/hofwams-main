import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import { getAllUsers } from "@/actions/admin-actions";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/admin/column";

import getSession from "@/lib/getSession";

const UsersPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  const users = await getAllUsers();
  
  return (
    <main className="text-emerald-950 dark:text-emerald-50">
      <h1 className="text-4xl mb-10 font-bold">All Users</h1>
      {users?.data && (
        <DataTable
          data={users.data}
          columns={columns}
          facetedFilterBy={["role"]}
          filterBy="name"
        />
      )}
    </main>
  );
};

export default UsersPage;
