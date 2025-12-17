"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, H4, P, Small } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import {
  getMyProfileApiProfileMeGet,
  listClinicsApiClinicsGet,
  listDevicesApiWearablesDevicesGet,
  listInvoicesApiInvoicesGet,
  listMeasurementsApiWearablesDevicesDeviceIdMeasurementsGet,
  listPrescriptionsApiPrescriptionsGet,
  listVisitsApiVisitsGet,
} from "@/sdk/output/sdk.gen";
import {
  ClinicDto,
  InvoiceDto,
  PrescriptionDto,
  VisitDto,
  WearableMeasurementDto,
} from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { Activity, Calendar, CreditCard, Loader2, Pill } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const [name, setName] = useState("");
  const [visits, setVisits] = useState<VisitDto[]>([]);
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [clinics, setClinics] = useState<Record<string, string>>({});
  const [heartRateData, setHeartRateData] = useState<
    { time: string; value: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      // 1. Fetch Profile
      const profile = await safeApiCall(getMyProfileApiProfileMeGet());
      if (profile) {
        setName(profile.full_name.split(" ")[0]);
      }

      // 2. Fetch Clinics (for mapping names)
      const clinicsData = await safeApiCall(listClinicsApiClinicsGet());
      const clinicMap: Record<string, string> = {};
      if (clinicsData) {
        clinicsData.forEach((c: ClinicDto) => {
          clinicMap[c.id] = c.name;
        });
        setClinics(clinicMap);
      }

      // 3. Fetch Visits
      const visitsData = await safeApiCall(listVisitsApiVisitsGet());
      if (visitsData) {
        setVisits(visitsData);
      }

      // 4. Fetch Invoices
      const invoicesData = await safeApiCall(listInvoicesApiInvoicesGet());
      if (invoicesData) {
        setInvoices(invoicesData);
      }

      // 5. Fetch Prescriptions
      const prescriptionsData = await safeApiCall(
        listPrescriptionsApiPrescriptionsGet()
      );
      if (prescriptionsData) {
        setPrescriptions(prescriptionsData);
      }

      // 6. Fetch Wearables (Try to get first device and its measurements)
      const devices = await safeApiCall(listDevicesApiWearablesDevicesGet());
      if (devices && devices.length > 0) {
        const firstDevice = devices[0];
        const measurements = await safeApiCall(
          listMeasurementsApiWearablesDevicesDeviceIdMeasurementsGet({
            path: { device_id: firstDevice.id },
          })
        );
        if (measurements) {
          // Transform for chart
          const chartData = measurements
            .map((m: WearableMeasurementDto) => ({
              time: m.recorded_at
                ? format(new Date(m.recorded_at), "HH:mm")
                : "",
              value: m.heart_rate || 0,
            }))
            .filter(d => d.value > 0)
            .slice(-10); // Last 10 points
          setHeartRateData(chartData);
        }
      }

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  // Compute Stats
  const upcomingVisits = visits
    .filter(
      v => v.visit_status !== "canceled" && v.visit_status !== "completed"
    )
    // Ideally filter by date > now, but assuming 'registered' or 'scheduled' for now.
    // The API `VisitStatusEnum` has 'registered', 'examining', 'completed', 'canceled'.
    // Assuming 'registered' is upcoming.
    .sort(
      (a, b) =>
        new Date(a.visit_datetime || "").getTime() -
        new Date(b.visit_datetime || "").getTime()
    )
    .slice(0, 3);

  const activePrescriptionsCount = prescriptions.filter(
    p =>
      p.prescription_status === "pending" ||
      p.prescription_status === "processing"
  ).length;

  const unpaidInvoicesBalance = invoices
    .filter(
      i => i.payment_status === "unpaid" || i.payment_status === "pending"
    )
    .reduce((sum, i) => sum + (i.total_amount - i.amount_paid), 0);

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
            Good Morning, {name || "Patient"}
          </H2>
          <P className="text-muted-foreground mt-1">
            Here is your health summary for today.
          </P>
        </div>
        <Button
          className="w-full shadow-md transition-all hover:shadow-lg md:w-auto"
          asChild
        >
          <Link href="/dashboard/patient/visits/new">Book Appointment</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Visits"
          value={upcomingVisits.length.toString()}
          description={
            upcomingVisits[0]
              ? `Next: ${format(new Date(upcomingVisits[0].visit_datetime || new Date()), "dd MMMM")}`
              : "No upcoming visits"
          }
          icon={Calendar}
        />
        <StatCard
          title="Active Prescriptions"
          value={activePrescriptionsCount.toString()}
          description="Prescriptions being processed"
          icon={Pill}
        />
        <StatCard
          title="Unpaid Balance"
          value={`Rp ${unpaidInvoicesBalance.toLocaleString("id-ID")}`}
          description={unpaidInvoicesBalance > 0 ? "Payment required" : "Paid"}
          icon={CreditCard}
          trend={unpaidInvoicesBalance > 0 ? "Unpaid" : "Paid"}
          trendUp={unpaidInvoicesBalance === 0}
        />
        <StatCard
          title="Health Score"
          value="92"
          description="Excellent condition"
          icon={Activity}
          trend="+2.5%"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 space-y-6">
          <WearableChart
            title="Heart Rate Monitor"
            data={
              heartRateData.length > 0
                ? heartRateData
                : [{ time: "Now", value: 0 }]
            }
            dataKey="value"
            color="#ef4444"
            unit=" bpm"
          />
          {/* BP Chart omitted for brevity/lack of split data in generic measurement object for now, or could duplicate logic */}
        </div>
        <Card className="col-span-3 h-fit shadow-sm">
          <CardHeader>
            <CardTitle className="text-primary text-xl">
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingVisits.length === 0 && (
                <P className="text-muted-foreground text-sm">
                  No upcoming appointments.
                </P>
              )}
              {upcomingVisits.map((apt, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <H4 className="text-base font-semibold leading-none">
                      {clinics[apt.clinic_id] || "Clinic"}
                    </H4>
                    <Small className="text-muted-foreground block">
                      {apt.visit_type}
                    </Small>
                    <Small className="text-muted-foreground block">
                      {apt.chief_complaint || "-"}
                    </Small>
                  </div>
                  <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                    {apt.visit_datetime
                      ? format(new Date(apt.visit_datetime), "dd MMM HH:mm")
                      : "-"}
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
