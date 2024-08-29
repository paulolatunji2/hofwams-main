import { redirect } from "next/navigation";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { SignInForm } from "@/components/auth/sign-in-form";

import getSession from "@/lib/getSession";

export default async function AuthPage() {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Sign up or sign in
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Get started with our app
          </p>
        </div>
        <Tabs defaultValue="signup" className="space-y-4">
          <TabsList className="grid grid-cols-2 gap-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
