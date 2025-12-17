"use client";

import { H2, P } from "@/components/elements/typography";
import { VisitForm, VisitFormValues } from "@/components/forms/visit-form";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import { createVisitApiVisitsPost } from "@/sdk/output/sdk.gen";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function NewVisitPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get("patient_id");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: VisitFormValues) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      createVisitApiVisitsPost({
        body: {
          patient_id: data.patient_id,
          doctor_id: data.doctor_id,
          clinic_id: data.clinic_id,
          visit_datetime: data.visit_datetime, // Already ISO from form
          visit_type: data.visit_type,
          chief_complaint: data.chief_complaint || null,
        },
      }),
      { successMessage: "Visit scheduled successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/registration/visits");
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/registration/visits">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            New Appointment
          </H2>
          <P className="text-muted-foreground text-sm">
            Schedule a new visit for a patient.
          </P>
        </div>
      </div>

      <div className="w-full">
        <VisitForm
          // Pre-fill patient_id if coming from action menu
          initialData={
            patientIdParam ? ({ patient_id: patientIdParam } as any) : undefined
          }
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
