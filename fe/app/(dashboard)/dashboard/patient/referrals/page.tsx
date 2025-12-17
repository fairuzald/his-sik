"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listReferralsApiReferralsGet } from "@/sdk/output/sdk.gen";
import { ReferralDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<ReferralDto>[] = [
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.created_at), "PP"),
  },
  {
    accessorKey: "referring_doctor_id",
    header: "Referring Doctor",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.referring_doctor_id.substring(0, 8)}...
      </span>
    ),
  },
  {
    accessorKey: "referred_to_facility",
    header: "Facility",
  },
  {
    accessorKey: "specialty",
    header: "Specialty",
    cell: ({ row }) => row.original.specialty || "-",
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="max-w-xs truncate">{row.original.reason}</span>
    ),
  },
  {
    accessorKey: "referral_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.referral_status;
      return (
        <Badge
          variant={status === "completed" ? "default" : "secondary"}
          className={status === "completed" ? "bg-green-500" : ""}
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
      <Button size="sm" variant="ghost" asChild>
        <Link href={`/dashboard/patient/referrals/${row.original.id}`}>
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
    ),
  },
];

export default function PatientReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listReferralsApiReferralsGet({ query: { limit: 100 } })
      );
      if (result && Array.isArray(result)) {
        setReferrals(result);
      }
      setIsLoading(false);
    };
    fetchReferrals();
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
          My Referrals
        </H2>
        <P className="text-muted-foreground mt-1">
          View your medical referrals to other facilities.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Referral History
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={referrals}
            searchKey="referred_to_facility"
            filterKey="referral_status"
            filterOptions={[
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
              { label: "Canceled", value: "canceled" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
