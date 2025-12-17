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
import { safeApiCall } from "@/lib/api-handler";
import {
  getPrescriptionApiPrescriptionsPrescriptionIdGet,
  updatePrescriptionStatusApiPrescriptionsPrescriptionIdStatusPatch,
} from "@/sdk/output/sdk.gen";
import {
  PrescriptionDto,
  PrescriptionStatusEnum,
} from "@/sdk/output/types.gen";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PharmacyPrescriptionDetailPage() {
  const params = useParams();
  const prescriptionId = params.id as string;
  const router = useRouter();

  const [prescription, setPrescription] = useState<PrescriptionDto | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        getPrescriptionApiPrescriptionsPrescriptionIdGet({
          path: { prescription_id: prescriptionId },
        })
      );
      if (result) {
        setPrescription(result);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [prescriptionId]);

  const handleComplete = async () => {
    setIsProcessing(true);
    const result = await safeApiCall(
      updatePrescriptionStatusApiPrescriptionsPrescriptionIdStatusPatch({
        path: { prescription_id: prescriptionId },
        body: { prescription_status: PrescriptionStatusEnum.COMPLETED },
      }),
      { successMessage: "Prescription completed!" }
    );
    if (result) {
      router.push("/dashboard/pharmacy/prescriptions");
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

  if (!prescription) {
    return <div className="p-8 text-center">Prescription not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/pharmacy/prescriptions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Process Prescription
          </H2>
          <P className="text-muted-foreground">
            ID: {prescriptionId.substring(0, 8)}...
          </P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">
              Medication List
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.items && prescription.items.length > 0 ? (
                  prescription.items.map((item, idx) => (
                    <TableRow key={item.id || idx}>
                      <TableCell className="font-medium">
                        {item.medicine?.medicine_name || "Unknown Medicine"}
                      </TableCell>
                      <TableCell>{item.dosage || "-"}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-green-200 bg-green-50 text-green-600"
                        >
                          Available
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="secondary">
                          Prepare
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-muted-foreground text-center"
                    >
                      No items in this prescription
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">Order Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Patient
                </p>
                <p className="font-medium">
                  {prescription.visit?.patient_id
                    ? prescription.visit.patient_id.substring(0, 8) + "..."
                    : "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Doctor
                </p>
                <p className="font-medium">
                  {prescription.doctor_id.substring(0, 8)}...
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Status
                </p>
                <Badge>{prescription.prescription_status}</Badge>
              </div>

              <div className="border-t pt-4">
                {prescription.prescription_status !== "completed" ? (
                  <Button
                    className="w-full gap-2 bg-green-600 hover:bg-green-700"
                    onClick={handleComplete}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Complete Order
                  </Button>
                ) : (
                  <div className="rounded bg-green-100 p-2 text-center font-bold text-green-700">
                    Completed
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
