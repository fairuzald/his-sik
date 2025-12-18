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
  listInvoicesApiInvoicesGet,
  listMeasurementsApiWearablesMeasurementsGet,
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
  const [patientId, setPatientId] = useState<string>("");
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
      if (!profile) {
        setIsLoading(false);
        return;
      }

      setName(profile.full_name.split(" ")[0]);

      // 2. Fetch Clinics (for mapping names)
      const clinicsData = await safeApiCall(listClinicsApiClinicsGet());
      const clinicMap: Record<string, string> = {};
      if (clinicsData) {
        // Handle both array and wrapped response
        const clinicsList = Array.isArray(clinicsData)
          ? clinicsData
          : (clinicsData as any).data || [];
        clinicsList.forEach((c: ClinicDto) => {
          clinicMap[c.id] = c.name;
        });
        setClinics(clinicMap);
      }

      // 3. Fetch Visits - backend filters by logged-in patient automatically
      const visitsData = await safeApiCall(
        listVisitsApiVisitsGet({
          query: { limit: 100 }
        })
      );
      if (visitsData) {
        const visitsList = Array.isArray(visitsData)
          ? visitsData
          : (visitsData as any).data || [];
        console.log("Visits from API:", visitsList);
        setVisits(visitsList);
      }

      // 4. Fetch Invoices (backend filters automatically)
      const invoicesData = await safeApiCall(
        listInvoicesApiInvoicesGet({
          query: {}
        })
      );
      if (invoicesData) {
        const invoicesList = Array.isArray(invoicesData)
          ? invoicesData
          : (invoicesData as any).data || [];
        setInvoices(invoicesList);
      }

      // 5. Fetch Prescriptions (backend filters automatically)
      const prescriptionsData = await safeApiCall(
        listPrescriptionsApiPrescriptionsGet({
          query: {}
        })
      );
      if (prescriptionsData) {
        const prescriptionsList = Array.isArray(prescriptionsData)
          ? prescriptionsData
          : (prescriptionsData as any).data || [];
        setPrescriptions(prescriptionsList);
      }

      // 6. Fetch Wearables measurements (may fail if table schema not up to date)
      try {
        const measurements = await safeApiCall(
          listMeasurementsApiWearablesMeasurementsGet({
            query: { limit: 10 },
          })
        );
        if (measurements) {
          const measurementsList = Array.isArray(measurements)
            ? measurements
            : (measurements as any).data || [];
          // Transform for chart
          const chartData = measurementsList
            .map((m: WearableMeasurementDto) => ({
              time: m.recorded_at ? format(new Date(m.recorded_at), "HH:mm") : "",
              value: m.heart_rate || 0,
            }))
            .filter((d: { time: string; value: number }) => d.value > 0)
            .slice(-10); // Last 10 points
          setHeartRateData(chartData);
        }
      } catch (error) {
        console.log("Wearable measurements not available:", error);
        // Silently handle error - wearable data is optional
      }

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  // Compute Stats
  const now = new Date();
  console.log("Current time (now):", now);
  console.log("Current time ISO:", now.toISOString());

  // Show ONLY future, non-completed/non-canceled visits
  const upcomingVisits = visits
    .filter(v => {
      console.log("Checking visit:", {
        id: v.id,
        status: v.visit_status,
        datetime: v.visit_datetime,
        datetimeParsed: v.visit_datetime ? new Date(v.visit_datetime) : null,
        isFuture: v.visit_datetime ? new Date(v.visit_datetime) > now : false
      });

      // Only non-completed/non-canceled
      if (v.visit_status === "completed" || v.visit_status === "canceled") {
        console.log("  -> Filtered out: completed or canceled");
        return false;
      }
      // Only future visits
      if (v.visit_datetime) {
        const visitDate = new Date(v.visit_datetime);
        const isFuture = visitDate > now;
        console.log(`  -> Visit date: ${visitDate}, Is future: ${isFuture}`);
        return isFuture;
      }
      console.log("  -> Filtered out: no datetime");
      return false;
    })
    .sort((a, b) => {
      // Sort by datetime
      const dateA = new Date(a.visit_datetime || "").getTime();
      const dateB = new Date(b.visit_datetime || "").getTime();
      return dateA - dateB;
    })
    .slice(0, 3);

  console.log("Final upcoming visits:", upcomingVisits);

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
