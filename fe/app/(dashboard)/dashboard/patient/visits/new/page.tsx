"use client";

import { H2, P } from "@/components/elements/typography";
import { VisitForm } from "@/components/forms/visit-form";
import { Button } from "@/components/ui/button";
import { Visit } from "@/data/mock-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewPatientVisitPage() {
  const router = useRouter();

  const handleSubmit = (data: Partial<Visit>) => {
    // In a real app, this would be an API call
    console.log("Creating visit:", data);
    toast.success("Janji temu berhasil dijadwalkan");
    router.push("/dashboard/patient/visits");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/patient/visits">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Buat Janji Temu
          </H2>
          <P className="text-muted-foreground text-sm">
            Jadwalkan janji temu baru dengan dokter.
          </P>
        </div>
      </div>

      <div className="w-full">
        <VisitForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
