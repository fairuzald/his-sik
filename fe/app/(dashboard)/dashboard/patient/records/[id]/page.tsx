"use client";

import { H2, H4, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { getMedicalRecordApiMedicalRecordsRecordIdGet } from "@/sdk/output/sdk.gen";
import { MedicalRecordDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// removed toast import

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [record, setRecord] = useState<MedicalRecordDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      const result = await safeApiCall(
        getMedicalRecordApiMedicalRecordsRecordIdGet({
          path: { record_id: id },
        }),
        {
          errorMessage: "Failed to load medical record details",
        }
      );

      if (result) {
        setRecord(result);
      }
      setIsLoading(false);
    };
    if (id) fetchRecord();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!record) {
    return <div>Record not found</div>;
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/patient/records">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Medical Record Details
          </H2>
          <P className="text-muted-foreground text-sm">
            View detailed information about your medical record.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-xl">
                {record.diagnosis || "No Diagnosis Recorded"}
              </CardTitle>
              <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {record.created_at
                    ? format(new Date(record.created_at), "dd MMM yyyy")
                    : "-"}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {/* Doctor ID not in record DTO directly, would need fetch via Visit */}
                  {record.visit_id
                    ? `Visit ID: ${record.visit_id.substring(0, 8)}...`
                    : "Unknown Visit"}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-1">
            <H4 className="text-primary text-sm font-semibold">
              Physical Examination
            </H4>
            <P className="text-muted-foreground bg-muted/20 rounded-md border p-3 text-sm">
              {record.physical_exam || "-"}
            </P>
          </div>

          <div className="grid gap-1">
            <H4 className="text-primary text-sm font-semibold">
              Treatment Plan
            </H4>
            <P className="text-muted-foreground bg-muted/20 rounded-md border p-3 text-sm">
              {record.treatment_plan || "-"}
            </P>
          </div>

          <div className="grid gap-1">
            <H4 className="text-primary text-sm font-semibold">
              Doctor&apos;s Notes
            </H4>
            <P className="text-muted-foreground bg-muted/20 rounded-md border p-3 text-sm">
              {record.doctor_notes || "-"}
            </P>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
