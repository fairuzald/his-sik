"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import {
  AlertCircle,
  CheckCircle,
  ClipboardList,
  FlaskConical,
} from "lucide-react";
import Link from "next/link";

type LabOrder = {
  id: string;
  patient: string;
  test: string;
  priority: string;
  status: string;
  time: string;
};

const labQueue: LabOrder[] = [
  {
    id: "LAB-001",
    patient: "Alice Johnson",
    test: "CBC",
    priority: "Routine",
    status: "Pending",
    time: "09:30",
  },
  {
    id: "LAB-002",
    patient: "Bob Smith",
    test: "Lipid Profile",
    priority: "Urgent",
    status: "Processing",
    time: "10:00",
  },
  {
    id: "LAB-003",
    patient: "Charlie Brown",
    test: "Urinalysis",
    priority: "Routine",
    status: "Completed",
    time: "08:45",
  },
];

const columns: ColumnDef<LabOrder>[] = [
  { accessorKey: "time", header: "Waktu" },
  { accessorKey: "id", header: "ID Pesanan" },
  { accessorKey: "patient", header: "Pasien" },
  { accessorKey: "test", header: "Tes" },
  {
    accessorKey: "priority",
    header: "Prioritas",
    cell: ({ row }) => (
      <Badge
        variant={row.original.priority === "Urgent" ? "destructive" : "outline"}
      >
        {row.original.priority}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Completed" ? "default" : "secondary"}
        className={
          row.original.status === "Completed"
            ? "bg-green-500"
            : row.original.status === "Processing"
              ? "bg-blue-500 text-white"
              : ""
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" className="text-primary" asChild>
        <Link
          href={
            row.original.status === "Completed"
              ? `/dashboard/lab/orders/${row.original.id}`
              : `/dashboard/lab/orders/${row.original.id}/edit`
          }
        >
          {row.original.status === "Completed" ? "Lihat Hasil" : "Input Hasil"}
        </Link>
      </Button>
    ),
  },
];

export default function LabDashboard() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Dasbor Laboratorium
        </H2>
        <P className="text-muted-foreground mt-1">
          Kelola pesanan lab dan hasil.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pesanan Tertunda"
          value="12"
          description="Sampel untuk diproses"
          icon={ClipboardList}
        />
        <StatCard
          title="Sedang Diproses"
          value="5"
          description="Sedang menganalisis"
          icon={FlaskConical}
        />
        <StatCard
          title="Selesai Hari Ini"
          value="28"
          description="Hasil dirilis"
          icon={CheckCircle}
        />
        <StatCard
          title="Permintaan Mendesak"
          value="3"
          description="Prioritas tinggi"
          icon={AlertCircle}
          trend="Action Req"
          trendUp={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-3">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Pesanan Lab Terbaru
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/lab/orders">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable
              columns={columns}
              data={labQueue}
              filterKey="status"
              filterOptions={[
                { label: "Pending", value: "Pending" },
                { label: "Processing", value: "Processing" },
                { label: "Completed", value: "Completed" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
