"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listPrescriptionsApiPrescriptionsGet } from "@/sdk/output/sdk.gen";
import { PrescriptionDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<PrescriptionDto>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.substring(0, 8)}...
      </span>
    ),
  },
  {
    header: "Patient",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.visit?.patient_id
          ? row.original.visit.patient_id.substring(0, 8) + "..."
          : "Unknown"}
      </span>
    ),
  },
  {
    header: "Doctor",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.doctor_id.substring(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span>
        {row.original.created_at
          ? format(new Date(row.original.created_at), "PP")
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "prescription_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.prescription_status;
      return (
        <Badge
          variant={
            status === "completed"
              ? "default"
              : status === "pending"
                ? "secondary"
                : "outline"
          }
          className={status === "completed" ? "bg-green-500" : ""}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          <Button size="icon" variant="ghost" asChild>
            <Link href={`/dashboard/pharmacy/prescriptions/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export default function PharmacyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listPrescriptionsApiPrescriptionsGet({ query: { limit: 100 } })
      );
      if (result && Array.isArray(result)) {
        setPrescriptions(result);
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
            Prescriptions
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage patient prescriptions and orders.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/pharmacy/prescriptions/new">
            <Plus className="h-4 w-4" />
            New Prescription
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={prescriptions}
        searchKey="id"
        filterKey="prescription_status"
        filterOptions={[
          { label: "Pending", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Completed", value: "completed" },
          { label: "Canceled", value: "canceled" },
        ]}
      />
    </div>
  );
}
