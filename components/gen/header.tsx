"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { UserButton } from "./user-button";
import { Button } from "@/components/ui/button";
import { ThemeToggler } from "./theme-toggler";
import { LeafIcon } from "./icons";

export const Header = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4 w-full">
        <nav className="mx-auto flex h-14 w-full items-center justify-between gap-3">
          <Link
            href="/"
            className="font-bold hover:text-emerald-400 transition duration-300 text-xl flex items-center gap-2"
          >
            <LeafIcon className="h-6 w-6" />
            Hofwams
          </Link>
          <div className="flex items-center gap-4">
            {user && <UserButton user={user} />}
            {!user && status === "loading" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {!user && status === "unauthenticated" && <SignInButton />}
            <ThemeToggler />
          </div>
        </nav>
      </div>
    </header>
  );
};

function SignInButton() {
  const router = useRouter();
  return <Button onClick={() => router.push("/auth")}>Sign in</Button>;
}
