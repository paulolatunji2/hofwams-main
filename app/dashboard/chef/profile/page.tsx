import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";
import { BioData } from "@/components/gen/user-profile-card";
import { getAllCuisines, getChefProfile } from "@/actions/chef-actions";
import {
  ChefProfile,
  CreateOrUpdateChefProfile,
} from "@/components/chef/chef-profile";

const ChefProfilePage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user || user.role !== UserRole.CHEF) {
    redirect("/auth");
  }
  const chefProfile = await getChefProfile();

  const cuisines = await getAllCuisines();

  if (!cuisines.data) return null;

  if (!chefProfile.data) {
    return (
      <main
        className="text-emerald-950 dark:text-emerald-50 overflow-y-auto"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <BioData />
        <div className="flex items-center justify-center my-10">
          <CreateOrUpdateChefProfile type="create" cuisines={cuisines.data} />
        </div>
      </main>
    );
  }

  return (
    <main
      className="text-emerald-950 dark:text-emerald-50 overflow-y-auto"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <BioData />
      <ChefProfile data={chefProfile.data} cuisines={cuisines.data} />
    </main>
  );
};

export default ChefProfilePage;
