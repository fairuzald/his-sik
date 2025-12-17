"use client";

import {
  SimplePatientFormValues,
  MultiStepPatientRegistrationForm,
} from "@/components/forms/MultiStepPatientRegistrationForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { safeApiCall } from "@/lib/api-handler";
import { registerApiAuthRegisterPost } from "@/sdk/output/sdk.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: SimplePatientFormValues) => {
    setIsLoading(true);

    const result = await safeApiCall(
      registerApiAuthRegisterPost({
        body: {
          full_name: data.full_name,
          username: data.username,
          password: data.password,
          email: data.email || null,
          phone_number: data.phone_number || null,
          nik: data.nik,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          // Optional fields can be updated later via profile
          bpjs_number: null,
          blood_type: null,
          address: null,
          emergency_contact_name: null,
          emergency_contact_phone: null,
        },
      }),
      { successMessage: "Account created successfully! Please login." }
    );

    if (result) {
      router.push("/login");
    }
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Create an Account"
      description="Join MediCare to manage your health and appointments."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign In"
    >
      <MultiStepPatientRegistrationForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        submitText="Create Account"
      />
    </AuthLayout>
  );
}
