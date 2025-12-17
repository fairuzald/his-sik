"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  listClinicsApiClinicsGet,
  listVisitsApiVisitsGet,
} from "@/sdk/output/sdk.gen";
import { ClinicDto, VisitDto, VisitStatusEnum } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatientVisitsPage() {
  const [data, setData] = useState<VisitDto[]>([]);
  const [clinics, setClinics] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch clinics for name mapping
      const clinicsList = await safeApiCall(listClinicsApiClinicsGet(), {
        errorMessage: "Failed to load clinic information",
      });

      if (clinicsList) {
        const clinicMap: Record<string, string> = {};
        clinicsList.forEach((c: ClinicDto) => {
          clinicMap[c.id] = c.name;
        });
        setClinics(clinicMap);
      }

      // Fetch visits
      const visitsList = await safeApiCall(listVisitsApiVisitsGet(), {
        errorMessage: "Failed to load visits",
      });

      if (visitsList) {
        setData(visitsList);
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  const columns: ColumnDef<VisitDto>[] = [
    {
      accessorKey: "visit_datetime",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.visit_datetime
              ? format(new Date(row.original.visit_datetime), "dd MMM yyyy")
              : "-"}
          </span>
          <span className="text-muted-foreground text-xs">
            {row.original.visit_datetime
              ? format(new Date(row.original.visit_datetime), "HH:mm")
              : "-"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "doctor_id", // We might want to fetch doctor names separately or include in DTO.
      // For now, let's assume the API might behave or we just show ID if name not in DTO.
      // Actually VisitDto has no doctor_name field, only doctor_id.
      // ideally we map this too, but for speed let's just label it "Doctor ID" or skip if we cant map.
      // Wait, normally we should have `doctor` object or handle mapping.
      header: "Doctor ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.doctor_id?.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "clinic_id",
      header: "Clinic",
      cell: ({ row }) => (
        <span>{clinics[row.original.clinic_id] || "Unknown Clinic"}</span>
      ),
    },
    {
      accessorKey: "visit_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal capitalize">
          {row.original.visit_type?.replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "visit_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.visit_status;
        let variant: "default" | "secondary" | "destructive" | "outline" =
          "secondary";
        if (status === "completed") variant = "default";
        if (status === "canceled") variant = "destructive";

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="text-right">
          <Button size="sm" variant="outline" asChild>
            <Link href={`/dashboard/patient/visits/${row.original.id}`}>
              Details
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const filterOptions = Object.values(VisitStatusEnum).map(status => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: status,
  }));

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
            My Visits
          </H2>
          <P className="text-muted-foreground mt-1">
            View your visit history and upcoming appointments.
          </P>
        </div>
        <Button className="w-full gap-2 shadow-sm md:w-auto" asChild>
          <Link href="/dashboard/patient/visits/new">
            <Plus className="h-4 w-4" />
            Book New Appointment
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="visit_type" // Search by visit type for now since doctor name isn't readily available
            filterKey="visit_status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
