"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";

type Visit = {
  id: string;
  patient: string;
  time: string;
  type: string;
  status: string;
};

const todayQueue: Visit[] = [
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
          {row.original.status === "Sedang Berlangsung" ? "Lanjutkan" : "Mulai"}
        </Link>
      </Button>
    ),
  },
];

export default function DoctorDashboard() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Dasbor Dokter
        </H2>
        <P className="text-muted-foreground mt-1">
          Selamat datang kembali, Dr. Sarah Wilson.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pasien Menunggu"
          value="4"
          description="Di ruang tunggu"
          icon={Users}
        />
        <StatCard
          title="Selesai Hari Ini"
          value="12"
          description="Kunjungan selesai"
          icon={Calendar}
        />
        <StatCard
          title="Rata-rata Waktu Konsultasi"
          value="18m"
          description="Per pasien"
          icon={Clock}
        />
        <StatCard
          title="Peringatan Kritis"
          value="2"
          description="Membutuhkan perhatian"
          icon={Activity}
          trend="+1"
          trendUp={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Antrean Hari Ini
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/doctor/queue">Lihat Semua</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable
              columns={columns}
              data={todayQueue}
              filterKey="status"
              filterOptions={[
                { label: "Menunggu", value: "Menunggu" },
                { label: "Sedang Berlangsung", value: "Sedang Berlangsung" },
                { label: "Terjadwal", value: "Terjadwal" },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">Notifikasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3 rounded-md border border-yellow-100 bg-yellow-50 p-3">
              <Activity className="mt-0.5 h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Hasil Lab Siap
                </p>
                <p className="text-xs text-yellow-700">
                  Hasil tes darah pasien Alice Johnson tersedia.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-md border border-blue-100 bg-blue-50 p-3">
              <Calendar className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Pengingat Rapat
                </p>
                <p className="text-xs text-blue-700">
                  Rapat departemen pukul 14:00.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
