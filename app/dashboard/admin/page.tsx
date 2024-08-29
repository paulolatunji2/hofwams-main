import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";

const AdminDashboardPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  return (
    <main className="text-emerald-950 dark:text-emerald-50 h-[50vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-10 font-bold">Welcome {user.name} 👋🏻</h1>
    </main>
  );
};

export default AdminDashboardPage;
