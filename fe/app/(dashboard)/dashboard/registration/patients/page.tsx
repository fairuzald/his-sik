"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Patient, patients } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { PatientActionsCell } from "./actions-cell";

export default function RegistrationPatientsPage() {
  const [data, setData] = useState<Patient[]>(patients);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(p => p.id !== id));
    toast.success("Pasien berhasil dihapus");
  };

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "medical_record_number",
      header: "No. RM",
      cell: ({ row }) => (
        <span className="font-mono">{row.original.medical_record_number}</span>
      ),
    },
    {
      accessorKey: "full_name",
      header: "Nama",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.full_name}</span>
      ),
    },
    { accessorKey: "nik", header: "NIK" },
    { accessorKey: "birth_date", header: "Tgl Lahir" },
    { accessorKey: "gender", header: "Jenis Kelamin" },
    { accessorKey: "phone_number", header: "Telepon" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "Aktif" ? "default" : "secondary"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <PatientActionsCell
          patient={row.original}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Manajemen Pasien
          </H2>
          <P className="text-muted-foreground mt-1">
            Daftarkan pasien baru dan kelola rekam medis.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/registration/patients/new">
            <Plus className="h-4 w-4" />
            Pasien Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable columns={columns} data={data} searchKey="full_name" />
        </CardContent>
      </Card>
    </div>
  );
}
