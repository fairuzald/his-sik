"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VisitDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<VisitDto>[] = [
  {
    accessorKey: "visit_datetime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.visit_datetime || "");
      return <span className="pl-4">{format(date, "MMM dd, yyyy HH:mm")}</span>;
    },
  },
  {
    accessorKey: "patient_id",
    header: "Patient ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.patient_id.substring(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "visit_type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.visit_type?.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "visit_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.visit_status;
      return (
        <Badge variant="secondary" className="">
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const visit = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(visit.id)}
            >
              Copy Visit ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/doctor/visits/${visit.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
