"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Prescription, prescriptions } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<Prescription>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="pl-4">{row.original.date}</span>,
  },
  {
    accessorKey: "id",
    header: "Prescription ID",
    cell: ({ row }) => <span className="font-mono">{row.original.id}</span>,
  },
  { accessorKey: "doctor_name", header: "Prescribed By" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Active" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end gap-2 pr-4">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/dashboard/patient/prescriptions/${row.original.id}`}>
            View Details
          </Link>
        </Button>
        <Button size="sm" variant="ghost">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

const filterOptions = [
  { label: "Active", value: "Active" },
  { label: "Pending", value: "Pending" },
  { label: "Dispensed", value: "Dispensed" },
];

export default function PatientPrescriptionsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Prescriptions
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage your medications and refills.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={prescriptions}
            searchKey="doctor_name"
            filterKey="status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
