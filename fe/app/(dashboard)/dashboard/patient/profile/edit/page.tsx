"use client";

import { H2, P } from "@/components/elements/typography";
import {
  ProfileForm,
  ProfileFormValues,
} from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import {
  getMyProfileApiProfileMeGet,
  updatePatientProfileApiProfilePatientPatch,
} from "@/sdk/output/sdk.gen";
import {
  PatientProfileDao,
  UpdatePatientProfileDto,
} from "@/sdk/output/types.gen";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMyProfilePage() {
  const router = useRouter();
  const [initialData, setInitialData] =
    useState<Partial<ProfileFormValues> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await safeApiCall(getMyProfileApiProfileMeGet());

      if (user) {
        const details = user.details as PatientProfileDao | undefined;

        // Map to form values
        setInitialData({
          full_name: user.full_name,
          email: user.email || "",
          phone_number: user.phone_number || "",
          nik: details?.nik || "",
          bpjs_number: details?.bpjs_number || "",
          date_of_birth: details?.date_of_birth || "",
          gender: details?.gender || undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          blood_type: (details?.blood_type ?? undefined) as any,
          address: details?.address || "",
          emergency_contact_name: details?.emergency_contact_name || "",
          emergency_contact_phone: details?.emergency_contact_phone || "",
        });
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);

    const updateData: UpdatePatientProfileDto = {
      ...data,
      // Ensure nulls are handled if API expects explicit nulls for clearing,
      // but usually strings are fine. SDK types allow 'string | null'.
    };

    const result = await safeApiCall(
      updatePatientProfileApiProfilePatientPatch({
        body: updateData,
      }),
      { successMessage: "Profile updated successfully" }
    );

    if (result) {
      router.push("/dashboard/patient/profile");
      router.refresh();
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/patient/profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Edit Profile
          </H2>
          <P className="text-muted-foreground text-sm">
            Update your personal information.
          </P>
        </div>
      </div>

      <div className="w-full">
        {initialData && (
          <ProfileForm
            defaultValues={initialData}
            onSubmit={handleSubmit}
            isLoading={isSaving}
          />
        )}
      </div>
    </div>
  );
}
