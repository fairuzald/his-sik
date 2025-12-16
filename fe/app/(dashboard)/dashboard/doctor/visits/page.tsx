"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { visits } from "@/data/mock-data";
import { Calendar } from "lucide-react";
import { columns } from "./columns";

const filterOptions = [
  { label: "Terjadwal", value: "Scheduled" },
  { label: "Sedang Berlangsung", value: "In Progress" },
  { label: "Selesai", value: "Completed" },
  { label: "Dibatalkan", value: "Canceled" },
];

export default function DoctorVisitsPage() {
  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Riwayat Kunjungan
          </H2>
          <P className="text-muted-foreground mt-1">
            Lihat konsultasi dan rekam medis masa lalu.
          </P>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Rentang Tanggal
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={visits}
            searchKey="patient_name"
            filterKey="status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
