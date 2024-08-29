"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { CustomFormField } from "@/components/gen/custom-form-field";
import { LoadingButton } from "@/components/gen/loading-button";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { signInSchema, SignInValues } from "@/schema/auth";
import { login } from "@/actions/auth-actions";

export const SignInForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      setIsLoading(true);
      const { email } = values;

      await login("resend", email);

      toast.success("Check your email for the login link.");
    } catch (error) {
      console.log(error);
      toast.error("Login failed, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* <CustomFormField name="email" label="Email" form={form} />

        <div className="grid grid-cols-2 gap-2">
          <LoadingButton
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            isLoading={isLoading}
          >
            Sign In
          </LoadingButton>
        </div> */}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => login("google")}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </form>
    </Form>
  );
};
