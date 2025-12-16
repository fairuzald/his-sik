"use client";

import { H2, P } from "@/components/elements/typography";
import { PatientForm } from "@/components/forms/patient-form";
import { Button } from "@/components/ui/button";
import { Patient, patients } from "@/data/mock-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditPatientPage() {
  const params = useParams();
  const router = useRouter();
  const patient = patients.find(p => p.id === params.id);

  if (!patient) {
    return <div>Pasien tidak ditemukan</div>;
  }

  const handleSubmit = (data: Partial<Patient>) => {
    // In a real app, this would be an API call
    console.log("Updating patient:", data);
    toast.success("Pasien berhasil diperbarui");
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
            Edit Pasien
          </H2>
          <P className="text-muted-foreground text-sm">
            Perbarui informasi pasien.
          </P>
        </div>
      </div>

      <div className="w-full">
        <PatientForm
          initialData={patient}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
        />
      </div>
    </div>
  );
}
