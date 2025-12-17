"use client";

import {
  AdminUserCreationForm,
  AdminUserFormValues,
} from "@/components/forms/AdminUserCreationForm";
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
import {
  createDoctorUserApiUsersDoctorsPost,
  createPatientUserApiUsersPatientsPost,
  createStaffUserApiUsersStaffPost,
} from "@/sdk/output/sdk.gen";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: AdminUserFormValues) => {
    setIsLoading(true);

    let response;

    // Call appropriate endpoint based on role
    if (data.role === "patient") {
      response = await safeApiCall(
        createPatientUserApiUsersPatientsPost({
          body: {
            username: data.username,
            password: data.password,
            full_name: data.full_name,
            email: data.email || null,
            phone_number: data.phone_number || null,
            nik: data.nik!,
            date_of_birth: data.date_of_birth!,
            gender: data.gender!,
            bpjs_number: data.bpjs_number || null,
            blood_type: data.blood_type || null,
            address: data.address || null,
            emergency_contact_name: data.emergency_contact_name || null,
            emergency_contact_phone: data.emergency_contact_phone || null,
          },
        }),
        {
          successMessage: "Patient user created successfully",
          errorMessage: "Failed to create patient user",
        }
      );
    } else if (data.role === "doctor") {
      response = await safeApiCall(
        createDoctorUserApiUsersDoctorsPost({
          body: {
            username: data.username,
            password: data.password,
            full_name: data.full_name,
            email: data.email || null,
            phone_number: data.phone_number || null,
            specialty: data.specialty || null,
            sip_number: data.sip_number || null,
            str_number: data.str_number || null,
          },
        }),
        {
          successMessage: "Doctor user created successfully",
          errorMessage: "Failed to create doctor user",
        }
      );
    } else if (data.role === "staff") {
      response = await safeApiCall(
        createStaffUserApiUsersStaffPost({
          body: {
            username: data.username,
            password: data.password,
            full_name: data.full_name,
            email: data.email || null,
            phone_number: data.phone_number || null,
            department: data.department!,
          },
        }),
        {
          successMessage: "Staff user created successfully",
          errorMessage: "Failed to create staff user",
        }
      );
    } else {
      toast.error("Invalid role selected");
      setIsLoading(false);
      return;
    }

    if (response) {
      router.push("/dashboard/admin/users");
    }

    setIsLoading(false);
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
          <p className="text-muted-foreground text-sm">
            Create a new user account with role-specific profile information
          </p>
        </CardHeader>
        <CardContent>
          <AdminUserCreationForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitText="Create User"
          />
        </CardContent>
      </Card>
    </div>
  );
}
