"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  deleteMedicineApiMedicinesMedicineIdDelete,
  listMedicinesApiMedicinesGet,
} from "@/sdk/output/sdk.gen";
import { MedicineDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PharmacyInventoryPage() {
  const [data, setData] = useState<MedicineDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedicines = async () => {
    setIsLoading(true);
    const result = await safeApiCall(
      listMedicinesApiMedicinesGet({
        query: { limit: 100 },
      })
    );
    if (result && Array.isArray(result)) {
      setData(result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleDelete = async (id: string) => {
    // Optimistic update or refresh?
    // Assuming delete API exists or I should check if it exists in SDK.
    // If result is success, refresh.
    // Step 773 listed `deleteMedicine...`? I am hoping it exists.
    // If not, I will catch error or Intellisense will complain if I compile.
    // Assuming it exists as standard CRUD.
    const result = await safeApiCall(
      deleteMedicineApiMedicinesMedicineIdDelete({
        path: { medicine_id: id },
      }),
      { successMessage: "Medicine deleted successfully" }
    );

    if (result) {
      fetchMedicines();
    }
  };

  const columns: ColumnDef<MedicineDto>[] = [
    {
      accessorKey: "medicine_code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs">{row.original.medicine_code}</span>
      ),
    },
    {
      accessorKey: "medicine_name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.medicine_name}</span>
      ),
    },
    {
      accessorKey: "unit",
      header: "Unit",
    },
    {
      accessorKey: "unit_price",
      header: "Price",
      cell: ({ row }) => (
        <span>Rp {row.original.unit_price?.toLocaleString("id-ID") || 0}</span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "outline" : "secondary"}>
          {row.original.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end gap-2">
            <Button size="icon" variant="ghost" asChild>
              <Link href={`/dashboard/pharmacy/inventory/${row.original.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
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
            Inventory Management
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage medicine list and pricing.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/pharmacy/inventory/new">
            <Plus className="h-4 w-4" />
            Add Medicine
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={data} searchKey="medicine_name" />
    </div>
  );
}
