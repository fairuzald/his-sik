"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, H4, P, Small } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { bpData, heartRateData, visits } from "@/data/mock-data";
import { Activity, Calendar, CreditCard, Pill } from "lucide-react";
import Link from "next/link";

export default function PatientDashboard() {
  const upcomingVisits = visits
    .filter(v => v.status === "Scheduled")
    .slice(0, 3);

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Selamat Pagi, John
          </H2>
          <P className="text-muted-foreground mt-1">
            Berikut ringkasan kesehatan Anda hari ini.
          </P>
        </div>
        <Button
          className="w-full shadow-md transition-all hover:shadow-lg md:w-auto"
          asChild
        >
          <Link href="/dashboard/patient/visits/new">Buat Janji Temu</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Kunjungan Mendatang"
          value={upcomingVisits.length.toString()}
          description={
            upcomingVisits[0]
              ? `Berikutnya: ${upcomingVisits[0].doctor_name}`
              : "Tidak ada kunjungan mendatang"
          }
          icon={Calendar}
        />
        <StatCard
          title="Resep Aktif"
          value="3"
          description="2 isi ulang tersisa"
          icon={Pill}
        />
        <StatCard
          title="Tagihan Belum Dibayar"
          value="Rp 1.500.000"
          description="Jatuh tempo dalam 3 hari"
          icon={CreditCard}
          trend="Unpaid"
          trendUp={false}
        />
        <StatCard
          title="Skor Kesehatan"
          value="92"
          description="Kondisi sangat baik"
          icon={Activity}
          trend="+2.5%"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <WearableChart
            title="Monitor Detak Jantung"
            data={heartRateData}
            dataKey="value"
            color="#ef4444"
            unit=" bpm"
          />
          <WearableChart
            title="Tren Tekanan Darah"
            data={bpData}
            dataKey="value"
            color="#0ea5e9"
            unit=" mmHg"
          />
        </div>
        <Card className="col-span-3 h-fit shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary text-xl">
              Janji Temu Mendatang
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingVisits.map((apt, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <H4 className="text-base font-semibold leading-none">
                      {apt.doctor_name}
                    </H4>
                    <Small className="text-muted-foreground block">
                      {apt.clinic}
                    </Small>
                    <Small className="text-muted-foreground block">
                      {apt.visit_type}
                    </Small>
                  </div>
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                    {apt.visit_datetime.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
