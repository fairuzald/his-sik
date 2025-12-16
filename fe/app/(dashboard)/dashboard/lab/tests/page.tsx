"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";

type LabTest = {
  code: string;
  name: string;
  category: string;
  price: number;
  tat: string;
};

const tests: LabTest[] = [
  {
    code: "CBC",
    name: "Hitung Darah Lengkap",
    category: "Hematologi",
    price: 150000,
    tat: "2 jam",
  },
  {
    code: "LIPID",
    name: "Profil Lipid",
    category: "Kimia",
    price: 250000,
    tat: "4 jam",
  },
  {
    code: "LFT",
    name: "Tes Fungsi Hati",
    category: "Kimia",
    price: 300000,
    tat: "4 jam",
  },
  {
    code: "URINE",
    name: "Urinalisis",
    category: "Mikrobiologi",
    price: 75000,
    tat: "1 jam",
  },
];

const columns: ColumnDef<LabTest>[] = [
  { accessorKey: "code", header: "Kode" },
  { accessorKey: "name", header: "Nama Tes" },
  { accessorKey: "category", header: "Kategori" },
  {
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => `Rp ${row.original.price.toLocaleString("id-ID")}`,
  },
  { accessorKey: "tat", header: "Waktu Pengerjaan" },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" asChild>
        <Link href={`/dashboard/lab/tests/${row.original.code}`}>Lihat</Link>
      </Button>
    ),
  },
];

export default function LabTestsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Direktori Tes
          </H2>
          <P className="text-muted-foreground mt-1">
            Data induk tes laboratorium yang tersedia.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/lab/tests/new">
            <Plus className="h-4 w-4" />
            Tambah Tes Baru
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">Tes Tersedia</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={tests}
            searchKey="name"
            filterKey="category"
            filterOptions={[
              { label: "Hematologi", value: "Hematologi" },
              { label: "Kimia", value: "Kimia" },
              { label: "Mikrobiologi", value: "Mikrobiologi" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
