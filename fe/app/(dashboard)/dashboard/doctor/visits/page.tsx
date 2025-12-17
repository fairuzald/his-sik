"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  getMyProfileApiProfileMeGet,
  listVisitsApiVisitsGet,
} from "@/sdk/output/sdk.gen";
import { VisitDto, VisitStatusEnum } from "@/sdk/output/types.gen";
import { Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { columns } from "./columns";

export default function DoctorVisitsPage() {
  const [data, setData] = useState<VisitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get profile to get doctor ID
      const profile = await safeApiCall(getMyProfileApiProfileMeGet());

      const result = await safeApiCall(
        listVisitsApiVisitsGet({
          query: {
            limit: 100,
          },
        })
      );

      if (result && profile) {
        // Filter visits for the logged-in doctor
        let doctorId: string | null = null;
        if (profile.role === "doctor" && profile.details) {
          const doctorDetails = profile.details as any;
          doctorId = doctorDetails.id;
        }

        const myVisits = doctorId
          ? result.filter(v => v.doctor_id === doctorId)
          : [];

        setData(myVisits);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const filterOptions = Object.values(VisitStatusEnum).map(s => ({
    label: s,
    value: s,
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
            Visits History
          </H2>
          <P className="text-muted-foreground mt-1">
            View past consultations and medical records.
          </P>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="patient_id"
            filterKey="visit_status"
            filterOptions={filterOptions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
