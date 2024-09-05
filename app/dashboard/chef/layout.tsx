import {
  CalendarDays,
  CalendarRange,
  ChefHat,
  LayoutDashboard,
} from "lucide-react";
import { MdFoodBank, MdOutlineInventory } from "react-icons/md";
import { RiDrinks2Fill } from "react-icons/ri";

import { AppSideBar } from "@/components/gen/app-sidebar";
import { Header } from "@/components/gen/header";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard/chef",
    icon: (
      <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "All Events",
    href: "/dashboard/chef/events",
    icon: (
      <CalendarDays className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Upcoming Events",
    href: "/dashboard/chef/events/upcoming",
    icon: (
      <CalendarRange className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Chefs",
    href: "/dashboard/chef/all-chefs",
    icon: (
      <ChefHat className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Ingredient Inventory",
    href: "/dashboard/chef/ingredient-inventory",
    icon: (
      <MdOutlineInventory className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Meal Inventory",
    href: "/dashboard/chef/meal-inventory",
    icon: (
      <MdFoodBank className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Drink Inventory",
    href: "/dashboard/chef/drink-inventory",
    icon: (
      <RiDrinks2Fill className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
];

const ChefDashboardLayout = ({ children }: { children: React.ReactNode }) => {
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

export default ChefDashboardLayout;
