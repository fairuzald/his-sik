"use client";

import { H2, P } from "@/components/elements/typography";
import {
  PatientRegistrationForm,
  PatientFormValues,
} from "@/components/forms/PatientRegistrationForm";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import { createPatientUserApiUsersPatientsPost } from "@/sdk/output/sdk.gen";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPatientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PatientFormValues) => {
    setIsLoading(true);

    const result = await safeApiCall(
      createPatientUserApiUsersPatientsPost({
        body: {
          username: data.username,
          password: data.password,
          full_name: data.full_name,
          email: data.email || null,
          phone_number: data.phone_number || null,
          nik: data.nik,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          bpjs_number: data.bpjs_number || null,
          blood_type: data.blood_type || null,
          address: data.address || null,
          emergency_contact_name: data.emergency_contact_name || null,
          emergency_contact_phone: data.emergency_contact_phone || null,
        },
      }),
      { successMessage: "Patient account created successfully" }
    );

    if (result) {
      router.push("/dashboard/registration/patients");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/registration/patients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            New Patient
          </H2>
          <P className="text-muted-foreground text-sm">
            Register a new patient account in the system with full patient
            details.
          </P>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <PatientRegistrationForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitText="Create Patient Account"
        />
      </div>
    </div>
  );
}
