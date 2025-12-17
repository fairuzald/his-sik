"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { getVisitApiVisitsVisitIdGet } from "@/sdk/output/sdk.gen";
import { VisitDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VisitDetailPage() {
  const params = useParams();
  const [visit, setVisit] = useState<VisitDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVisit = async () => {
      setIsLoading(true);
      if (typeof params.id === "string") {
        const result = await safeApiCall(
          getVisitApiVisitsVisitIdGet({
            path: { visit_id: params.id },
          })
        );
        if (result) {
          setVisit(result);
        }
      }
      setIsLoading(false);
    };
    fetchVisit();
  }, [params.id]);

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
          <Link href="/dashboard/registration/visits">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Visit Details
          </H2>
          <P className="text-muted-foreground">ID: {visit.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Appointment Info
              </CardTitle>
              <Badge
                variant={
                  visit.visit_status === "completed" ? "default" : "secondary"
                }
              >
                {visit.visit_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Date</Small>
                <P className="font-medium">
                  {visit.visit_datetime
                    ? format(new Date(visit.visit_datetime), "PP")
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
                    ? format(new Date(visit.visit_datetime), "p")
                    : "-"}
                </P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Stethoscope className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Type</Small>
                <P className="font-medium capitalize">
                  {visit.visit_type?.replace(/_/g, " ")}
                </P>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-2">
            <CardTitle className="text-lg font-medium">Participants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Patient</Small>
                <P className="font-medium">
                  {visit.patient_id.substring(0, 8)}...
                </P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Doctor</Small>
                <P className="font-medium">
                  {visit.doctor_id.substring(0, 8)}...
                </P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Clinic</Small>
                <P className="font-medium">
                  {visit.clinic_id.substring(0, 8)}...
                </P>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
