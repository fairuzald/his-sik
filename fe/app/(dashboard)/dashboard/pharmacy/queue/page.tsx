"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Clock } from "lucide-react";

type QueueItem = {
  id: string;
  patient: string;
  doctor: string;
  items: number;
  status: string;
  time: string;
};

const queue: QueueItem[] = [
  {
    id: "RX-001",
    patient: "Alice Johnson",
    doctor: "Dr. Sarah Wilson",
    items: 3,
    status: "Tertunda",
    time: "10:00",
  },
  {
    id: "RX-002",
    patient: "Bob Smith",
    doctor: "Dr. James Brown",
    items: 1,
    status: "Sedang Diproses",
    time: "10:15",
  },
  {
    id: "RX-003",
    patient: "Charlie Brown",
    doctor: "Dr. Emily Chen",
    items: 2,
    status: "Siap",
    time: "09:45",
  },
  {
    id: "RX-004",
    patient: "Diana Prince",
    doctor: "Dr. Sarah Wilson",
    items: 4,
    status: "Tertunda",
    time: "10:30",
  },
];

const columns: ColumnDef<QueueItem>[] = [
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ row }) => (
      <span className="font-mono">{row.getValue("time")}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "ID Resep",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("id")}</span>
    ),
  },
  {
    accessorKey: "patient",
    header: "Pasien",
  },
  {
    accessorKey: "doctor",
    header: "Dokter",
  },
  {
    accessorKey: "items",
    header: "Item",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Siap" ? "default" : "secondary"}
          className={
            status === "Siap"
              ? "bg-green-500"
              : status === "Sedang Diproses"
                ? "bg-blue-500 text-white"
                : ""
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex justify-end gap-2">
          {status === "Tertunda" && (
            <Button size="sm" className="gap-2">
              <Clock className="h-3 w-3" />
              Mulai Proses
            </Button>
          )}
          {status === "Sedang Diproses" && (
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
              <Check className="h-3 w-3" />
              Tandai Siap
            </Button>
          )}
          {status === "Siap" && (
            <Button size="sm" variant="outline">
              Keluarkan
            </Button>
          )}
        </div>
      );
    },
  },
];

export default function PharmacyQueuePage() {
  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Antrean Resep
        </H2>
        <P className="text-muted-foreground mt-1">Proses resep masuk.</P>
      </div>

      <DataTable columns={columns} data={queue} searchKey="patient" />
    </div>
  );
}
