"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, Users } from "lucide-react";
import Link from "next/link";

type RecentUser = {
  id: string;
  name: string;
  role: string;
  status: string;
  lastLogin: string;
};

const recentUsers: RecentUser[] = [
  {
    id: "USR-001",
    name: "Dr. Sarah Wilson",
    role: "Dokter",
    status: "Aktif",
    lastLogin: "2 menit lalu",
  },
  {
    id: "USR-002",
    name: "James Brown",
    role: "Admin",
    status: "Aktif",
    lastLogin: "1 jam lalu",
  },
  {
    id: "USR-003",
    name: "Emily Chen",
    role: "Perawat",
    status: "Tidak Aktif",
    lastLogin: "2 hari lalu",
  },
];

const columns: ColumnDef<RecentUser>[] = [
  { accessorKey: "name", header: "Pengguna" },
  { accessorKey: "role", header: "Peran" },
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
    accessorKey: "lastLogin",
    header: () => <div className="text-right">Terakhir Masuk</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right">
        {row.original.lastLogin}
      </div>
    ),
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Dasbor Admin
        </H2>
        <P className="text-muted-foreground mt-1">
          Ringkasan sistem dan manajemen pengguna.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pengguna"
          value="156"
          description="Akun aktif"
          icon={Users}
        />
        <StatCard
          title="Kesehatan Sistem"
          value="98%"
          description="Waktu aktif (30 hari terakhir)"
          icon={Activity}
          trend="Good"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Aktivitas Pengguna Terbaru
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/admin/users">Kelola Pengguna</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable columns={columns} data={recentUsers} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/admin/users/new">
                <Users className="mr-2 h-4 w-4" />
                Tambah Pengguna Baru
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
