"use client";

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
import { createUserApiUsersPost } from "@/sdk/output/sdk.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: UserFormValues) => {
    setIsLoading(true);
    try {
      const response = await createUserApiUsersPost({
        body: {
          full_name: data.full_name,
          username: data.username,
          password: data.password!,
          email: data.email || null,
          phone_number: data.phone_number || null,
          role: data.role || "patient",
        },
      });

      if (response.data?.success) {
        toast.success("User created successfully");
        router.push("/dashboard/admin/users");
      } else {
        toast.error(response.data?.message || "Failed to create user");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to create user. Please try again.");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            <BreadcrumbPage>Create User</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            isAdmin={true}
            submitText="Create User"
          />
        </CardContent>
      </Card>
    </div>
  );
}
