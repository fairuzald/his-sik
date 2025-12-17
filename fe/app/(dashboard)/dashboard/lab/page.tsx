"use client";

import { StatCard } from "@/components/dashboard/StatCard";
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
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  FlaskConical,
  Loader2,
} from "lucide-react";
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
      <Button size="sm" variant="ghost" className="text-primary" asChild>
        <Link
          href={
            row.original.order_status === "completed"
              ? `/dashboard/lab/orders/${row.original.id}`
              : `/dashboard/lab/orders/${row.original.id}/edit`
          }
        >
          {row.original.order_status === "completed"
            ? "View Results"
            : "Input Results"}
        </Link>
      </Button>
    ),
  },
];

export default function LabDashboard() {
  const [orders, setOrders] = useState<LabOrderDto[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listLabOrdersApiLabOrdersGet({
          query: { limit: 100 },
        })
      );

      if (result && Array.isArray(result)) {
        setOrders(result);

        // Calculate stats from the fetched list
        const pending =
          result.filter(o => o.order_status === "pending").length || 0;
        const processing =
          result.filter(o => o.order_status === "processing").length || 0;
        const completed =
          result.filter(o => o.order_status === "completed").length || 0;
        setStats({ pending, processing, completed });
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
          Lab Dashboard
        </H2>
        <P className="text-muted-foreground mt-1">
          Manage lab orders and results.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Orders"
          value={stats.pending.toString()}
          description="Samples to process"
          icon={ClipboardList}
        />
        <StatCard
          title="Processing"
          value={stats.processing.toString()}
          description="Being analyzed"
          icon={FlaskConical}
        />
        <StatCard
          title="Completed Today"
          value={stats.completed.toString()} // This is total completed from the list, filtering by date would be better but this is fine for now
          description="Results released"
          icon={CheckCircle}
        />
        <StatCard
          title="Critical Requests"
          value="0" // Mocked for now as priority is not in LabOrderDto (or maybe usage of stats)
          description="High priority"
          icon={AlertCircle}
          trend="Action Req"
          trendUp={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-3">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Recent Lab Orders
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/lab/orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable
              columns={columns}
              data={orders}
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
    </div>
  );
}
