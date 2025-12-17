"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { safeApiCall } from "@/lib/api-handler";
import { getInvoiceApiInvoicesInvoiceIdGet } from "@/sdk/output/sdk.gen";
import { InvoiceDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { ArrowLeft, Download, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [invoice, setInvoice] = useState<InvoiceDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        getInvoiceApiInvoicesInvoiceIdGet({ path: { invoice_id: id } })
      );
      if (result) {
        setInvoice(result);
      }
      setIsLoading(false);
    };
    fetchInvoice();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div className="p-8 text-center">Receipt not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/cashier/payments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Payment Receipt
            </H2>
            <P className="text-muted-foreground">{id.substring(0, 8)}...</P>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b text-center">
            <CardTitle className="text-primary text-xl">
              MediCare Clinic
            </CardTitle>
            <P className="text-muted-foreground text-sm">
              123 Health Street, Medical District
            </P>
            <P className="text-muted-foreground text-sm">
              Phone: (021) 555-0123
            </P>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Small className="text-muted-foreground">Billed To</Small>
                <p className="font-medium">
                  {invoice.visit?.patient_id
                    ? `Patient: ${invoice.visit.patient_id.substring(0, 8)}...`
                    : "Unknown Patient"}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <Small className="text-muted-foreground">Payment Details</Small>
                <p className="text-sm">
                  <span className="text-muted-foreground">Date:</span>{" "}
                  {invoice.updated_at
                    ? format(new Date(invoice.updated_at), "PPp")
                    : "-"}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Method:</span>{" "}
                  {invoice.payment_method || "N/A"}
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 border-green-200 bg-green-50 text-green-700"
                >
                  {invoice.payment_status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm font-medium text-gray-500">
                <div className="col-span-8">Description</div>
                <div className="col-span-4 text-right">Amount</div>
              </div>
              {invoice.items && invoice.items.length > 0 ? (
                invoice.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="grid grid-cols-12 text-sm"
                  >
                    <div className="col-span-8">{item.description}</div>
                    <div className="col-span-4 text-right">
                      Rp {item.subtotal?.toLocaleString("id-ID") || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground text-center text-sm">
                  No itemized details available
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">
                  Rp {invoice.amount_paid?.toLocaleString("id-ID") || 0}
                </span>
              </div>
            </div>

            <div className="pt-8 text-center">
              <P className="text-muted-foreground text-sm">
                Thank you for choosing MediCare.
              </P>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
