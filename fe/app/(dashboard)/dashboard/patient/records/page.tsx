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
import { medicalRecords } from "@/data/mock-data";
import Link from "next/link";

export default function PatientRecordsPage() {
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
          <Accordion type="single" collapsible className="w-full">
            {medicalRecords.map(record => (
              <AccordionItem
                key={record.id}
                value={record.id}
                className="border-b-muted"
              >
                <AccordionTrigger className="hover:bg-muted/30 rounded-md px-4 hover:no-underline">
                  <div className="flex flex-1 items-center justify-between pr-4">
                    <div className="flex flex-col items-start gap-1 text-left">
                      <H4 className="text-foreground text-base font-semibold">
                        {record.primary_diagnosis}
                      </H4>
                      <Small className="text-muted-foreground">
                        {record.date} •{" "}
                        <span className="text-primary">
                          {record.doctor_name}
                        </span>
                      </Small>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4 pt-4">
                    <div className="grid gap-1">
                      <H4 className="text-primary text-sm font-semibold">
                        Anamnesis
                      </H4>
                      <P className="text-muted-foreground bg-muted/20 rounded-md border p-2 text-sm">
                        {record.anamnesis}
                      </P>
                    </div>
                    <div className="grid gap-1">
                      <H4 className="text-primary text-sm font-semibold">
                        Treatment Plan
                      </H4>
                      <P className="text-muted-foreground bg-muted/20 rounded-md border p-2 text-sm">
                        {record.treatment_plan}
                      </P>
                    </div>
                    <div className="grid gap-1">
                      <H4 className="text-primary text-sm font-semibold">
                        Doctor&apos;s Notes
                      </H4>
                      <P className="text-muted-foreground bg-muted/20 rounded-md border p-2 text-sm">
                        {record.doctor_notes}
                      </P>
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/patient/records/${record.id}`}>
                          View Full Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
