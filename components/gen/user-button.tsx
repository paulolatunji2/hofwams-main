import { UserRole } from "@prisma/client";
import { LayoutDashboard, LogOut, UserRoundPen } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserButtonProps {
  user: User;
}

export function UserButton({ user }: UserButtonProps) {
  const isChef = user?.role === UserRole.CHEF;
  const isAdmin = user?.role === UserRole.ADMIN;

  const profileLink = isChef
    ? "/dashboard/chef/profile"
    : isAdmin
    ? "/dashboard/admin/profile"
    : "/dashboard/organizer/profile";

  const dashboardLink = isChef
    ? "/dashboard/chef"
    : isAdmin
    ? "/dashboard/admin"
    : "/dashboard/organizer";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="flex-none rounded-full">
          <Image
            src={user?.image || "/avatar_placeholder.png"}
            alt="User profile picture"
            width={50}
            height={50}
            className="aspect-square rounded-full bg-background object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{user?.name || "User"}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={dashboardLink}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href={profileLink}>
              <UserRoundPen className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
