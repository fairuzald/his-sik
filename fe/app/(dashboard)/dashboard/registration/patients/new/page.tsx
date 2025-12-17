"use client";

import { H2, P } from "@/components/elements/typography";
import { UserForm } from "@/components/forms/UserForm"; // Use generic UserForm
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import { createUserApiUsersPost } from "@/sdk/output/sdk.gen";
import { CreateUserDto } from "@/sdk/output/types.gen"; // Use CreateUserDto
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    // Map form data to CreateUserDto. UserForm produces CreateUserDto-like structure.
    const payload: CreateUserDto = {
      username: data.username,
      password: data.password,
      full_name: data.full_name,
      role: "patient", // Force role
      email: data.email || null,
      phone_number: data.phone_number || null,
    };

    const result = await safeApiCall(
      createUserApiUsersPost({
        body: payload,
      }),
      { successMessage: "Patient account created successfully" }
    );

    if (result) {
      router.push("/dashboard/registration/patients");
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/registration/patients">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            New Patient
          </H2>
          <P className="text-muted-foreground text-sm">
            Register a new patient account in the system.
          </P>
        </div>
      </div>

      <div className="w-full">
        {/* Pass initial data to pre-select role if supported, or handled in submit */}
        <UserForm
          defaultValues={{ role: "patient" }}
          onSubmit={handleSubmit}
          isAdmin={false}
        />
        {/* Note: UserForm 'isAdmin' prop controls role field visibility? checking UserForm next. */}
      </div>
    </div>
  );
}
