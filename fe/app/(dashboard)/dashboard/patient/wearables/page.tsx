"use client";

import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { heartRateData, spo2Data, stepsData } from "@/data/mock-data";
import { RefreshCw, Watch } from "lucide-react";

export default function PatientWearablesPage() {
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
        <Button variant="outline" className="w-full gap-2 md:w-auto">
          <RefreshCw className="h-4 w-4" />
          Sync Device
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WearableChart
          title="Heart Rate"
          data={heartRateData}
          dataKey="value"
          color="#ef4444"
          unit=" bpm"
        />
        <WearableChart
          title="Blood Oxygen (SpO2)"
          data={spo2Data}
          dataKey="value"
          color="#3b82f6"
          unit="%"
        />
        <WearableChart
          title="Daily Steps"
          data={stepsData}
          dataKey="value"
          color="#10b981"
          unit=" steps"
        />
        <div className="text-muted-foreground bg-muted/10 flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <Watch className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-semibold">Connect New Device</h3>
          <p className="mb-4 mt-2 max-w-xs text-sm">
            Add a new wearable device to track more health metrics.
          </p>
          <Button variant="secondary">Add Device</Button>
        </div>
      </div>
    </div>
  );
}
