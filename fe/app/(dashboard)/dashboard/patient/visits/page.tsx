"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Visit, visits } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<Visit>[] = [
  {
    accessorKey: "visit_datetime",
    header: "Tanggal & Waktu",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">
          {row.original.visit_datetime.split(" ")[0]}
        </span>
        <span className="text-muted-foreground text-xs">
          {row.original.visit_datetime.split(" ")[1]}
        </span>
      </div>
    ),
  },
  { accessorKey: "doctor_name", header: "Dokter" },
  { accessorKey: "clinic", header: "Klinik" },
  {
    accessorKey: "visit_type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal capitalize">
        {row.original.visit_type.replace("_", " ")}
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
            ? "bg-green-500 hover:bg-green-600"
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
      <div className="text-right">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/dashboard/patient/visits/${row.original.id}`}>
            Lihat Detail
          </Link>
        </Button>
      </div>
    ),
  },
];

const filterOptions = [
  { label: "Terjadwal", value: "Scheduled" },
  { label: "Sedang Berlangsung", value: "In Progress" },
  { label: "Selesai", value: "Completed" },
  { label: "Dibatalkan", value: "Canceled" },
];

export default function PatientVisitsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Kunjungan Saya
          </H2>
          <P className="text-muted-foreground mt-1">
            Lihat riwayat kunjungan dan janji temu mendatang Anda.
          </P>
        </div>
        <Button className="w-full gap-2 shadow-sm md:w-auto" asChild>
          <Link href="/dashboard/patient/visits/new">
            <Plus className="h-4 w-4" />
            Buat Janji Temu Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={visits}
            searchKey="doctor_name"
            filterKey="status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
