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
import { CreditCard, Download, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<InvoiceDto>[] = [
  {
    accessorKey: "id",
    header: "Invoice ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.id.substring(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => (
      <span>
        {row.original.created_at
          ? format(new Date(row.original.created_at), "PP")
          : "-"}
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
    accessorKey: "total_amount",
    header: "Amount",
    cell: ({ row }) =>
      `Rp ${row.original.total_amount?.toLocaleString("id-ID") || 0}`,
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.payment_status === "paid" ? "default" : "destructive"
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
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="ghost" asChild>
          <Link href={`/dashboard/cashier/invoices/${row.original.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Link>
        </Button>
      </div>
    ),
  },
];

export default function CashierInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listInvoicesApiInvoicesGet({
          query: { limit: 100 },
        })
      );

      if (result && Array.isArray(result)) {
        setInvoices(result);
      }
      setIsLoading(false);
    };
    fetchData();
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
            Invoices
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage patient billing and payments.
          </P>
        </div>
        <Button asChild>
          <Link href="/dashboard/cashier/invoices/new">
            <CreditCard className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">All Invoices</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={invoices}
            searchKey="id"
            filterKey="payment_status"
            filterOptions={[
              { label: "Paid", value: "paid" },
              { label: "Unpaid", value: "unpaid" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
