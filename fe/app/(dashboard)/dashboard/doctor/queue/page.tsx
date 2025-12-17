"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  getMyProfileApiProfileMeGet,
  listVisitsApiVisitsGet,
} from "@/sdk/output/sdk.gen";
import { VisitDto, VisitStatusEnum } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DoctorQueuePage() {
  const [visits, setVisits] = useState<VisitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      // Get profile to get doctor ID
      const profile = await safeApiCall(getMyProfileApiProfileMeGet());

      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const visitsList = await safeApiCall(
        listVisitsApiVisitsGet({
          query: {
            date_from: startOfDay,
            date_to: endOfDay,
            limit: 100,
          },
        })
      );

      if (visitsList && profile) {
        // Filter visits for the logged-in doctor
        let doctorId: string | null = null;
        if (profile.role === "doctor" && profile.details) {
          const doctorDetails = profile.details as any;
          doctorId = doctorDetails.id;
        }

        const myVisits = doctorId
          ? visitsList.filter(v => v.doctor_id === doctorId)
          : [];

        setVisits(myVisits);
      }
      setIsLoading(false);
    };

    fetchQueue();
  }, []);

  const columns: ColumnDef<VisitDto>[] = [
    {
      accessorKey: "visit_datetime",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.visit_datetime || "");
        return <span className="font-medium">{format(date, "HH:mm")}</span>;
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
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.visit_status === VisitStatusEnum.EXAMINING
              ? "default"
              : row.original.visit_status === VisitStatusEnum.COMPLETED
                ? "secondary"
                : "outline"
          }
          className={
            row.original.visit_status === VisitStatusEnum.EXAMINING
              ? "bg-blue-500 hover:bg-blue-600"
              : ""
          }
        >
          {row.original.visit_status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button size="sm" asChild>
          <Link href={`/dashboard/doctor/visits/${row.original.id}`}>
            {row.original.visit_status === VisitStatusEnum.EXAMINING
              ? "Resume"
              : row.original.visit_status === VisitStatusEnum.COMPLETED
                ? "View Details"
                : "Start Consult"}
          </Link>
        </Button>
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
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          My Queue
        </H2>
        <P className="text-muted-foreground mt-1">
          Manage today&apos;s patient list.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Today&apos;s Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={visits}
            filterKey="visit_status"
            filterOptions={Object.values(VisitStatusEnum).map(s => ({
              label: s,
              value: s,
            }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}
