"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { FlaskConical } from "lucide-react";
import Link from "next/link";

type LabOrder = {
  id: string;
  patient: string;
  test: string;
  priority: string;
  status: string;
  time: string;
};

const orders: LabOrder[] = [
  {
    id: "LAB-001",
    patient: "Alice Johnson",
    test: "CBC",
    priority: "Rutin",
    status: "Tertunda",
    time: "09:30",
  },
  {
    id: "LAB-002",
    patient: "Bob Smith",
    test: "Lipid Profile",
    priority: "Mendesak",
    status: "Sedang Diproses",
    time: "10:00",
  },
  {
    id: "LAB-003",
    patient: "Charlie Brown",
    test: "Urinalysis",
    priority: "Rutin",
    status: "Selesai",
    time: "08:45",
  },
  {
    id: "LAB-004",
    patient: "Diana Prince",
    test: "Blood Glucose",
    priority: "Rutin",
    status: "Tertunda",
    time: "10:45",
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
        variant={
          row.original.priority === "Mendesak" ? "destructive" : "outline"
        }
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
        variant={row.original.status === "Selesai" ? "default" : "secondary"}
        className={
          row.original.status === "Selesai"
            ? "bg-green-500"
            : row.original.status === "Sedang Diproses"
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
      <Button size="sm" variant="ghost" className="text-primary gap-2" asChild>
        <Link
          href={
            row.original.status === "Selesai"
              ? `/dashboard/lab/tests/${row.original.id}`
              : `/dashboard/lab/tests/${row.original.id}/edit`
          }
        >
          <FlaskConical className="h-3 w-3" />
          {row.original.status === "Selesai" ? "Lihat Hasil" : "Proses"}
        </Link>
      </Button>
    ),
  },
];

export default function LabOrdersPage() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Pesanan Lab
        </H2>
        <P className="text-muted-foreground mt-1">
          Lihat dan proses permintaan tes laboratorium.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Antrean Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={orders}
            searchKey="patient"
            filterKey="status"
            filterOptions={[
              { label: "Tertunda", value: "Tertunda" },
              { label: "Sedang Diproses", value: "Sedang Diproses" },
              { label: "Selesai", value: "Selesai" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
