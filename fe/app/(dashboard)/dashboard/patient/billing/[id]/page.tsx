"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { InvoiceItem, invoices } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowLeft, Calendar, CreditCard, Download } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const columns: ColumnDef<InvoiceItem>[] = [
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "subtotal",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => (
      <div className="text-right">
        Rp {row.original.subtotal.toLocaleString("id-ID")}
      </div>
    ),
  },
];

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoice = invoices.find(i => i.id === params.id) || invoices[0]; // Fallback

  if (!invoice) return <div>Invoice not found</div>;

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/patient/billing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Invoice Details
          </H2>
          <P className="text-muted-foreground">ID: {invoice.invoice_number}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <div className="space-y-1">
              <CardTitle className="text-primary text-lg">
                Invoice Summary
              </CardTitle>
            </div>
            <Badge
              variant={invoice.status === "Paid" ? "default" : "destructive"}
              className={
                invoice.status === "Paid"
                  ? "bg-green-500 hover:bg-green-600"
                  : ""
              }
            >
              {invoice.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <DataTable
              columns={columns}
              data={invoice.items}
              searchKey="description"
            />
            <div className="mt-4 flex justify-between border-t pt-4 font-bold">
              <span>Total</span>
              <span className="text-primary text-lg">
                Rp {invoice.total_amount.toLocaleString("id-ID")}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Payment Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Invoice Date</Small>
                  <P className="font-medium">{invoice.invoice_datetime}</P>
                </div>
              </div>

              {invoice.status === "Unpaid" ? (
                <Button className="mt-4 w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </Button>
              ) : (
                <div className="rounded-md border border-green-200 bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                  Payment Received
                </div>
              )}

              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
