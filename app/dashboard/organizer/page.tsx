import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";
import Link from "next/link";

const OrganizerDashboardPage = async () => {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/auth");
  }

  return (
    <main className="text-emerald-950 dark:text-emerald-50 h-[50vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-10 font-bold">Welcome {user.name} 👋🏻</h1>
      <div className="flex gap-4">
        <Link
          href={"/dashboard/organizer/events"}
          className="bg-emerald-500 py-2 px-4 rounded-md text-emerald-50 hover:bg-emerald-600 transition duration-300"
        >
          Click here to see all your events
        </Link>
        <Link
          href={"/dashboard/organizer/create-event"}
          className="hover:bg-emerald-100 dark:hover:text-emerald-950 transition duration-300 py-2 px-4 rounded-md "
        >
          Click here to create an event
        </Link>
      </div>
    </main>
  );
};

export default OrganizerDashboardPage;
