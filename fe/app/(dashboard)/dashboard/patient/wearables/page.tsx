"use client";

import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import {
  addMeasurementApiWearablesMeasurementsPost,
  listMeasurementsApiWearablesMeasurementsGet,
} from "@/sdk/output/sdk.gen";
import { WearableMeasurementDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { Activity, Loader2, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PatientWearablesPage() {
  const [measurements, setMeasurements] = useState<WearableMeasurementDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = useCallback(async () => {
    const result = await safeApiCall(
      listMeasurementsApiWearablesMeasurementsGet({
        query: { limit: 100 },
      })
    );

    if (result) {
      setMeasurements(result);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMeasurement = async () => {
    setIsSyncing(true);

    // Simulate adding a measurement with random values for demo
    const fakeHeartRate = Math.floor(Math.random() * (100 - 60 + 1) + 60);
    const fakeTemp = (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1);
    const fakeSpo2 = Math.floor(Math.random() * (100 - 95 + 1) + 95);

    await safeApiCall(
      addMeasurementApiWearablesMeasurementsPost({
        body: {
          recorded_at: new Date().toISOString(),
          heart_rate: fakeHeartRate,
          body_temperature: parseFloat(fakeTemp),
          spo2: fakeSpo2,
        },
      }),
      {
        successMessage: "Measurement added successfully",
        errorMessage: "Failed to add measurement",
      }
    );

    await fetchData();
    setIsSyncing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Transform data for charts
  const heartRateData = measurements
    .filter(m => m.heart_rate)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "HH:mm") : "",
      value: m.heart_rate || 0,
    }))
    .slice(-20); // Last 20

  const temperatureData = measurements
    .filter(m => m.body_temperature)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "HH:mm") : "",
      value: m.body_temperature || 0,
    }))
    .slice(-20);

  const spo2Data = measurements
    .filter(m => m.spo2)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "HH:mm") : "",
      value: m.spo2 || 0,
    }))
    .slice(-20);

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Data Wearable
          </H2>
          <P className="text-muted-foreground mt-1">
            Metrik kesehatan real-time dari perangkat Anda.
          </P>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2 md:w-auto"
          onClick={handleAddMeasurement}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Tambah Pengukuran
        </Button>
      </div>

      {measurements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
          <Activity className="text-muted-foreground mb-4 h-10 w-10" />
          <H2 className="text-lg">Belum Ada Data</H2>
          <P className="mb-4">Tambahkan pengukuran pertama Anda.</P>
          <Button variant="default" onClick={handleAddMeasurement}>
            Tambah Pengukuran
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <WearableChart
            title="Detak Jantung"
            data={
              heartRateData.length > 0
                ? heartRateData
                : [{ time: "Now", value: 0 }]
            }
            dataKey="value"
            color="#ef4444"
            unit=" bpm"
          />
          <WearableChart
            title="Suhu Tubuh"
            data={
              temperatureData.length > 0
                ? temperatureData
                : [{ time: "Now", value: 0 }]
            }
            dataKey="value"
            color="#f97316"
            unit=" °C"
          />
          <WearableChart
            title="SpO2"
            data={spo2Data.length > 0 ? spo2Data : [{ time: "Now", value: 0 }]}
            dataKey="value"
            color="#3b82f6"
            unit=" %"
          />
        </div>
      )}
    </div>
  );
}
