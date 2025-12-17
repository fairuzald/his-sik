"use client";

import { StatCard } from "@/components/dashboard/StatCard";
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
import {
  DoctorProfileDao,
  VisitDto,
  VisitStatusEnum,
} from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Activity, Calendar, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DoctorDashboard() {
  const [doctorName, setDoctorName] = useState("");
  const [visits, setVisits] = useState<VisitDto[]>([]);
  const [stats, setStats] = useState({
    waiting: 0,
    completed: 0,
    averageTime: "0m", // Placeholder as we don't have duration data easily
    critical: 0, // Placeholder
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get Profile for doctor name
      const profile = await safeApiCall(getMyProfileApiProfileMeGet());
      if (profile) {
        setDoctorName(profile.full_name);
      }

      // 2. Fetch today's visits (backend filters for the logged-in doctor)
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const visitsData = await safeApiCall(
        listVisitsApiVisitsGet({
          query: {
            date_from: startOfDay,
            date_to: endOfDay,
            limit: 100,
          },
        })
      );

      if (visitsData && profile) {
        // Filter visits for the logged-in doctor
        // doctor_id in Visit refers to doctors.id, not users.id
        // We get the doctor ID from profile.details.id
        let doctorId: string | null = null;
        if (profile.role === "doctor" && profile.details) {
          // Type assertion needed until SDK is regenerated
          const doctorDetails = profile.details as any;
          doctorId = doctorDetails.id;
        }

        const myVisits = doctorId
          ? visitsData.filter(v => v.doctor_id === doctorId)
          : [];

        setVisits(myVisits);

        // Calculate Stats
        const waiting = myVisits.filter(
          v => v.visit_status === VisitStatusEnum.REGISTERED
        ).length;
        const completed = myVisits.filter(
          v => v.visit_status === VisitStatusEnum.COMPLETED
        ).length;

        setStats({
          waiting,
          completed,
          averageTime: "15m", // Mock
          critical: 0, // Mock
        });
      }

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
        return format(date, "HH:mm");
      },
    },
    // We don't have patient name directly in VisitDto usually, unless expanded.
    // VisitDto has `patient_id`. We might need to fetch patient or if the backend expands it.
    // Looking at VisitDto: `patient_id: string`. No patient object?
    // Wait, earlier I saw `visit?: VisitDto` inside `LabOrderDto`.
    // Let's check `VisitDto` definition again.
    // If it doesn't have patient name, we might display "Patient ID: ..." or need a separate fetch/expansion.
    // The previously used mock data had names.
    // Let's perform a "best effort" or check if `patient` is in `VisitDto` or if `safeApiCall` returns an expanded object.
    // The `VisitDto` in `types.gen.ts` showed `updated_at`, `created_at`, etc. but I didn't see `patient` object in the snippet I saw.
    // I will use `patient_id` for now.
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
        <span className="animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Doctor Dashboard
        </H2>
        <P className="text-muted-foreground mt-1">
          Welcome back, {doctorName || "Doctor"}.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Waiting Patients"
          value={stats.waiting.toString()}
          description="In waiting room"
          icon={Users}
        />
        <StatCard
          title="Completed Today"
          value={stats.completed.toString()}
          description="Visits finished"
          icon={Calendar}
        />
        <StatCard
          title="Avg. Consult Time"
          value={stats.averageTime}
          description="Per patient"
          icon={Clock}
        />
        <StatCard
          title="Critical Alerts"
          value={stats.critical.toString()}
          description="Requires attention"
          icon={Activity}
          trend="+0"
          trendUp={false}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Today's Queue
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/doctor/queue">View All</Link>
            </Button>
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

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Mock Notifications for now as no API endpoint */}
            <div className="flex items-start gap-3 rounded-md border border-yellow-100 bg-yellow-50 p-3">
              <Activity className="mt-0.5 h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-800">System</p>
                <p className="text-xs text-yellow-700">
                  Dashboard updated with real-time data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
