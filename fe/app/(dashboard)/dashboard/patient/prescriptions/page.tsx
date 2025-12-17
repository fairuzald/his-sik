"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listPrescriptionsApiPrescriptionsGet } from "@/sdk/output/sdk.gen";
import {
  PrescriptionDto,
  PrescriptionStatusEnum,
} from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
// removed toast import

export default function PatientPrescriptionsPage() {
  const [data, setData] = useState<PrescriptionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await safeApiCall(listPrescriptionsApiPrescriptionsGet(), {
        errorMessage: "Failed to load prescriptions",
      });
      if (result) {
        setData(result);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const columns: ColumnDef<PrescriptionDto>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => (
        <span className="pl-4">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "dd MMM yyyy")
            : "-"}
        </span>
      ),
    },
    {
      accessorKey: "id",
      header: "Prescription ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.id.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "visit_id",
      header: "Visit ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.visit_id?.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "prescription_status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.prescription_status === "dispensed"
              ? "default"
              : row.original.prescription_status === "cancelled"
                ? "destructive"
                : "secondary"
          }
          className="capitalize"
        >
          {row.original.prescription_status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2 pr-4">
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/patient/prescriptions/${row.original.id}`}>
              View Details
            </Link>
          </Button>
          <Button size="sm" variant="ghost" disabled>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions = Object.values(PrescriptionStatusEnum).map(status => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: status,
  }));

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
            Manage your medications and refills.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="prescription_status"
            filterKey="prescription_status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
