"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import {
  getLabOrderApiLabOrdersOrderIdGet,
  getLabTestApiLabTestsTestIdGet,
} from "@/sdk/output/sdk.gen";
import { LabOrderDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Download,
  Loader2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// removed toast import

export default function LabDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [lab, setLab] = useState<LabOrderDto | null>(null);
  const [testName, setTestName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLab = async () => {
      const labData = await safeApiCall(
        getLabOrderApiLabOrdersOrderIdGet({
          path: { order_id: id },
        }),
        {
          errorMessage: "Failed to load lab results",
        }
      );

      if (labData) {
        setLab(labData);

        // Fetch Test Name
        if (labData.lab_test_id) {
          safeApiCall(
            getLabTestApiLabTestsTestIdGet({
              path: { test_id: labData.lab_test_id },
            })
          ).then(res => {
            if (res) setTestName(res.test_name);
          });
        }
      }
      setIsLoading(false);
    };
    if (id) fetchLab();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!lab) return <div>Lab order not found</div>;

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/patient/labs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Lab Result Details
          </H2>
          <P className="text-muted-foreground">ID: {lab.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <Activity className="text-primary h-5 w-5" />
              <CardTitle className="text-primary text-lg">
                {testName || "Unknown Test"}
              </CardTitle>
            </div>
            <Badge variant="outline" className="bg-background capitalize">
              {lab.order_status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/10 rounded-lg p-4">
                <Small className="text-muted-foreground mb-1 block">
                  Result (Text/Value)
                </Small>
                <P className="text-lg font-semibold">
                  {lab.result?.result_value || "-"}
                </P>
              </div>
              <div className="bg-muted/10 rounded-lg p-4">
                <Small className="text-muted-foreground mb-1 block">Unit</Small>
                <P className="text-lg font-semibold">
                  {lab.result?.result_unit || "-"}
                </P>
              </div>
            </div>

            <div className="bg-muted/10 mt-6 rounded-md border p-4">
              <Small className="text-primary font-semibold">
                Interpretation / Notes
              </Small>
              <P className="text-muted-foreground mt-1 text-sm">
                {lab.result?.interpretation ||
                  lab.notes ||
                  "No interpretation provided."}
              </P>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">Test Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Ordered By</Small>
                  <P className="font-mono text-xs font-medium">
                    {lab.doctor_id || "Unknown"}
                  </P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Date Created</Small>
                  <P className="font-medium">
                    {lab.created_at
                      ? format(new Date(lab.created_at), "dd MMM yyyy HH:mm")
                      : "Pending"}
                  </P>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="mt-4 w-full gap-2" variant="outline" disabled>
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}
