"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  getMedicineApiMedicinesMedicineIdGet,
  getPrescriptionApiPrescriptionsPrescriptionIdGet,
} from "@/sdk/output/sdk.gen";
import { PrescriptionDto, PrescriptionItemDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Loader2, Pill, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// ...

// Component to fetch medicine name safely
const MedicineName = ({ id }: { id: string }) => {
  const [name, setName] = useState<string>("Loading...");
  useEffect(() => {
    safeApiCall(
      getMedicineApiMedicinesMedicineIdGet({ path: { medicine_id: id } })
    ).then(data => {
      if (data) setName(data.medicine_name);
      else setName("Unknown Medicine");
    });
  }, [id]);
  return <span>{name}</span>;
};

const columns: ColumnDef<PrescriptionItemDto>[] = [
  {
    accessorKey: "medicine_id",
    header: "Medicine",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 rounded-full p-1">
          <Pill className="text-primary h-4 w-4" />
        </div>
        <MedicineName id={row.original.medicine_id} />
      </div>
    ),
  },
  { accessorKey: "quantity", header: "Qty" },
  { accessorKey: "instructions", header: "Instructions" }, // Corrected accessor from 'notes' to 'instructions' based on DTO
];

export default function PrescriptionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [prescription, setPrescription] = useState<PrescriptionDto | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescription = async () => {
      const result = await safeApiCall(
        getPrescriptionApiPrescriptionsPrescriptionIdGet({
          path: { prescription_id: id },
        }),
        {
          errorMessage: "Failed to load prescription info",
        }
      );

      if (result) {
        setPrescription(result);
      }
      setIsLoading(false);
    };
    if (id) fetchPrescription();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!prescription) {
    return <div>Prescription not found</div>;
  }

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
          <P className="text-muted-foreground">ID: {id}</P>
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
                prescription.prescription_status === "dispensed"
                  ? "default"
                  : "secondary"
              }
              className="capitalize"
            >
              {prescription.prescription_status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable columns={columns} data={prescription.items || []} />
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
                  <P className="font-mono text-xs font-medium">
                    {prescription.doctor_id || "Unknown"}
                  </P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">
                    Date Prescribed
                  </Small>
                  <P className="font-medium">
                    {prescription.created_at
                      ? format(new Date(prescription.created_at), "dd MMM yyyy")
                      : "-"}
                  </P>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                disabled={prescription.prescription_status === "dispensed"}
              >
                Request Refill
              </Button>
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
