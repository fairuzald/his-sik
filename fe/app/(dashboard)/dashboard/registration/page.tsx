"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  listUsersApiUsersGet,
  listVisitsApiVisitsGet,
} from "@/sdk/output/sdk.gen";
import { VisitDto, VisitStatusEnum } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Calendar, Clock, Loader2, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RegistrationDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    newRegistrations: 0, // Cannot accurately compute without created_at in UserDao
    activeVisits: 0,
    avgWaitTime: "0m", // Placeholder
  });
  const [recentVisits, setRecentVisits] = useState<VisitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Total Patients
      const patientsResponse = await safeApiCall(
        listUsersApiUsersGet({
          query: {
            roles: "patient",
            limit: 1000,
          },
        })
      );
      const totalPatients = patientsResponse?.length || 0;

      // 2. Fetch Today's Visits
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const visitsResponse = await safeApiCall(
        listVisitsApiVisitsGet({
          query: {
            date_from: startOfDay,
            date_to: endOfDay,
            limit: 100,
          },
        })
      );

      const visits = visitsResponse || [];
      const activeVisits = visits.filter(
        v =>
          v.visit_status !== VisitStatusEnum.COMPLETED &&
          v.visit_status !== VisitStatusEnum.CANCELED
      ).length;

      setStats({
        totalPatients,
        newRegistrations: 0, // Data limitation
        activeVisits,
        avgWaitTime: "15m", // Mock
      });

      setRecentVisits(visits.slice(0, 5)); // Show top 5 recent from today
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const columns: ColumnDef<VisitDto>[] = [
    {
      accessorKey: "visit_datetime",
      header: "Time",
      cell: ({ row }) => {
        const date = new Date(row.original.visit_datetime || "");
        return (
          <span className="text-muted-foreground font-mono">
            {format(date, "HH:mm")}
          </span>
        );
      },
    },
    {
      accessorKey: "patient_id",
      header: "Patient ID",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.patient_id.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "visit_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal capitalize">
          {row.original.visit_type?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "visit_status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-normal">
          {row.original.visit_status}
        </Badge>
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
            Registration Dashboard
          </H2>
          <P className="text-muted-foreground mt-1">
            Summary of today&apos;s registration activity.
          </P>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2 shadow-sm" variant="outline" asChild>
            <Link href="/dashboard/registration/visits/new">
              <Calendar className="h-4 w-4" />
              New Visit
            </Link>
          </Button>
          <Button className="gap-2 shadow-sm" asChild>
            <Link href="/dashboard/registration/patients/new">
              <UserPlus className="h-4 w-4" />
              New Patient
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients.toString()}
          description="Registered in system"
          icon={Users}
        />
        <StatCard
          title="New Registrations"
          value={stats.newRegistrations.toString()}
          description="New profiles today (N/A)"
          icon={UserPlus}
        />
        <StatCard
          title="Active Visits"
          value={stats.activeVisits.toString()}
          description="Currently in clinic"
          icon={Calendar}
        />
        <StatCard
          title="Avg. Wait Time"
          value={stats.avgWaitTime}
          description="Registration queue"
          icon={Clock}
          trend="-2m"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Recent Activity (Today&apos;s Visits)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable columns={columns} data={recentVisits} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
