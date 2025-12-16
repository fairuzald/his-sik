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
import { VisitActionsCell } from "./actions-cell";

const columns: ColumnDef<Visit>[] = [
  {
    accessorKey: "visit_datetime",
    header: "Tanggal & Waktu",
    cell: ({ row }) => (
      <span className="pl-4">{row.original.visit_datetime}</span>
    ),
  },
  {
    accessorKey: "patient_name",
    header: "Pasien",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.patient_name}</span>
    ),
  },
  { accessorKey: "doctor_name", header: "Dokter" },
  { accessorKey: "clinic", header: "Klinik" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "Terjadwal"
            ? "outline"
            : row.original.status === "Sedang Berlangsung"
              ? "default"
              : "secondary"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <VisitActionsCell visit={row.original} />,
  },
];

export default function RegistrationVisitsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Manajemen Kunjungan
          </H2>
          <P className="text-muted-foreground mt-1">
            Jadwalkan dan kelola janji temu pasien.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/registration/visits/new">
            <Plus className="h-4 w-4" />
            Janji Temu Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable columns={columns} data={visits} searchKey="patient_name" />
        </CardContent>
      </Card>
    </div>
  );
}
