"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { recentRegistrations } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Clock, UserPlus, Users } from "lucide-react";
import Link from "next/link";

type RecentRegistration = {
  id: string;
  time: string;
  name: string;
  type: string;
};

const columns: ColumnDef<RecentRegistration>[] = [
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => (
      <span className="text-muted-foreground font-mono">
        {row.original.time}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "type",
    header: "Tipe",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.type}
      </Badge>
    ),
  },
];

export default function RegistrationDashboard() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Dasbor Pendaftaran
          </H2>
          <P className="text-muted-foreground mt-1">
            Ringkasan aktivitas pendaftaran hari ini.
          </P>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 shadow-sm" variant="outline" asChild>
            <Link href="/dashboard/registration/visits/new">
              <Calendar className="h-4 w-4" />
              Kunjungan Baru
            </Link>
          </Button>
          <Button className="gap-2 shadow-sm" asChild>
            <Link href="/dashboard/registration/patients/new">
              <UserPlus className="h-4 w-4" />
              Pasien Baru
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pasien Hari Ini"
          value="45"
          description="+12% dari kemarin"
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title="Pendaftaran Baru"
          value="8"
          description="Profil pasien baru"
          icon={UserPlus}
        />
        <StatCard
          title="Kunjungan Aktif"
          value="12"
          description="Saat ini di klinik"
          icon={Calendar}
        />
        <StatCard
          title="Rata-rata Waktu Tunggu"
          value="15m"
          description="Antrean pendaftaran"
          icon={Clock}
          trend="-2m"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable columns={columns} data={recentRegistrations} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
