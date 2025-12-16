"use client";

import { H2, P } from "@/components/elements/typography";
import {
  MedicineForm,
  MedicineFormValues,
} from "@/components/forms/medicine-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewMedicinePage() {
  const router = useRouter();

  const handleSubmit = (data: MedicineFormValues) => {
    console.log("Creating medicine:", data);
    toast.success("Obat berhasil dibuat");
    router.push("/dashboard/pharmacy/inventory");
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
            Tambah Obat Baru
          </H2>
          <P className="text-muted-foreground text-sm">
            Tambahkan obat baru ke inventaris.
          </P>
        </div>
      </div>

      <div className="w-full">
        <MedicineForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
    </div>
  );
}
