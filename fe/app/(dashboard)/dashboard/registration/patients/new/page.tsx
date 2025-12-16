"use client";

import { H2, P } from "@/components/elements/typography";
import { PatientForm } from "@/components/forms/patient-form";
import { Button } from "@/components/ui/button";
import { Patient } from "@/data/mock-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewPatientPage() {
  const router = useRouter();

  const handleSubmit = (data: Partial<Patient>) => {
    // In a real app, this would be an API call
    console.log("Creating patient:", data);
    toast.success("Pasien berhasil dibuat");
    router.push("/dashboard/registration/patients");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/registration/patients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Pasien Baru
          </H2>
          <P className="text-muted-foreground text-sm">
            Daftarkan pasien baru ke dalam sistem.
          </P>
        </div>
      </div>

      <div className="w-full">
        <PatientForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
