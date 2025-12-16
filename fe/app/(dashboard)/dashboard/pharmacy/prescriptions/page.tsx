"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { prescriptions, visits } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type PrescriptionWithPatient = (typeof prescriptions)[0] & {
  patient_name: string;
  doctor_name: string;
};

const data: PrescriptionWithPatient[] = prescriptions.map(prescription => {
  const visit = visits.find(v => v.id === prescription.visit_id);
  return {
    ...prescription,
    patient_name: visit?.patient_name || "Unknown",
    doctor_name: visit?.doctor_name || "Unknown",
  };
});

const columns: ColumnDef<PrescriptionWithPatient>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "patient_name",
    header: "Pasien",
  },
  {
    accessorKey: "doctor_name",
    header: "Dokter",
  },
  {
    accessorKey: "date",
    header: "Tanggal",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "Selesai"
              ? "default"
              : status === "Tertunda"
                ? "secondary"
                : "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          <Button size="icon" variant="ghost" asChild>
            <Link href={`/dashboard/pharmacy/prescriptions/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              toast.error("Resep dihapus (mock)");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function PharmacyPrescriptionsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Resep
          </H2>
          <P className="text-muted-foreground mt-1">
            Kelola resep pasien dan pesanan.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/pharmacy/prescriptions/new">
            <Plus className="h-4 w-4" />
            Resep Baru
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} searchKey="patient_name" />
    </div>
  );
}
