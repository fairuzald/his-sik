"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listPrescriptionsApiPrescriptionsGet } from "@/sdk/output/sdk.gen";
import { PrescriptionDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CheckCircle, Clock, Database, Loader2, Pill } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<PrescriptionDto>[] = [
  {
    accessorKey: "created_at",
    header: "Time",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">
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
    id: "items",
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
    header: "Action",
    cell: ({ row }) => {
      const status = row.original.prescription_status;
      return (
        <div className="text-right">
          <Button size="sm" variant="ghost" className="text-primary" asChild>
            <Link
              href={
                status === "completed"
                  ? `/dashboard/pharmacy/prescriptions` // TODO: detail view
                  : `/dashboard/pharmacy/prescriptions` // TODO: process view?
              }
            >
              {status === "completed" ? "View" : "Process"}
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export default function PharmacyDashboard() {
  const [queue, setQueue] = useState<PrescriptionDto[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    ready: 0,
    dispensed: 0,
  });
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
        setQueue(result);

        // Calculate stats
        const pending = result.filter(
          p => p.prescription_status === "pending"
        ).length;
        const processing = result.filter(
          p => p.prescription_status === "processing"
        ).length;
        const completed = result.filter(
          p => p.prescription_status === "completed"
        ).length;

        setStats({
          pending: pending,
          ready: processing, // specific 'ready' status might not exist, mapping processing/ready
          dispensed: completed,
        });
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
          Pharmacy Dashboard
        </H2>
        <P className="text-muted-foreground mt-1">
          Manage prescriptions and inventory.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Prescriptions"
          value={stats.pending.toString()}
          description="Waiting for processing"
          icon={Clock}
          trend="+2"
          trendUp={false}
        />
        <StatCard
          title="Processing/Ready"
          value={stats.ready.toString()}
          description="Being prepared or ready"
          icon={CheckCircle}
        />
        <StatCard
          title="Low Stock Items"
          value="-" // Not available in API currently
          description="Needs restocking"
          icon={Database}
          trend="Alert"
          trendUp={false}
        />
        <StatCard
          title="Dispensed Today"
          value={stats.dispensed.toString()} // Total completed in list
          description="Total prescriptions"
          icon={Pill}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Prescription Queue
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pharmacy/queue">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable
              columns={columns}
              data={queue}
              filterKey="prescription_status"
              filterOptions={[
                { label: "Pending", value: "pending" },
                { label: "Processing", value: "processing" },
                { label: "Completed", value: "completed" },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Inventory Alerts (Mock)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Mock Data - Real data requires Stock field in Medicine API */}
            <div className="flex items-center justify-between rounded-md border border-red-100 bg-red-50 p-3">
              <div>
                <p className="text-sm font-medium text-red-800">
                  Amoxicillin 500mg
                </p>
                <p className="text-xs text-red-600">Stock: 15 (Min: 50)</p>
              </div>
              <Button size="sm" variant="destructive" className="h-8">
                Order
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border border-yellow-100 bg-yellow-50 p-3">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Paracetamol 500mg
                </p>
                <p className="text-xs text-yellow-600">Stock: 45 (Min: 100)</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
              >
                Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
