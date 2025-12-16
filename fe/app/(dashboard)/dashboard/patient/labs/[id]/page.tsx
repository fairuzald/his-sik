"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { LabResult, labOrders } from "@/data/mock-data";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, ArrowLeft, Calendar, Download, User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const columns: ColumnDef<LabResult>[] = [
  {
    accessorKey: "result_text",
    header: "Result",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.result_text || "Result Available"}
      </span>
    ),
  },
  {
    accessorKey: "result_value_numeric",
    header: "Value",
    cell: ({ row }) => (
      <span className="font-semibold">
        {row.original.result_value_numeric || "-"}
      </span>
    ),
  },
  {
    accessorKey: "result_unit",
    header: "Unit",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.result_unit || "-"}
      </span>
    ),
  },
];

export default function LabDetailPage() {
  const params = useParams();
  const lab = labOrders.find(l => l.id === params.id) || labOrders[0]; // Fallback

  if (!lab) return <div>Lab order not found</div>;

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/patient/labs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Lab Result Details
          </H2>
          <P className="text-muted-foreground">ID: {lab.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <Activity className="text-primary h-5 w-5" />
              <CardTitle className="text-primary text-lg">
                {lab.test_name}
              </CardTitle>
            </div>
            <Badge variant="outline" className="bg-background">
              {lab.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            {lab.result ? (
              <>
                <DataTable
                  columns={columns}
                  data={[lab.result]}
                  searchKey="result_text"
                />
                <div className="bg-muted/10 mt-6 rounded-md border p-4">
                  <Small className="text-primary font-semibold">
                    Interpretation
                  </Small>
                  <P className="text-muted-foreground mt-1 text-sm">
                    {lab.result.interpretation || "No interpretation provided."}
                  </P>
                </div>
              </>
            ) : (
              <div className="text-muted-foreground py-6 text-center">
                Result pending or not available.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">Test Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-start gap-3">
                <User className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">Ordered By</Small>
                  <P className="font-medium">{lab.doctor_name}</P>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <Small className="text-muted-foreground">
                    Date Performed
                  </Small>
                  <P className="font-medium">{lab.request_datetime}</P>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="mt-4 w-full gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>
    </div>
  );
}
