"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PrescriptionItem, prescriptions } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Calendar, Pill, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const columns: ColumnDef<PrescriptionItem>[] = [
  {
    accessorKey: "medicine_name",
    header: "Medicine",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 rounded-full p-1">
          <Pill className="text-primary h-4 w-4" />
        </div>
        {row.original.medicine_name}
      </div>
    ),
  },
  { accessorKey: "quantity", header: "Qty" },
  { accessorKey: "usage_instructions", header: "Instructions" },
];

export default function PrescriptionDetailPage() {
  const params = useParams();
  const prescription = prescriptions[0]; // Mock data

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/patient/prescriptions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Prescription Details
          </H2>
          <P className="text-muted-foreground">
            ID: {params.id || prescription.id}
          </P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-lg">
              Medication List
            </CardTitle>
            <Badge
              variant={
                prescription.status === "Active" ? "default" : "secondary"
              }
            >
              {prescription.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={prescription.items}
              searchKey="medicine_name"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Prescription Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Prescribed By</Small>
                  <P className="font-medium">{prescription.doctor_name}</P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">
                    Date Prescribed
                  </Small>
                  <P className="font-medium">{prescription.date}</P>
                </div>
              </div>
              <Button className="mt-4 w-full">Request Refill</Button>
              <Button className="w-full" variant="outline">
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
