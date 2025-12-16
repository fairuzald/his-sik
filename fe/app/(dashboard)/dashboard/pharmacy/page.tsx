"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Clock, Database, Pill } from "lucide-react";
import Link from "next/link";

type QueueItem = {
  id: string;
  patient: string;
  doctor: string;
  items: number;
  status: string;
  time: string;
};

const prescriptionQueue: QueueItem[] = [
  {
    id: "RX-001",
    patient: "Alice Johnson",
    doctor: "Dr. Sarah Wilson",
    items: 3,
    status: "Tertunda",
    time: "10:00",
  },
  {
    id: "RX-002",
    patient: "Bob Smith",
    doctor: "Dr. James Brown",
    items: 1,
    status: "Sedang Diproses",
    time: "10:15",
  },
  {
    id: "RX-003",
    patient: "Charlie Brown",
    doctor: "Dr. Emily Chen",
    items: 2,
    status: "Siap",
    time: "09:45",
  },
];

const columns: ColumnDef<QueueItem>[] = [
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">
        {row.getValue("time")}
      </span>
    ),
  },
  {
    accessorKey: "id",
    header: "ID Resep",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "patient",
    header: "Pasien",
  },
  {
    accessorKey: "items",
    header: "Item",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Siap" ? "default" : "secondary"}
          className={
            status === "Siap"
              ? "bg-green-500"
              : status === "Sedang Diproses"
                ? "bg-blue-500 text-white"
                : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: () => {
      return (
        <div className="text-right">
          <Button size="sm" variant="ghost" className="text-primary">
            Proses
          </Button>
        </div>
      );
    },
  },
];

export default function PharmacyDashboard() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Dasbor Farmasi
        </H2>
        <P className="text-muted-foreground mt-1">
          Kelola resep dan inventaris.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Resep Tertunda"
          value="8"
          description="Menunggu pemrosesan"
          icon={Clock}
          trend="+2"
          trendUp={false}
        />
        <StatCard
          title="Siap Diambil"
          value="5"
          description="Menunggu pasien"
          icon={CheckCircle}
        />
        <StatCard
          title="Stok Barang Rendah"
          value="3"
          description="Perlu isi ulang stok"
          icon={Database}
          trend="Alert"
          trendUp={false}
        />
        <StatCard
          title="Dikeluarkan Hari Ini"
          value="45"
          description="Total resep"
          icon={Pill}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Antrean Resep
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/pharmacy/queue">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable columns={columns} data={prescriptionQueue} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Peringatan Inventaris
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between rounded-md border border-red-100 bg-red-50 p-3">
              <div>
                <p className="text-sm font-medium text-red-800">
                  Amoxicillin 500mg
                </p>
                <p className="text-xs text-red-600">Stok: 15 (Min: 50)</p>
              </div>
              <Button size="sm" variant="destructive" className="h-8">
                Pesan
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-md border border-yellow-100 bg-yellow-50 p-3">
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Paracetamol 500mg
                </p>
                <p className="text-xs text-yellow-600">Stok: 45 (Min: 100)</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
              >
                Pesan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
