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

import { signUpSchema, SignUpValues } from "@/schema/auth";
import { login, register } from "@/actions/auth-actions";

export const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      setIsLoading(true);
      const response = await register(values);

      if (response.success) {
        toast.success("Account created successfully!");
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* <CustomFormField name="name" label="Full Name" form={form} />
        <CustomFormField name="email" label="Email" form={form} />
        <div className="grid grid-cols-2 gap-2">
          <LoadingButton
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            isLoading={isLoading}
          >
            Sign Up
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
          Sign up with Google
        </Button>
      </form>
    </Form>
  );
};
