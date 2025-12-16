"use client";

import { H2, P } from "@/components/elements/typography";
import { UserForm } from "@/components/forms/user-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/data/mock-data";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();

  const handleSubmit = (data: Partial<User>) => {
    // In a real app, this would be an API call
    console.log("Creating user:", data);
    toast.success("Pengguna berhasil dibuat");
    router.push("/dashboard/admin/users");
  };

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Pengguna Baru
        </H2>
        <P className="text-muted-foreground mt-1">Buat akun pengguna baru.</P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Detail Pengguna</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UserForm onSubmit={handleSubmit} onCancel={() => router.back()} />
        </CardContent>
      </Card>
    </div>
  );
}
