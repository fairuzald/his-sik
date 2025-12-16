"use client";

import { H2, P } from "@/components/elements/typography";
import { PatientForm } from "@/components/forms/patient-form";
import { Button } from "@/components/ui/button";
import { Patient, patients } from "@/data/mock-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditMyProfilePage() {
  const router = useRouter();
  // In a real app, we would get the logged-in user's patient ID from session/context
  const patient = patients[0];

  const handleSubmit = (data: Partial<Patient>) => {
    // In a real app, this would be an API call
    console.log("Updating profile:", data);
    toast.success("Profile updated successfully");
    router.push("/dashboard/patient/profile");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/patient/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Edit Profile
          </H2>
          <P className="text-muted-foreground text-sm">
            Update your personal information.
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
