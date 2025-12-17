"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listLabOrdersApiLabOrdersGet } from "@/sdk/output/sdk.gen";
import { LabOrderDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { FlaskConical, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<LabOrderDto>[] = [
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) => (
      <span>{format(new Date(row.original.created_at), "p")}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.substring(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "visit.patient_id",
    header: "Patient",
    cell: ({ row }) => (
      <span className="text-xs">
        {row.original.visit?.patient_id
          ? row.original.visit.patient_id.substring(0, 8) + "..."
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "lab_test.test_name",
    header: "Test",
    cell: ({ row }) => <span>{row.original.lab_test?.test_name || "-"}</span>,
  },
  {
    accessorKey: "order_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.order_status === "completed" ? "default" : "secondary"
        }
        className={
          row.original.order_status === "completed"
            ? "bg-green-500"
            : row.original.order_status === "processing"
              ? "bg-blue-500 text-white"
              : ""
        }
      >
        {row.original.order_status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" className="text-primary gap-2" asChild>
        <Link
          href={
            row.original.order_status === "completed"
              ? `/dashboard/lab/orders/${row.original.id}`
              : `/dashboard/lab/orders/${row.original.id}/edit`
          }
        >
          <FlaskConical className="h-3 w-3" />
          {row.original.order_status === "completed"
            ? "View Results"
            : "Process"}
        </Link>
      </Button>
    ),
  },
];

export default function LabOrdersPage() {
  const [data, setData] = useState<LabOrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listLabOrdersApiLabOrdersGet({ query: { limit: 100 } })
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
          Lab Orders
        </H2>
        <P className="text-muted-foreground mt-1">
          View and process laboratory test requests.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">Order Queue</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={data}
            searchKey="id"
            filterKey="order_status"
            filterOptions={[
              { label: "Pending", value: "pending" },
              { label: "Processing", value: "processing" },
              { label: "Completed", value: "completed" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
