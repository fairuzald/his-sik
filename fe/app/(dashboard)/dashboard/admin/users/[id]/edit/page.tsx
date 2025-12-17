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
import { users } from "@/data/mock-data";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  // In a real app, we would fetch the user from API.
  // Since there is no specific endpoint for this in the current SDK for Admin,
  // we will simulate it or use the mock data if available
  const user = users.find(u => u.id === params.id);

  if (!user) {
    return <div>User not found</div>;
  }

  const onSubmit = async (data: UserFormValues) => {
    // In a real implementation, we would call an update API here.
    // e.g., await updateUserApiUsersUserIdPut(...)

    console.log("Updating user:", data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success("User updated successfully (Simulation)");
    router.push("/dashboard/admin/users");
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
              full_name: user?.username || "", // Warning: accessing mock data structure.
              // Adjusting to match Mock Data structure if possible, usually it has username etc.
              username: user?.username || "",
              email: user?.email || "",
              // role: user?.role_name || "", // Role mapping might be needed
            }}
            onSubmit={onSubmit}
            isAdmin={true}
            mode="edit"
            submitText="Update User"
          />
        </CardContent>
      </Card>
    </div>
  );
}
