"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { listUsersApiUsersGet } from "@/sdk/output/sdk.gen"; // Use SDK API
import { UserDao } from "@/sdk/output/types.gen"; // Use SDK type
import { ColumnDef } from "@tanstack/react-table";
import { Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell: ({ row }) => <UserActionsCell user={row.original as any} />,
  },
];

const filterOptions = [
  { label: "Doctor", value: "doctor" },
  { label: "Registration", value: "registration" },
  { label: "Pharmacy", value: "pharmacy" },
  { label: "Admin", value: "admin" },
  { label: "Patient", value: "patient" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await listUsersApiUsersGet();
      if (response.data?.success && response.data.data) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data?.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setIsLoading(false);
    }
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
