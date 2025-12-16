"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

type Payment = {
  id: string;
  invoiceId: string;
  patient: string;
  amount: number;
  method: string;
  date: string;
  status: string;
};

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "id", header: "ID Pembayaran" },
  { accessorKey: "invoiceId", header: "ID Faktur" },
  { accessorKey: "patient", header: "Pasien" },
  {
    accessorKey: "amount",
    header: "Jumlah",
    cell: ({ row }) => `Rp ${row.original.amount.toLocaleString("id-ID")}`,
  },
  { accessorKey: "method", header: "Metode" },
  { accessorKey: "date", header: "Tanggal" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Sukses" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" asChild>
        <Link href={`/dashboard/cashier/payments/${row.original.id}`}>
          Lihat Kwitansi
        </Link>
      </Button>
    ),
  },
];

const data: Payment[] = [
  {
    id: "PAY-001",
    invoiceId: "INV-001",
    patient: "Alice Johnson",
    amount: 150000,
    method: "Tunai",
    date: "2023-11-20",
    status: "Sukses",
  },
  {
    id: "PAY-002",
    invoiceId: "INV-002",
    patient: "Bob Smith",
    amount: 250000,
    method: "Kartu Kredit",
    date: "2023-11-20",
    status: "Sukses",
  },
];

export default function CashierPaymentsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Pembayaran
          </H2>
          <P className="text-muted-foreground mt-1">
            Lihat riwayat pembayaran dan kwitansi.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Riwayat Pembayaran
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={data}
            searchKey="patient"
            filterKey="status"
            filterOptions={[
              { label: "Sukses", value: "Sukses" },
              { label: "Tertunda", value: "Tertunda" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
