"use client";

import { H2, P } from "@/components/elements/typography";
import { VisitForm } from "@/components/forms/visit-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visit, visits } from "@/data/mock-data";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditVisitPage() {
  const params = useParams();
  const router = useRouter();
  const visit = visits.find(v => v.id === params.id);

  if (!visit) {
    return <div>Kunjungan tidak ditemukan</div>;
  }

  const handleSubmit = (data: Partial<Visit>) => {
    // In a real app, this would be an API call
    console.log("Updating visit:", data);
    toast.success("Janji temu berhasil diperbarui");
    router.push("/dashboard/registration/visits");
  };

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Edit Janji Temu
        </H2>
        <P className="text-muted-foreground mt-1">
          Perbarui detail janji temu.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Detail Janji Temu</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <VisitForm
            initialData={visit}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
