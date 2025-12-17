"use client";

import { H2, P } from "@/components/elements/typography";
import { ClinicForm, ClinicFormValues } from "@/components/forms/clinic-form";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import { createClinicApiClinicsPost } from "@/sdk/output/sdk.gen";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewClinicPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ClinicFormValues) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      createClinicApiClinicsPost({
        body: data,
      }),
      { successMessage: "Clinic created successfully" }
    );
    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/admin/clinics");
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/admin/clinics">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Add New Clinic
          </H2>
          <P className="text-muted-foreground text-sm">
            Create a new clinic location.
          </P>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <ClinicForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
