"use client";

import { H2, P } from "@/components/elements/typography";
import {
  MedicineForm,
  MedicineFormValues,
} from "@/components/forms/medicine-form";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import { createMedicineApiMedicinesPost } from "@/sdk/output/sdk.gen";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMedicinePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: MedicineFormValues) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      createMedicineApiMedicinesPost({
        body: {
          medicine_code: data.medicine_code,
          medicine_name: data.medicine_name,
          unit: data.unit || null,
          unit_price: parseFloat(data.unit_price) || 0,
          is_active: data.is_active,
        },
      }),
      { successMessage: "Medicine created successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/pharmacy/inventory");
    }
  };

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
            Add New Medicine
          </H2>
          <P className="text-muted-foreground text-sm">
            Add a new medicine to the inventory.
          </P>
        </div>
      </div>

      <div className="w-full">
        <MedicineForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
