import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";
import { BioData } from "@/components/gen/user-profile-card";

const AdminProfilePage = async () => {
  const session = await getSession();
  const user = session?.user;
  console.log({ session });

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/auth");
  }

  return (
    <main
      className="text-emerald-950 dark:text-emerald-50 overflow-y-auto"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <BioData />
    </main>
  );
};

export default AdminProfilePage;
