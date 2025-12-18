"use client";

import { WearableChart } from "@/components/dashboard/WearableChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { listMeasurementsApiWearablesMeasurementsGet } from "@/sdk/output/sdk.gen";
import { WearableMeasurementDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface WearableDataTabProps {
  patientId: string;
}

export function WearableDataTab({ patientId }: WearableDataTabProps) {
  const [measurements, setMeasurements] = useState<WearableMeasurementDto[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const result = await safeApiCall(
      listMeasurementsApiWearablesMeasurementsGet({
        query: { limit: 100, patient_id: patientId },
      })
    );

    if (result) {
      setMeasurements(result);
    }
    setIsLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (measurements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">No Wearable Data Available</h3>
          <p className="text-muted-foreground mt-2">
            This patient hasn't uploaded any wearable measurements yet.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Transform data for charts
  const heartRateData = measurements
    .filter(m => m.heart_rate)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "dd/MM HH:mm") : "",
      value: m.heart_rate || 0,
    }))
    .slice(-20); // Last 20

  const temperatureData = measurements
    .filter(m => m.body_temperature)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "dd/MM HH:mm") : "",
      value: m.body_temperature || 0,
    }))
    .slice(-20);

  const spo2Data = measurements
    .filter(m => m.spo2)
    .map(m => ({
      time: m.recorded_at ? format(new Date(m.recorded_at), "dd/MM HH:mm") : "",
      value: m.spo2 || 0,
    }))
    .slice(-20);

  const latestMeasurement = measurements[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Wearable Health Metrics</h3>
          <p className="text-muted-foreground text-sm">
            Latest:{" "}
            {latestMeasurement?.recorded_at
              ? format(new Date(latestMeasurement.recorded_at), "PPpp")
              : "N/A"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {heartRateData.length > 0 && (
          <WearableChart
            title="Heart Rate"
            data={heartRateData}
            dataKey="value"
            color="#ef4444"
            unit=" bpm"
          />
        )}
        {temperatureData.length > 0 && (
          <WearableChart
            title="Body Temperature"
            data={temperatureData}
            dataKey="value"
            color="#f97316"
            unit=" °C"
          />
        )}
        {spo2Data.length > 0 && (
          <WearableChart
            title="SpO2"
            data={spo2Data}
            dataKey="value"
            color="#3b82f6"
            unit=" %"
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {measurements.slice(0, 5).map(measurement => (
              <div
                key={measurement.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {format(new Date(measurement.recorded_at), "PPpp")}
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  {measurement.heart_rate && (
                    <div className="text-right">
                      <p className="text-muted-foreground">HR</p>
                      <p className="font-semibold">
                        {measurement.heart_rate} bpm
                      </p>
                    </div>
                  )}
                  {measurement.body_temperature && (
                    <div className="text-right">
                      <p className="text-muted-foreground">Temp</p>
                      <p className="font-semibold">
                        {measurement.body_temperature}°C
                      </p>
                    </div>
                  )}
                  {measurement.spo2 && (
                    <div className="text-right">
                      <p className="text-muted-foreground">SpO2</p>
                      <p className="font-semibold">{measurement.spo2}%</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
