"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { safeApiCall } from "@/lib/api-handler";
import {
  getInvoiceApiInvoicesInvoiceIdGet,
  updateInvoiceApiInvoicesInvoiceIdPatch,
} from "@/sdk/output/sdk.gen";
import { InvoiceDto } from "@/sdk/output/types.gen";
import { ArrowLeft, CreditCard, Loader2, Printer } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CashierInvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const router = useRouter();

  const [invoice, setInvoice] = useState<InvoiceDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amountPaid, setAmountPaid] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        getInvoiceApiInvoicesInvoiceIdGet({
          path: { invoice_id: invoiceId },
        })
      );
      if (result) {
        setInvoice(result); // safeApiCall returns data directly
        setAmountPaid((result.total_amount || 0).toString());
      }
      setIsLoading(false);
    };
    fetchInvoice();
  }, [invoiceId]);

  const handlePayment = async () => {
    if (!invoice) return;
    setIsProcessing(true);

    const paidAmountNum = parseFloat(amountPaid);
    // Simple logic: if paid >= total, status = paid.
    // Ideally backend handles this logic or we send specific status.
    const isPaid = paidAmountNum >= (invoice.total_amount || 0);
    const status = isPaid ? "paid" : "partial"; // Assuming 'partial' exists or 'unpaid'

    const result = await safeApiCall(
      updateInvoiceApiInvoicesInvoiceIdPatch({
        path: { invoice_id: invoiceId },
        body: {
          payment_method: paymentMethod,
          amount_paid: paidAmountNum,
          payment_status: status,
        },
      }),
      { successMessage: "Payment processed successfully!" }
    );

    if (result) {
      router.push("/dashboard/cashier/invoices");
    }
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/cashier/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Process Payment
          </H2>
          <P className="text-muted-foreground">Invoice ID: {invoiceId}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">
              Invoice Items
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Items might not be fully populated in InvoiceDto if they are nested separately, checking structure */}
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        Rp {item.unit_price?.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-muted-foreground text-center"
                    >
                      No details available (Summary only)
                    </TableCell>
                  </TableRow>
                )}

                <TableRow className="bg-muted/5 border-t-2 font-bold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-primary text-right text-xl">
                    Rp {invoice.total_amount?.toLocaleString("id-ID")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  disabled={invoice.payment_status === "paid"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount Paid</Label>
                <Input
                  placeholder="Rp 0"
                  type="number"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  disabled={invoice.payment_status === "paid"}
                />
              </div>

              <div className="space-y-3 border-t pt-4">
                {invoice.payment_status !== "paid" ? (
                  <Button
                    className="w-full gap-2"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    Confirm Payment
                  </Button>
                ) : (
                  <div className="rounded bg-green-100 p-2 text-center font-bold text-green-700">
                    Paid
                  </div>
                )}

                <Button variant="outline" className="w-full gap-2">
                  <Printer className="h-4 w-4" />
                  Print Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
