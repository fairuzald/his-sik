"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { getLabTestApiLabTestsTestIdGet } from "@/sdk/output/sdk.gen";
import { LabTestDto } from "@/sdk/output/types.gen";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LabTestDetailPage() {
  const params = useParams();
  const [test, setTest] = useState<LabTestDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      if (typeof params.id === "string") {
        setIsLoading(true);
        const result = await safeApiCall(
          getLabTestApiLabTestsTestIdGet({
            path: { test_id: params.id },
          })
        );
        if (result) {
          setTest(result);
        }
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Lab test not found</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/lab/tests">Back to Tests</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/lab/tests">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Lab Test Details
            </H2>
            <P className="text-muted-foreground">
              View laboratory test information
            </P>
          </div>
        </div>
        <Button variant="outline" className="gap-2" asChild>
          <Link href={`/dashboard/lab/tests/${params.id}/edit`}>
            <Edit className="h-4 w-4" />
            Edit Test
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">
              Test Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Test Code
              </p>
              <p className="font-mono text-lg font-bold">{test.test_code}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Test Name
              </p>
              <p className="text-lg font-semibold">{test.test_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Category
              </p>
              <Badge variant="secondary" className="text-sm">
                {test.category || "-"}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Status
              </p>
              <Badge
                variant={test.is_active ? "default" : "secondary"}
                className={test.is_active ? "bg-green-500" : ""}
              >
                {test.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">
              Test Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Price</p>
              <p className="text-xl font-bold text-green-600">
                {typeof test.price === "number"
                  ? `Rp ${test.price.toLocaleString("id-ID")}`
                  : "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">Unit</p>
              <p className="font-medium">{test.unit || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">
                Reference Range
              </p>
              <p className="font-medium">{test.reference_range || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
