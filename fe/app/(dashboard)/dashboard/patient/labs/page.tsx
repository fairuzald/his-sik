"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { LabOrder, labOrders } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Download } from "lucide-react";
import Link from "next/link";

const columns: ColumnDef<LabOrder>[] = [
  {
    accessorKey: "request_datetime",
    header: "Date",
    cell: ({ row }) => (
      <span className="pl-4">{row.original.request_datetime}</span>
    ),
  },
  {
    accessorKey: "test_name",
    header: "Test Name",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.test_name}</span>
    ),
  },
  { accessorKey: "doctor_name", header: "Ordering Doctor" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Completed" ? "default" : "secondary"}
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
          <Link href={`/dashboard/patient/labs/${row.original.id}`}>
            View Result
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
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Requested", value: "Requested" },
];

export default function PatientLabsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Lab Results
          </H2>
          <P className="text-muted-foreground mt-1">
            View and download your laboratory test results.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={labOrders}
            searchKey="test_name"
            filterKey="status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
