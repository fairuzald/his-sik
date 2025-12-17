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
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PatientActionsCell } from "./actions-cell";

export default function RegistrationPatientsPage() {
  const [data, setData] = useState<UserDao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await safeApiCall(
      listUsersApiUsersGet({
        query: {
          roles: "patient",
          limit: 1000,
        },
      })
    );
    if (result) {
      setData(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: string) => {
    setData(prev => prev.filter(p => p.id !== id));
    toast.success("Patient deleted (simulated)");
    // Integrate delete API if available for staff to delete patients
  };

  const columns: ColumnDef<UserDao>[] = [
    {
      accessorKey: "username",
      header: "Username", // Functions as No. RM often
      cell: ({ row }) => (
        <span className="font-mono">{row.original.username}</span>
      ),
    },
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.full_name}</span>
      ),
    },
    { accessorKey: "email", header: "Email" },
    // NIK, DOB, Gender are not in UserDao list view currently.
    // { accessorKey: "phone_number", header: "Phone" },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => row.original.phone_number || "-",
    },
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
      cell: ({ row }) => (
        <PatientActionsCell
          patient={row.original}
          // onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Patient Management
          </H2>
          <P className="text-muted-foreground mt-1">
            Register new patients and manage medical records.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/registration/patients/new">
            <Plus className="h-4 w-4" />
            New Patient
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable columns={columns} data={data} searchKey="full_name" />
        </CardContent>
      </Card>
    </div>
  );
}
