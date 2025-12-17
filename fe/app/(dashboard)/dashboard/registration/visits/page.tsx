"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listVisitsApiVisitsGet } from "@/sdk/output/sdk.gen";
import { VisitDto, VisitStatusEnum } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { VisitActionsCell } from "./actions-cell";

const columns: ColumnDef<VisitDto>[] = [
  {
    accessorKey: "visit_datetime",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.original.visit_datetime || "");
      return <span className="pl-4 font-mono">{format(date, "PPP p")}</span>;
    },
  },
  {
    accessorKey: "patient_id",
    header: "Patient ID",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.patient_id.substring(0, 8)}...
      </span>
    ),
  },
  // In a real app we would join with User table or fetch names
  // { accessorKey: "doctor_id", header: "Doctor ID" },
  // { accessorKey: "clinic_id", header: "Clinic ID" },
  {
    accessorKey: "visit_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.visit_type?.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "visit_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.visit_status === VisitStatusEnum.REGISTERED
            ? "outline"
            : row.original.visit_status === VisitStatusEnum.EXAMINING
              ? "default"
              : "secondary"
        }
      >
        {row.original.visit_status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <VisitActionsCell visit={row.original} />,
  },
];

export default function RegistrationVisitsPage() {
  const [data, setData] = useState<VisitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listVisitsApiVisitsGet({ query: { limit: 100 } })
      );
      if (result) {
        setData(result);
      }
      setIsLoading(false);
    };
    fetchData();
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Visit Management
          </H2>
          <P className="text-muted-foreground mt-1">
            Schedule and manage patient appointments.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/registration/visits/new">
            <Plus className="h-4 w-4" />
            New Appointment
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable columns={columns} data={data} searchKey="patient_id" />
        </CardContent>
      </Card>
    </div>
  );
}
