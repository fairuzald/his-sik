"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { getLabOrderApiLabOrdersOrderIdGet } from "@/sdk/output/sdk.gen";
import { LabOrderDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewLabOrderPage() {
  const params = useParams();
  const [order, setOrder] = useState<LabOrderDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      if (typeof params.id === "string") {
        const result = await safeApiCall(
          getLabOrderApiLabOrdersOrderIdGet({
            path: { order_id: params.id },
          })
        );
        if (result) {
          setOrder(result);
        }
      }
      setIsLoading(false);
    };
    fetchOrder();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  // Handle nested result object if it exists (assuming API returns it populated)
  // Or if result fields are flat? SDK types say `result?: LabResultDto`.
  const result = order.result;

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/lab/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Lab Order Details
          </H2>
          <P className="text-muted-foreground text-sm">
            View order information and results.
          </P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="bg-muted/20 border-b pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Order Info</CardTitle>
              <Badge
                variant={
                  order.order_status === "completed" ? "default" : "secondary"
                }
              >
                {order.order_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <span className="text-muted-foreground text-sm">Order ID</span>
              <p className="font-mono font-medium">{order.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Created At</span>
              <p className="font-medium">
                {format(new Date(order.created_at), "PPpp")}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Test Name</span>
              <p className="font-medium">
                {order.lab_test?.test_name || "Unknown"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted/20 border-b pb-3">
            <CardTitle className="text-lg">Patient Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <span className="text-muted-foreground text-sm">Patient ID</span>
              <p className="font-mono font-medium">
                {order.visit?.patient_id || "Unknown"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground text-sm">Visit ID</span>
              <p className="font-mono text-sm">{order.visit_id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="md:col-span-2">
          <CardHeader className="bg-muted/20 border-b pb-3">
            <CardTitle className="text-lg">Results</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground block text-sm">
                      Result Value
                    </span>
                    <span className="text-2xl font-bold">
                      {result.result_value || "-"}
                    </span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      {result.result_unit}
                    </span>
                  </div>
                  {/* Add Status or Flags if available */}
                </div>

                {result.interpretation && (
                  <div>
                    <span className="text-muted-foreground mb-1 block text-sm">
                      Interpretation
                    </span>
                    <p className="bg-muted rounded-md p-3 text-sm">
                      {result.interpretation}
                    </p>
                  </div>
                )}

                {/* Attachment Link if available */}
                {/* if (result.attachment_url) ... */}
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-8">
                <FileText className="mb-2 h-10 w-10 opacity-50" />
                <p>No results recorded yet.</p>
                {order.order_status !== "completed" && (
                  <Button variant="outline" className="mt-4" asChild>
                    <Link href={`/dashboard/lab/orders/${order.id}/edit`}>
                      Enter Results
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
