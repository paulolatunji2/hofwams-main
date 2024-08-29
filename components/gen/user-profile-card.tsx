"use client";

import { useSession } from "next-auth/react";

import { Card, CardContent } from "@/components/ui/card";
import { SkeletonWrapper } from "./skeleton-wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";
import { getInitials } from "@/utils";

export const BioData = () => {
  const { data: session, status } = useSession();

  const { name = "", email = "", image = "" } = session?.user || {};

  return (
    <div className="w-full">
      <SkeletonWrapper isLoading={status === "loading"}>
        {name && (
          <Card className="w-full max-w-xl p-6 bg-background rounded-lg shadow-lg border-none mx-auto">
            <CardContent className="flex flex-col items-center mb-6">
              <UserPhoto name={name} imgUrl={image} />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-1">{name}</h2>
                <p className="text-muted-foreground">{email}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </SkeletonWrapper>
    </div>
  );
};

interface UserPhotoProps {
  imgUrl: string | null;
  name: string;
  className?: string;
}

export function UserPhoto({ imgUrl, name, className }: UserPhotoProps) {
  return (
    <Avatar className={cn("size-20", className)}>
      <AvatarImage src={imgUrl || "/avatar_placeholder.png"} alt="UserPhoto" />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
