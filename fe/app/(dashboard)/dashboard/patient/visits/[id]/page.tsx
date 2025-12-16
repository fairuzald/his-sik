"use client";

import { H2, H4, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { visits } from "@/data/mock-data";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function VisitDetailPage() {
  const params = useParams();
  // In a real app, fetch based on params.id
  const visit = visits[0];

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
            Detail Kunjungan
          </H2>
          <P className="text-muted-foreground">ID: {params.id || visit.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-primary text-lg">
                Informasi Janji Temu
              </CardTitle>
              <Badge
                variant={visit.status === "Completed" ? "default" : "secondary"}
              >
                {visit.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            </div>

            <div className="space-y-2">
              <H4 className="text-base font-semibold">Catatan Kunjungan</H4>
              <div className="bg-muted/10 text-muted-foreground rounded-md border p-4 text-sm">
                Pasien datang dengan gejala ringan. Pemeriksaan rutin selesai
                dengan sukses. Tanda-tanda vital stabil. Disarankan tindak
                lanjut dalam 6 bulan.
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <Button className="w-full" variant="outline">
                Jadwal Ulang
              </Button>
              <Button className="w-full" variant="destructive">
                Batalkan Janji Temu
              </Button>
              <Button className="w-full" variant="secondary">
                Unduh Ringkasan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
