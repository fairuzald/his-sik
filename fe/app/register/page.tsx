"use client";

import { UserForm, UserFormValues } from "@/components/forms/UserForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { registerApiAuthRegisterPost } from "@/sdk/output/sdk.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      const response = await registerApiAuthRegisterPost({
        body: {
          full_name: data.full_name,
          username: data.username,
          password: data.password!, // Validated by schema to be present in create mode
          email: data.email || null,
          phone_number: data.phone_number || null,
        },
      });

      if (response.data?.success) {
        toast.success("Account created successfully! Please login.");
        router.push("/login");
      } else {
        toast.error(response.data?.message || "Failed to create account.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Check if it's an API error
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        console.error("Registration error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create an Account"
      description="Join MediCare to manage your health and appointments."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign In"
    >
      <UserForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitText="Create Account"
      />
    </AuthLayout>
  );
}
