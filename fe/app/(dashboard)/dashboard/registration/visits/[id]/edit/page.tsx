"use client";

import { H2, P } from "@/components/elements/typography";
import { VisitForm, VisitFormValues } from "@/components/forms/visit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import {
  getVisitApiVisitsVisitIdGet,
  updateVisitApiVisitsVisitIdPut,
} from "@/sdk/output/sdk.gen";
import { VisitDto } from "@/sdk/output/types.gen";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditVisitPage() {
  const params = useParams();
  const router = useRouter();
  const [visit, setVisit] = useState<VisitDto | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVisit = async () => {
      setIsFetching(true);
      if (typeof params.id === "string") {
        const result = await safeApiCall(
          getVisitApiVisitsVisitIdGet({
            path: { visit_id: params.id },
          })
        );
        if (result) {
          setVisit(result);
        }
      }
      setIsFetching(false);
    };
    fetchVisit();
  }, [params.id]);

  const handleSubmit = async (data: VisitFormValues) => {
    if (typeof params.id !== "string") return;
    setIsSubmitting(true);
    const result = await safeApiCall(
      updateVisitApiVisitsVisitIdPut({
        path: { visit_id: params.id },
        body: {
          visit_type: data.visit_type,
          visit_datetime: data.visit_datetime, // Already ISO or formatted in form
          visit_status: data.visit_status,
          chief_complaint: data.chief_complaint || null,
          doctor_id: data.doctor_id,
          clinic_id: data.clinic_id,
        },
      }),
      { successMessage: "Visit updated successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/registration/visits");
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!visit) {
    return <div>Visit not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Edit Visit
        </H2>
        <P className="text-muted-foreground mt-1">Update visit details.</P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Visit Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <VisitForm
            initialData={visit}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
