import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";
import { BioData } from "@/components/gen/user-profile-card";

const OrganizerProfilePage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth");
  }

  return (
    <main className="text-emerald-950 dark:text-emerald-50 h-[50vh] flex flex-col items-center justify-center">
      <BioData />
    </main>
  );
};

export default OrganizerProfilePage;
