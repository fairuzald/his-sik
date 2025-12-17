"use client";

import { H2, P } from "@/components/elements/typography";
import {
  PrescriptionForm,
  PrescriptionFormValues,
} from "@/components/forms/prescription-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewPrescriptionPage() {
  const router = useRouter();

  const handleSubmit = (data: PrescriptionFormValues) => {
    console.log("Creating prescription:", data);
    toast.success("Prescription created successfully");
    router.push("/dashboard/pharmacy/prescriptions");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/pharmacy/prescriptions">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            New Prescription
          </H2>
          <P className="text-muted-foreground text-sm">
            Create a new prescription record.
          </P>
        </div>
      </div>

      <div className="w-full">
        <PrescriptionForm
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
