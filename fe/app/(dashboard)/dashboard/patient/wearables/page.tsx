"use client";

import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import {
  addMeasurementApiWearablesDevicesDeviceIdMeasurementsPost,
  listDevicesApiWearablesDevicesGet,
  listMeasurementsApiWearablesDevicesDeviceIdMeasurementsGet,
} from "@/sdk/output/sdk.gen";
import {
  WearableDeviceDto,
  WearableMeasurementDto,
} from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { Loader2, RefreshCw, Watch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PatientWearablesPage() {
  const [device, setDevice] = useState<WearableDeviceDto | null>(null);
  const [measurements, setMeasurements] = useState<WearableMeasurementDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = useCallback(async () => {
    // 1. Get Devices (Assuming single user device for now)
    const devicesList = await safeApiCall(listDevicesApiWearablesDevicesGet());

    if (devicesList && devicesList.length > 0) {
      const firstDevice = devicesList[0];
      setDevice(firstDevice);

      // 2. Get Measurements
      const measurementsList = await safeApiCall(
        listMeasurementsApiWearablesDevicesDeviceIdMeasurementsGet({
          path: { device_id: firstDevice.id },
        })
      );

      if (measurementsList) {
        setMeasurements(measurementsList);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSync = async () => {
    if (!device) return;
    setIsSyncing(true);

    // Simulate syncing/adding a new random heart rate measurement for demo purposes
    // In real app, this would trigger a device sync process
    const fakeHeartRate = Math.floor(Math.random() * (100 - 60 + 1) + 60);

    await safeApiCall(
      addMeasurementApiWearablesDevicesDeviceIdMeasurementsPost({
        path: { device_id: device.id },
        body: {
          heart_rate: fakeHeartRate,
          recorded_at: new Date().toISOString(),
        },
      }),
      {
        successMessage: "Device synced successfully",
        errorMessage: "Sync failed",
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

  const activityData = measurements
    .filter(m => m.steps)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "dd/MM") : "",
      value: m.steps || 0,
    }))
    .slice(-7); // Last 7

  const sleepData: { time: string; value: number }[] = [];
  // Sleep data not available in SDK currently

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Wearable Data
          </H2>
          <P className="text-muted-foreground mt-1">
            Real-time health metrics from your connected devices.
          </P>
        </div>
        <Button
          variant="outline"
          className="w-full gap-2 md:w-auto"
          onClick={handleSync}
          disabled={!device || isSyncing}
        >
          {isSyncing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Sync Device
        </Button>
      </div>

      {!device ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
          <Watch className="text-muted-foreground mb-4 h-10 w-10" />
          <H2 className="text-lg">No Devices Connected</H2>
          <P className="mb-4">Connect a wearable device to start tracking.</P>
          <Button variant="default">Add Device</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <WearableChart
            title="Heart Rate"
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
            title="Activity (Steps)"
            data={
              activityData.length > 0
                ? activityData
                : [{ time: "Today", value: 0 }]
            }
            dataKey="value"
            color="#10b981"
            unit=" steps"
          />
          <WearableChart
            title="Sleep"
            data={
              sleepData.length > 0
                ? sleepData
                : [{ time: "Last Night", value: 0 }]
            }
            dataKey="value"
            color="#6366f1"
            unit=" hrs"
          />
          {/* Can add more or keep 'Connect New' placeholder if multiple devices support intended */}
        </div>
      )}
    </div>
  );
}
