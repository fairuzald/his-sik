"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listInvoicesApiInvoicesGet } from "@/sdk/output/sdk.gen";
import { InvoiceDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<InvoiceDto>[] = [
  {
    accessorKey: "id",
    header: "Payment ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.substring(0, 8)}...
      </span>
    ),
  },
  {
    header: "Invoice",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.substring(0, 8)}...
      </span>
    ),
  },
  {
    header: "Patient",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {row.original.visit?.patient_id
          ? row.original.visit.patient_id.substring(0, 8) + "..."
          : "Unknown"}
      </span>
    ),
  },
  {
    accessorKey: "amount_paid",
    header: "Amount",
    cell: ({ row }) =>
      `Rp ${row.original.amount_paid?.toLocaleString("id-ID") || 0}`,
  },
  {
    accessorKey: "payment_method",
    header: "Method",
    cell: ({ row }) => row.original.payment_method || "N/A",
  },
  {
    accessorKey: "updated_at",
    header: "Date",
    cell: ({ row }) => (
      <span>
        {row.original.updated_at
          ? format(new Date(row.original.updated_at), "PP")
          : "-"}
      </span>
    ),
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.payment_status === "paid" ? "default" : "secondary"
        }
        className={row.original.payment_status === "paid" ? "bg-green-500" : ""}
      >
        {row.original.payment_status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" asChild>
        <Link href={`/dashboard/cashier/invoices/${row.original.id}`}>
          View Receipt
        </Link>
      </Button>
    ),
  },
];

export default function CashierPaymentsPage() {
  const [payments, setPayments] = useState<InvoiceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listInvoicesApiInvoicesGet({ query: { limit: 100 } })
      );

      if (result && Array.isArray(result)) {
        // Filter to show only paid invoices as "payments"
        setPayments(result.filter(inv => inv.payment_status === "paid"));
      }
      setIsLoading(false);
    };
    fetchPayments();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Payments
          </H2>
          <P className="text-muted-foreground mt-1">
            View payment history and receipts.
          </P>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={payments}
            searchKey="id"
            filterKey="payment_method"
            filterOptions={[
              { label: "Cash", value: "cash" },
              { label: "Card", value: "card" },
              { label: "QRIS", value: "qris" },
              { label: "Insurance", value: "insurance" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
