"use client";

import { H2, H4, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  deleteVisitApiVisitsVisitIdDelete,
  getClinicApiClinicsClinicIdGet,
  getVisitApiVisitsVisitIdGet,
} from "@/sdk/output/sdk.gen";
import { VisitDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { safeApiCall } from "@/lib/api-handler";

// ...

export default function VisitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [visit, setVisit] = useState<VisitDto | null>(null);
  const [clinicName, setClinicName] = useState<string>("Loading...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      const visitData = await safeApiCall(
        getVisitApiVisitsVisitIdGet({
          path: { visit_id: id },
        }),
        {
          errorMessage: "Failed to load visit details",
        }
      );

      if (visitData) {
        setVisit(visitData);

        // Fetch clinic details
        if (visitData.clinic_id) {
          const clinicData = await safeApiCall(
            getClinicApiClinicsClinicIdGet({
              path: { clinic_id: visitData.clinic_id },
            })
          );

          if (clinicData) {
            setClinicName(clinicData.name);
          }
        }
      }
      setIsLoading(false);
    };

    if (id) {
      fetchVisit();
    }
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    const success = await safeApiCall(
      deleteVisitApiVisitsVisitIdDelete({
        path: { visit_id: id },
      }),
      {
        successMessage: "Appointment canceled",
        errorMessage: "Failed to cancel appointment",
      }
    );

    if (success !== null) {
      router.push("/dashboard/patient/visits");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!visit) {
    return <div>Visit not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/patient/visits">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Visit Details
          </H2>
          <P className="text-muted-foreground">ID: {id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary text-lg">
                Appointment Info
              </CardTitle>
              <Badge
                variant={
                  visit.visit_status === "completed" ? "default" : "secondary"
                }
                className="capitalize"
              >
                {visit.visit_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Date</Small>
                  <P className="font-medium">
                    {visit.visit_datetime
                      ? format(new Date(visit.visit_datetime), "dd MMM yyyy")
                      : "-"}
                  </P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Time</Small>
                  <P className="font-medium">
                    {visit.visit_datetime
                      ? format(new Date(visit.visit_datetime), "HH:mm")
                      : "-"}
                  </P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Doctor ID</Small>
                  <P className="max-w-[150px] truncate font-mono text-sm font-medium">
                    {visit.doctor_id}
                  </P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Clinic</Small>
                  <P className="font-medium">{clinicName}</P>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <H4 className="text-base font-semibold">Chief Complaint</H4>
              <div className="bg-muted/10 text-muted-foreground rounded-md border p-4 text-sm">
                {visit.chief_complaint || "No complaints recorded."}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {/* Reschedule might require a new flow */}
              <Button className="w-full" variant="outline" disabled>
                Reschedule (Unavailable)
              </Button>
              {visit.visit_status === "registered" && (
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={handleCancel}
                >
                  Cancel Appointment
                </Button>
              )}
              <Button className="w-full" variant="secondary" disabled>
                Download Summary
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
