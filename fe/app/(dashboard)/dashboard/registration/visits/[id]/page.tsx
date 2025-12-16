"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { visits } from "@/data/mock-data";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function VisitDetailPage() {
  const params = useParams();
  const visit = visits.find(v => v.id === params.id) || visits[0]; // Fallback for demo

  if (!visit) {
    return <div>Kunjungan tidak ditemukan</div>;
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
            Detail Kunjungan
          </H2>
          <P className="text-muted-foreground">ID: {visit.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Info Janji Temu
              </CardTitle>
              <Badge
                variant={visit.status === "Selesai" ? "default" : "secondary"}
              >
                {visit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Tanggal</Small>
                <P className="font-medium">
                  {visit.visit_datetime.split(" ")[0]}
                </P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Waktu</Small>
                <P className="font-medium">
                  {visit.visit_datetime.split(" ")[1]}
                </P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Stethoscope className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Tipe</Small>
                <P className="font-medium capitalize">
                  {visit.visit_type.replace("_", " ")}
                </P>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-2">
            <CardTitle className="text-lg font-medium">Peserta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Pasien</Small>
                <P className="font-medium">{visit.patient_name}</P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Dokter</Small>
                <P className="font-medium">{visit.doctor_name}</P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Klinik</Small>
                <P className="font-medium">{visit.clinic}</P>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
