"use client";

import { H2, P } from "@/components/elements/typography";
import {
  MedicineForm,
  MedicineFormValues,
} from "@/components/forms/medicine-form";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import {
  getMedicineApiMedicinesMedicineIdGet,
  updateMedicineApiMedicinesMedicineIdPatch,
} from "@/sdk/output/sdk.gen";
import { MedicineDto } from "@/sdk/output/types.gen";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMedicinePage() {
  const router = useRouter();
  const params = useParams();
  const [medicine, setMedicine] = useState<MedicineDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      setIsLoading(true);
      if (typeof params.id === "string") {
        const result = await safeApiCall(
          getMedicineApiMedicinesMedicineIdGet({
            path: { medicine_id: params.id },
          })
        );
        if (result) {
          setMedicine(result);
        }
      }
      setIsLoading(false);
    };
    fetchMedicine();
  }, [params.id]);

  const handleSubmit = async (data: MedicineFormValues) => {
    if (typeof params.id !== "string") return;
    setIsSubmitting(true);

    const result = await safeApiCall(
      updateMedicineApiMedicinesMedicineIdPatch({
        path: { medicine_id: params.id },
        body: {
          medicine_code: data.medicine_code,
          medicine_name: data.medicine_name,
          unit: data.unit || null,
          unit_price: parseFloat(data.unit_price) || 0,
          is_active: data.is_active,
        },
      }),
      { successMessage: "Medicine updated successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/pharmacy/inventory");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!medicine) {
    return <div>Medicine not found</div>;
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/pharmacy/inventory">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Edit Medicine
          </H2>
          <P className="text-muted-foreground text-sm">
            Update medicine information.
          </P>
        </div>
      </div>

      <div className="w-full">
        <MedicineForm
          initialData={medicine}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
