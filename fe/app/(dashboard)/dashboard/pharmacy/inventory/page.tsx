"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Medicine, medicines } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const columns: ColumnDef<Medicine>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "medicine_name",
    header: "Nama",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("medicine_name")}</span>
    ),
  },
  {
    accessorKey: "dosage_form",
    header: "Bentuk",
  },
  {
    accessorKey: "stock",
    header: "Stok",
    cell: ({ row }) => (
      <span>
        {row.getValue("stock")} {row.original.unit}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      // Logic to determine status based on stock if not provided, or use status field
      // For now using the status field from mock data which says "Active"
      // But let's add some logic for visual flair if stock is low
      const stock = row.original.stock;
      const isLowStock = stock < 50; // Arbitrary threshold

      return (
        <Badge
          variant={isLowStock ? "destructive" : "outline"}
          className={
            isLowStock
              ? "border-red-200 bg-red-100 text-red-800 hover:bg-red-200"
              : ""
          }
        >
          {isLowStock && <AlertTriangle className="mr-1 h-3 w-3" />}
          {isLowStock ? "Stok Rendah" : "Tersedia"}
        </Badge>
      );
    },
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
            onClick={() => {
              toast.error("Obat dihapus (mock)");
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function PharmacyInventoryPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Manajemen Inventaris
          </H2>
          <P className="text-muted-foreground mt-1">
            Lacak stok obat dan pesanan.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/pharmacy/inventory/new">
            <Plus className="h-4 w-4" />
            Tambah Obat
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={medicines} searchKey="medicine_name" />
    </div>
  );
}
