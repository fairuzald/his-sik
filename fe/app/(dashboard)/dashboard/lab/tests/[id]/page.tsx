"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LabOrderViewPage() {
  const params = useParams();

  // Mock data - in real app fetch based on ID
  const result = {
    hemoglobin: "14.2",
    leukocytes: "6.5",
    platelets: "250",
  };

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/lab/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Lab Results
            </H2>
            <P className="text-muted-foreground">ID: {params.id}</P>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print Results
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">
              Complete Blood Count
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Reference Range</TableHead>
                  <TableHead>Result Value</TableHead>
                  <TableHead>Unit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Hemoglobin</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    13.5 - 17.5
                  </TableCell>
                  <TableCell className="font-bold">
                    {result.hemoglobin}
                  </TableCell>
                  <TableCell className="text-muted-foreground">g/dL</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Leukocytes</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    4.5 - 11.0
                  </TableCell>
                  <TableCell className="font-bold">
                    {result.leukocytes}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    10^3/uL
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Platelets</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    150 - 450
                  </TableCell>
                  <TableCell className="font-bold">
                    {result.platelets}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    10^3/uL
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="mt-8 rounded-md border border-green-100 bg-green-50 p-4">
              <p className="font-medium text-green-800">Status: Completed</p>
              <p className="text-sm text-green-700">
                Verified by: Lab Specialist on 2023-11-20 11:30
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Sample Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Patient
                </p>
                <p className="font-medium">Alice Johnson</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Priority
                </p>
                <Badge variant="outline">Routine</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Sample Type
                </p>
                <p className="font-medium">Whole Blood (EDTA)</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Collected On
                </p>
                <p className="font-medium">2023-11-20 09:45</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
