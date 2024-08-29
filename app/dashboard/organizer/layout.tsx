import { AppSideBar } from "@/components/gen/app-sidebar";
import { Header } from "@/components/gen/header";
import { CalendarDays, CalendarRange, LayoutDashboard } from "lucide-react";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard/organizer",
    icon: (
      <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "All Events",
    href: "/dashboard/organizer/events",
    icon: (
      <CalendarDays className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Upcoming Events",
    href: "/dashboard/organizer/events/upcoming",
    icon: (
      <CalendarRange className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

const OrganizerDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      <Header />
      <AppSideBar links={links}>
        <div className="flex flex-1">
          <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 w-full h-full">
            {children}
          </div>
        </div>
      </AppSideBar>
    </div>
  );
};

export default OrganizerDashboardLayout;
