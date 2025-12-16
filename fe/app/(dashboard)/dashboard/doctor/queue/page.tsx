"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type Visit = {
  id: string;
  patient: string;
  time: string;
  type: string;
  status: string;
};

const queue: Visit[] = [
  {
    id: "VST-001",
    patient: "Alice Johnson",
    time: "09:00",
    type: "Konsultasi Baru",
    status: "Menunggu",
  },
  {
    id: "VST-002",
    patient: "Bob Smith",
    time: "09:30",
    type: "Tindak Lanjut",
    status: "Sedang Berlangsung",
  },
  {
    id: "VST-003",
    patient: "Charlie Brown",
    time: "10:00",
    type: "Pemeriksaan Rutin",
    status: "Terjadwal",
  },
  {
    id: "VST-005",
    patient: "Eve Anderson",
    time: "10:30",
    type: "Konsultasi Baru",
    status: "Terjadwal",
  },
];

const columns: ColumnDef<Visit>[] = [
  { accessorKey: "time", header: "Waktu" },
  { accessorKey: "patient", header: "Pasien" },
  { accessorKey: "type", header: "Tipe" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.status === "Sedang Berlangsung" ? "default" : "secondary"
        }
        className={
          row.original.status === "Sedang Berlangsung" ? "bg-blue-500" : ""
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" asChild>
        <Link href={`/dashboard/doctor/visits/${row.original.id}`}>
          {row.original.status === "Sedang Berlangsung"
            ? "Lanjutkan"
            : "Mulai Konsultasi"}
        </Link>
      </Button>
    ),
  },
];

export default function DoctorQueuePage() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Antrean Saya
        </H2>
        <P className="text-muted-foreground mt-1">
          Kelola daftar pasien hari ini.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Janji Temu Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={queue}
            searchKey="patient"
            filterKey="status"
            filterOptions={[
              { label: "Menunggu", value: "Menunggu" },
              { label: "Sedang Berlangsung", value: "Sedang Berlangsung" },
              { label: "Terjadwal", value: "Terjadwal" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
