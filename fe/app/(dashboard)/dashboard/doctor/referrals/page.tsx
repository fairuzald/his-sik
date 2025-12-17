"use client";

import { H2, P } from "@/components/elements/typography";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import {
  deleteReferralApiReferralsReferralIdDelete,
  listReferralsApiReferralsGet,
} from "@/sdk/output/sdk.gen";
import { ReferralDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit, Eye, Loader2, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DoctorReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchReferrals();
  }, []);

  const handleDelete = async (id: string, facility: string) => {
    const result = await safeApiCall(
      deleteReferralApiReferralsReferralIdDelete({
        path: { referral_id: id },
      }),
      { successMessage: `Referral to "${facility}" deleted successfully` }
    );

    if (result) {
      fetchReferrals();
    }
  };

  const columns: ColumnDef<ReferralDto>[] = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => format(new Date(row.original.created_at), "PP"),
    },
    {
      accessorKey: "patient_id",
      header: "Patient",
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.patient_id.substring(0, 8)}...
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
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/doctor/referrals/${row.original.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/dashboard/doctor/referrals/${row.original.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Referral</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this referral to &quot;
                  {row.original.referred_to_facility}&quot;? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    handleDelete(
                      row.original.id,
                      row.original.referred_to_facility
                    )
                  }
                  className="bg-red-500 hover:bg-red-600"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
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
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Referrals
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage patient referrals to other facilities.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/doctor/referrals/new">
            <Plus className="h-4 w-4" />
            New Referral
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            My Referrals
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
