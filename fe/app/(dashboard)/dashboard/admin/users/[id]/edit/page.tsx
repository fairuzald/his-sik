"use client";

import { H2, P } from "@/components/elements/typography";
import { UserForm, UserFormValues } from "@/components/forms/UserForm";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { safeApiCall } from "@/lib/api-handler";
import { listUsersApiUsersGet } from "@/sdk/output/sdk.gen";
import { UserDao } from "@/sdk/output/types.gen";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  const [user, setUser] = useState<UserDao | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      // Since there's no single-user GET endpoint, fetch from list
      const result = await safeApiCall(
        listUsersApiUsersGet({ query: { limit: 500 } })
      );
      if (result && Array.isArray(result)) {
        const foundUser = result.find(u => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
        }
      }
      setIsLoading(false);
    };
    fetchUser();
  }, [userId]);

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);
    // Note: The current SDK doesn't have a user update endpoint.
    // This would need to be added to the backend API.
    console.log("User update data:", data);
    toast.info("User update API not available in current SDK version");
    setIsSubmitting(false);
    router.push("/dashboard/admin/users");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center">User not found</div>;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Edit User
        </H2>
        <P className="text-muted-foreground mt-1">
          Update user account details.
        </P>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <UserForm
            defaultValues={{
              full_name: user.full_name || "",
              username: user.username || "",
              email: user.email || "",
              phone_number: user.phone_number || "",
              role: user.role || "patient",
            }}
            onSubmit={onSubmit}
            isAdmin={true}
            mode="edit"
            submitText="Update User"
            isLoading={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
