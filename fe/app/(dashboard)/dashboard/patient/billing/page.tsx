"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listInvoicesApiInvoicesGet } from "@/sdk/output/sdk.gen";
import { InvoiceDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PatientBillingPage() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    const result = await safeApiCall(
      listInvoicesApiInvoicesGet({ query: { limit: 100 } })
    );
    if (result) {
      const invoicesList = Array.isArray(result)
        ? result
        : (result as any).data || [];
      setInvoices(invoicesList);
    }
    setIsLoading(false);
  };

  const columns: ColumnDef<InvoiceDto>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) =>
        format(new Date(row.original.created_at), "dd MMM yyyy"),
    },
    {
      accessorKey: "visit_id",
      header: "Visit",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.visit_id.substring(0, 8)}...
        </span>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => (
        <span className="font-semibold">
          Rp {row.original.total_amount.toLocaleString("id-ID")}
        </span>
      ),
    },
    {
      accessorKey: "amount_paid",
      header: "Amount Paid",
      cell: ({ row }) => (
        <span>Rp {row.original.amount_paid.toLocaleString("id-ID")}</span>
      ),
    },
    {
      accessorKey: "payment_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.payment_status;
        return (
          <Badge
            variant={status === "paid" ? "default" : "secondary"}
            className={
              status === "paid"
                ? "bg-green-500"
                : status === "unpaid"
                  ? "bg-red-500"
                  : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" asChild title="View Details">
          <Link href={`/dashboard/patient/billing/${row.original.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          My Billing
        </H2>
        <P className="text-muted-foreground mt-1">
          View your medical invoices and payment history
        </P>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        searchKey="visit_id"
        searchPlaceholder="Search by visit ID..."
        filterKey="payment_status"
        filterOptions={[
          { label: "Unpaid", value: "unpaid" },
          { label: "Paid", value: "paid" },
          { label: "Canceled", value: "canceled" },
        ]}
      />
    </div>
  );
}
