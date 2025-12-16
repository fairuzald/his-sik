"use client";

import { H2, H4, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { medicalRecords } from "@/data/mock-data";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const record = medicalRecords.find(r => r.id === params.id);

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
                {record.primary_diagnosis}
              </CardTitle>
              <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {record.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {record.doctor_name}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-1">
            <H4 className="text-primary text-sm font-semibold">Anamnesis</H4>
            <P className="text-muted-foreground bg-muted/20 rounded-md border p-3 text-sm">
              {record.anamnesis}
            </P>
          </div>

          <div className="grid gap-1">
            <H4 className="text-primary text-sm font-semibold">
              Treatment Plan
            </H4>
            <P className="text-muted-foreground bg-muted/20 rounded-md border p-3 text-sm">
              {record.treatment_plan}
            </P>
          </div>

          <div className="grid gap-1">
            <H4 className="text-primary text-sm font-semibold">
              Doctor&apos;s Notes
            </H4>
            <P className="text-muted-foreground bg-muted/20 rounded-md border p-3 text-sm">
              {record.doctor_notes}
            </P>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
