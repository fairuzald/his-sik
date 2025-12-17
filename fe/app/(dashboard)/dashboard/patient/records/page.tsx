"use client";

import { H2, H4, P, Small } from "@/components/elements/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { listMedicalRecordsApiMedicalRecordsGet } from "@/sdk/output/sdk.gen";
import { MedicalRecordDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
// removed toast import

export default function PatientRecordsPage() {
  const [records, setRecords] = useState<MedicalRecordDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const result = await safeApiCall(
        listMedicalRecordsApiMedicalRecordsGet(),
        {
          errorMessage: "Failed to load medical history",
        }
      );
      if (result) {
        setRecords(result);
      }
      setIsLoading(false);
    };
    fetchRecords();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Medical Records
        </H2>
        <P className="text-muted-foreground mt-1">
          Your medical history and treatment plans.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-primary text-xl">Record History</CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <P className="text-muted-foreground py-4 text-center">
              No medical records found.
            </P>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {records.map(record => (
                <AccordionItem
                  key={record.id}
                  value={record.id}
                  className="border-b-muted"
                >
                  <AccordionTrigger className="hover:bg-muted/30 rounded-md px-4 hover:no-underline">
                    <div className="flex flex-1 items-center justify-between pr-4">
                      <div className="flex flex-col items-start gap-1 text-left">
                        <H4 className="text-foreground text-base font-semibold">
                          {record.diagnosis || "No Diagnosis"}
                        </H4>
                        <Small className="text-muted-foreground">
                          {record.created_at
                            ? format(new Date(record.created_at), "dd MMM yyyy")
                            : "-"}{" "}
                          •{" "}
                          <span className="text-primary font-mono text-xs">
                            Visit:{" "}
                            {record.visit_id
                              ? record.visit_id.substring(0, 8)
                              : "Unknown"}
                            ...
                          </span>
                        </Small>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4 pt-4">
                      <div className="grid gap-1">
                        <H4 className="text-primary text-sm font-semibold">
                          Physical Examination
                        </H4>
                        <P className="text-muted-foreground bg-muted/20 rounded-md border p-2 text-sm">
                          {record.physical_exam || "-"}
                        </P>
                      </div>
                      <div className="grid gap-1">
                        <H4 className="text-primary text-sm font-semibold">
                          Treatment Plan
                        </H4>
                        <P className="text-muted-foreground bg-muted/20 rounded-md border p-2 text-sm">
                          {record.treatment_plan || "-"}
                        </P>
                      </div>
                      <div className="grid gap-1">
                        <H4 className="text-primary text-sm font-semibold">
                          Doctor&apos;s Notes
                        </H4>
                        <P className="text-muted-foreground bg-muted/20 rounded-md border p-2 text-sm">
                          {record.doctor_notes || "-"}
                        </P>
                      </div>
                      <div className="flex justify-end">
                        <Button size="sm" asChild>
                          <Link
                            href={`/dashboard/patient/records/${record.id}`}
                          >
                            View Full Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
