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
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<PrescriptionDto>[] = [
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) => (
      <span className="font-mono">
        {format(new Date(row.original.created_at), "p")}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "Prescription ID",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.id.substring(0, 8)}...</span>
    ),
  },
  {
    accessorKey: "visit.patient_id",
    header: "Patient",
    cell: ({ row }) => (
      <span>
        {row.original.visit?.patient_id
          ? row.original.visit.patient_id.substring(0, 8) + "..."
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "doctor_id",
    header: "Doctor",
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.doctor_id.substring(0, 8)}...
      </span>
    ),
  },
  {
    header: "Items",
    cell: ({ row }) => <span>{row.original.items?.length || 0}</span>,
  },
  {
    accessorKey: "prescription_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.prescription_status;
      return (
        <Badge
          variant={status === "completed" ? "default" : "secondary"}
          className={
            status === "completed"
              ? "bg-green-500"
              : status === "processing"
                ? "bg-blue-500 text-white"
                : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = row.original.prescription_status;
      return (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/pharmacy/prescriptions/${row.original.id}`}>
              {status === "completed" ? "View" : "Process"}
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export default function PharmacyQueuePage() {
  const [data, setData] = useState<PrescriptionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listPrescriptionsApiPrescriptionsGet({
          query: { limit: 100 },
        })
      );

      if (result && Array.isArray(result)) {
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
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Prescription Queue
        </H2>
        <P className="text-muted-foreground mt-1">
          Process incoming prescriptions.
        </P>
      </div>

      <DataTable
        columns={columns}
        data={data}
        searchKey="id"
        filterKey="prescription_status"
        filterOptions={[
          { label: "Pending", value: "pending" },
          { label: "Processing", value: "processing" },
          { label: "Completed", value: "completed" },
        ]}
      />
    </div>
  );
}
