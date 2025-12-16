"use client";

import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { heartRateData, spo2Data } from "@/data/mock-data";
import {
  Activity,
  ArrowLeft,
  FileText,
  FlaskConical,
  Pill,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DoctorVisitDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/doctor">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Konsultasi: Alice Johnson
            </H2>
            <div className="mt-1 flex items-center gap-2">
              <P className="text-muted-foreground">ID: {params.id}</P>
              <Badge>Sedang Berlangsung</Badge>
              <Badge variant="outline">Perempuan, 32th</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Lihat Riwayat</Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Selesaikan Konsultasi
          </Button>
        </div>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="record" className="gap-2">
            <FileText className="h-4 w-4" />
            Rekam Medis
          </TabsTrigger>
          <TabsTrigger value="prescription" className="gap-2">
            <Pill className="h-4 w-4" />
            Resep
          </TabsTrigger>
          <TabsTrigger value="labs" className="gap-2">
            <FlaskConical className="h-4 w-4" />
            Pesanan Lab
          </TabsTrigger>
          <TabsTrigger value="wearables" className="gap-2">
            <Activity className="h-4 w-4" />
            Data Wearable
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Catatan Klinis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="complaint">Keluhan Utama</Label>
                <Textarea
                  id="complaint"
                  placeholder="Keluhan utama pasien..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input id="diagnosis" placeholder="ICD-10 atau deskripsi" />
                </div>
                <div className="space-y-2">
                  <Label>Tanda Vital</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input placeholder="BP (mmHg)" />
                    <Input placeholder="HR (bpm)" />
                    <Input placeholder="Temp (°C)" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Pemeriksaan</Label>
                <Textarea
                  id="notes"
                  placeholder="Temuan pemeriksaan terperinci..."
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Rencana Perawatan</Label>
                <Textarea id="plan" placeholder="Rencana tindakan..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescription">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
              <CardTitle className="text-primary text-lg">e-Resep</CardTitle>
              <Button size="sm" variant="secondary">
                Tambah Obat
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="bg-muted/5 grid grid-cols-12 items-end gap-4 rounded-md border p-4">
                <div className="col-span-4 space-y-2">
                  <Label>Nama Obat</Label>
                  <Input placeholder="Cari obat..." />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Dosis</Label>
                  <Input placeholder="e.g. 500mg" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Jml</Label>
                  <Input type="number" placeholder="10" />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label>Instruksi</Label>
                  <Input placeholder="cth. 3x1 sesudah makan" />
                </div>
                <div className="col-span-1">
                  <Button variant="destructive" size="icon" className="w-full">
                    <span className="sr-only">Hapus</span>
                    &times;
                  </Button>
                </div>
              </div>
              {/* More items would go here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Pesanan Lab
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Hitung Darah Lengkap",
                  "Profil Lipid",
                  "Tes Fungsi Hati",
                  "Tes Fungsi Ginjal",
                  "Glukosa Darah",
                  "Urinalisis",
                ].map(test => (
                  <div
                    key={test}
                    className="hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded-md border p-3"
                  >
                    <Input type="checkbox" id={test} className="h-4 w-4" />
                    <Label htmlFor={test} className="flex-1 cursor-pointer">
                      {test}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Label htmlFor="labNotes">Catatan Klinis untuk Lab</Label>
                <Textarea
                  id="labNotes"
                  placeholder="Alasan tes, instruksi khusus..."
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wearables">
          <div className="grid gap-6 md:grid-cols-2">
            <WearableChart
              title="Detak Jantung (24j Terakhir)"
              data={heartRateData}
              dataKey="value"
              color="#ef4444"
              unit=" bpm"
            />
            <WearableChart
              title="SpO2 (24j Terakhir)"
              data={spo2Data}
              dataKey="value"
              color="#3b82f6"
              unit="%"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
