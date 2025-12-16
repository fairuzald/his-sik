"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { User, users } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { UserActionsCell } from "./actions-cell";

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Nama Pengguna",
    cell: ({ row }) => (
      <span className="pl-4 font-medium">{row.original.username}</span>
    ),
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role_name", header: "Peran" },
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
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];

const filterOptions = [
  { label: "Dokter", value: "Doctor" },
  { label: "Pendaftaran", value: "Registration" },
  { label: "Farmasi", value: "Pharmacy" },
  { label: "Admin", value: "Admin" },
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Manajemen Pengguna
          </H2>
          <P className="text-muted-foreground mt-1">
            Kelola pengguna sistem dan hak akses.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/admin/users/new">
            <Plus className="h-4 w-4" />
            Tambah Pengguna
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="username"
            filterKey="role_name"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
