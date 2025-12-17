"use client";

import { StatCard } from "@/components/dashboard/StatCard";
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
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  Plus,
} from "lucide-react";
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
        {row.original.payment_status !== "paid" && (
          <Button size="sm" className="gap-2" asChild>
            <Link href={`/dashboard/cashier/invoices/${row.original.id}`}>
              <CreditCard className="h-3 w-3" />
              Pay
            </Link>
          </Button>
        )}
        {row.original.payment_status === "paid" && (
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/cashier/invoices/${row.original.id}`}>
              View Receipt
            </Link>
          </Button>
        )}
      </div>
    ),
  },
];

export default function CashierDashboard() {
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [stats, setStats] = useState({
    revenueToday: 0,
    pendingCount: 0,
    issuedToday: 0,
  });
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
        setInvoices(result.slice(0, 5));

        const today = new Date().toDateString();
        const todayInvoices = result.filter(
          inv =>
            inv.created_at && new Date(inv.created_at).toDateString() === today
        );

        const revenue = todayInvoices
          .filter(inv => inv.payment_status === "paid")
          .reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

        setStats({
          revenueToday: revenue,
          pendingCount: result.filter(inv => inv.payment_status !== "paid")
            .length,
          issuedToday: todayInvoices.length,
        });
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
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Cashier Dashboard
        </H2>
        <P className="text-muted-foreground mt-1">
          Process payments and manage invoices.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={`Rp ${stats.revenueToday.toLocaleString("id-ID")}`}
          description="Collected today"
          icon={DollarSign}
          trend="+0%"
          trendUp={true}
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingCount.toString()}
          description="Unpaid invoices"
          icon={AlertCircle}
        />
        <StatCard
          title="Invoices Issued"
          value={stats.issuedToday.toString()}
          description="Today"
          icon={FileText}
        />
        <StatCard
          title="Insurance Claims"
          value="0"
          description="Pending approval (Mock)"
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">
              Recent Invoices
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/cashier/invoices">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable
              columns={columns}
              data={invoices}
              filterKey="payment_status"
              filterOptions={[
                { label: "Paid", value: "paid" },
                { label: "Unpaid", value: "unpaid" },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice (Mock)
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/cashier/payments">
                <FileText className="mr-2 h-4 w-4" />
                Payment History
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
