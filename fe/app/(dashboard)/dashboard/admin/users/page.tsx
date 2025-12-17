"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listUsersApiUsersGet } from "@/sdk/output/sdk.gen";
import { UserDao } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserActionsCell } from "./actions-cell";

const columns: ColumnDef<UserDao>[] = [
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => (
      <span className="pl-4 font-medium">{row.original.username}</span>
    ),
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  },
];

const filterOptions = [
  { label: "Doctor", value: "doctor" },
  { label: "Registration", value: "registration" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Admin", value: "admin" },
  { label: "Patient", value: "patient" },
  { label: "Nurse", value: "nurse" },
  { label: "Lab", value: "lab" },
  { label: "Cashier", value: "cashier" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    const result = await safeApiCall(
      listUsersApiUsersGet({
        query: { limit: 100 },
      })
    );

    if (result && Array.isArray(result)) {
      setUsers(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            User Management
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage system users and access rights.
          </P>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={fetchUsers}
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button className="gap-2 shadow-sm" asChild>
            <Link href="/dashboard/admin/users/new">
              <Plus className="h-4 w-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={users}
            searchKey="username"
            filterKey="role"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
