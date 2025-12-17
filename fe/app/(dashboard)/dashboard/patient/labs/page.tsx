"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  getLabTestApiLabTestsTestIdGet,
  listLabOrdersApiLabOrdersGet,
} from "@/sdk/output/sdk.gen";
import { LabOrderDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
// removed toast import

// Helper to fetch test name
const LabTestName = ({ id }: { id: string }) => {
  const [name, setName] = useState<string>("Loading...");
  useEffect(() => {
    safeApiCall(getLabTestApiLabTestsTestIdGet({ path: { test_id: id } })).then(
      data => {
        if (data) setName(data.test_name);
        else setName("Unknown Test");
      }
    );
  }, [id]);
  return <span>{name}</span>;
};

export default function PatientLabsPage() {
  const [data, setData] = useState<LabOrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await safeApiCall(listLabOrdersApiLabOrdersGet(), {
        errorMessage: "Failed to load lab results",
      });
      if (result) {
        setData(result);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const columns: ColumnDef<LabOrderDto>[] = [
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
      accessorKey: "lab_test_id",
      header: "Test Name",
      cell: ({ row }) => (
        <span className="font-medium">
          <LabTestName id={row.original.lab_test_id} />
        </span>
      ),
    },
    {
      accessorKey: "doctor_id",
      header: "Doctor ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.doctor_id?.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "order_status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.order_status === "completed" ? "default" : "secondary"
          }
          className="capitalize"
        >
          {row.original.order_status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2 pr-4">
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/patient/labs/${row.original.id}`}>
              View Result
            </Link>
          </Button>
          <Button size="sm" variant="ghost" disabled>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Canceled", value: "canceled" },
  ];

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
            Lab Results
          </H2>
          <P className="text-muted-foreground mt-1">
            View and download your laboratory test results.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="order_status"
            filterKey="order_status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
