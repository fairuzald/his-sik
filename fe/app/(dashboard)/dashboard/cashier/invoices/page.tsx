"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ColumnDef } from "@tanstack/react-table";
import { CreditCard, Download, QrCode } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Invoice = {
  id: string;
  patient: string;
  amount: number;
  status: string;
  date: string;
};

type InvoiceItem = {
  description: string;
  amount: number;
};

type InvoiceDetail = Invoice & {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
};

const invoices: Invoice[] = [
  {
    id: "INV-001",
    patient: "Alice Johnson",
    amount: 1500000,
    status: "Belum Lunas",
    date: "2023-11-20",
  },
  {
    id: "INV-002",
    patient: "Bob Smith",
    amount: 750000,
    status: "Lunas",
    date: "2023-11-20",
  },
  {
    id: "INV-003",
    patient: "Charlie Brown",
    amount: 250000,
    status: "Lunas",
    date: "2023-11-19",
  },
  {
    id: "INV-004",
    patient: "Diana Prince",
    amount: 1200000,
    status: "Belum Lunas",
    date: "2023-11-18",
  },
];

export default function CashierInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(
    null
  );
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handlePayClick = (invoice: Invoice) => {
    // Mock generating details
    const items = [
      { description: "Biaya Konsultasi", amount: invoice.amount * 0.7 },
      { description: "Obat-obatan", amount: invoice.amount * 0.3 },
    ];
    const subtotal = invoice.amount;
    const tax = 0;
    const total = invoice.amount;

    setSelectedInvoice({
      ...invoice,
      items,
      subtotal,
      tax,
      total,
    });
    setShowPaymentDialog(true);
  };

  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: "id", header: "ID Faktur" },
    { accessorKey: "date", header: "Tanggal" },
    { accessorKey: "patient", header: "Pasien" },
    {
      accessorKey: "amount",
      header: "Jumlah",
      cell: ({ row }) => `Rp ${row.original.amount.toLocaleString("id-ID")}`,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "Lunas" ? "default" : "destructive"}
          className={row.original.status === "Lunas" ? "bg-green-500" : ""}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          {row.original.status === "Belum Lunas" && (
            <Button
              size="sm"
              className="gap-2"
              onClick={() => handlePayClick(row.original)}
            >
              <CreditCard className="h-3 w-3" />
              Bayar
            </Button>
          )}
          {row.original.status === "Lunas" && (
            <Button size="sm" variant="ghost" asChild>
              <Link href={`/dashboard/cashier/payments/PAY-${row.original.id}`}>
                <Download className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Faktur
        </H2>
        <P className="text-muted-foreground mt-1">
          Kelola tagihan dan pembayaran pasien.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">Semua Faktur</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={invoices}
            searchKey="patient"
            filterKey="status"
            filterOptions={[
              { label: "Lunas", value: "Lunas" },
              { label: "Belum Lunas", value: "Belum Lunas" },
            ]}
          />
        </CardContent>
      </Card>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Proses Pembayaran</DialogTitle>
            <DialogDescription>
              Detail faktur dan pemrosesan pembayaran.
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">ID Faktur</span>
                  <span>{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Pasien</span>
                  <span>{selectedInvoice.patient}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                {selectedInvoice.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.description}</span>
                    <span>Rp {item.amount.toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Jumlah</span>
                <span className="text-primary text-lg">
                  Rp {selectedInvoice.total.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed bg-slate-50 p-4">
                <div className="relative h-32 w-32 overflow-hidden bg-white p-2 shadow-sm">
                  <div className="absolute inset-0 flex flex-wrap content-start">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-4 w-4 ${
                          i % 2 === 0 || i % 3 === 0 ? "bg-black" : "bg-white"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-sm bg-white p-1">
                      <QrCode className="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  Pindai QR untuk Bayar
                </p>
              </div>
              <Button className="w-full" size="lg">
                Konfirmasi Pembayaran
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
