"use client";

import { H2, P } from "@/components/elements/typography";
import { PatientAppointmentForm } from "@/components/forms/patient-appointment-form";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import {
  createVisitApiVisitsPost,
  getMyProfileApiProfileMeGet,
  listClinicsApiClinicsGet,
  listUsersApiUsersGet,
} from "@/sdk/output/sdk.gen";
import { ClinicDto, UserDao } from "@/sdk/output/types.gen";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewPatientVisitPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<ClinicDto[]>([]);
  const [doctors, setDoctors] = useState<UserDao[]>([]);
  const [myId, setMyId] = useState<string>("");
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Get My Profile (for patient_id)
      const profile = await safeApiCall(getMyProfileApiProfileMeGet());
      if (profile) {
        setMyId(profile.id);
      } else {
        toast.error("Failed to verify user identity");
        return;
      }

      // 2. Get Clinics
      const clinicsList = await safeApiCall(listClinicsApiClinicsGet());
      if (clinicsList) {
        setClinics(clinicsList);
      }

      // 3. Get Doctors (Try fetching users, assuming maybe we can filter or just get all?)
      // Note: This endpoint might be restricted. If so, doctors list will be empty.
      const usersList = await safeApiCall(listUsersApiUsersGet(), {
        errorMessage: "Could not fetch doctors list", // Supress or custom
      });
      if (usersList) {
        const docList = usersList.filter(u => u.role === "doctor");
        setDoctors(docList);
      }
      setIsLoadingData(false);
    };
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      createVisitApiVisitsPost({
        body: {
          patient_user_id: myId, // Using user_id now
          doctor_user_id: data.doctor_id, // Using user_id now
          clinic_id: data.clinic_id,
          visit_type: data.visit_type,
          chief_complaint: data.chief_complaint || null,
          visit_datetime: new Date(data.visit_datetime).toISOString(), // Ensure ISO format
        },
      }),
      { successMessage: "Appointment booked successfully!" }
    );

    if (result) {
      router.push("/dashboard/patient/visits");
    }
    setIsSubmitting(false);
  };

  if (isLoadingData) {
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
          <Link href="/dashboard/patient">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Book Appointment
          </H2>
          <P className="text-muted-foreground text-sm">
            Schedule a new visit with a doctor.
          </P>
        </div>
      </div>

      <div className="w-full">
        <PatientAppointmentForm
          clinics={clinics}
          doctors={doctors}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}
