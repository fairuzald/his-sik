"use client";

import { H2, P } from "@/components/elements/typography";
import { UserForm } from "@/components/forms/user-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, users } from "@/data/mock-data";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const user = users.find(u => u.id === params.id);

  if (!user) {
    return <div>Pengguna tidak ditemukan</div>;
  }

  const handleSubmit = (data: Partial<User>) => {
    // In a real app, this would be an API call
    console.log("Updating user:", data);
    toast.success("Pengguna berhasil diperbarui");
    router.push("/dashboard/admin/users");
  };

  return (
    <div className="space-y-8 p-2">
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Edit Pengguna
        </H2>
        <P className="text-muted-foreground mt-1">
          Perbarui detail akun pengguna.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>Detail Pengguna</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UserForm
            initialData={user}
            onSubmit={handleSubmit}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}
