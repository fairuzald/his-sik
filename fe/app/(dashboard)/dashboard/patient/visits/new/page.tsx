"use client";

import { H2, P } from "@/components/elements/typography";
import { PatientAppointmentForm } from "@/components/forms/patient-appointment-form";
import { Button } from "@/components/ui/button";
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
      try {
        // 1. Get My Profile (for patient_id)
        const profileRes = await getMyProfileApiProfileMeGet();
        if (profileRes.data?.success && profileRes.data.data) {
          setMyId(profileRes.data.data.id);
        } else {
          toast.error("Failed to verify user identity");
          return;
        }

        // 2. Get Clinics
        const clinicsRes = await listClinicsApiClinicsGet();
        if (clinicsRes.data?.success && clinicsRes.data.data) {
          setClinics(clinicsRes.data.data);
        }

        // 3. Get Doctors (Try fetching users, assuming maybe we can filter or just get all?)
        // Note: This endpoint might be restricted. If so, doctors list will be empty.
        try {
          const usersRes = await listUsersApiUsersGet(); // We cant filter by query?
          if (usersRes.data?.success && usersRes.data.data) {
            const docList = usersRes.data.data.filter(u => u.role === "doctor");
            setDoctors(docList);
          }
        } catch (err) {
          console.warn(
            "Could not fetch doctors. Permission might be denied.",
            err
          );
        }
      } catch (error) {
        console.error("Error loading form data", error);
        toast.error("Failed to load form data");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const response = await createVisitApiVisitsPost({
        body: {
          ...data,
          patient_id: myId, // Injected
          visit_datetime: new Date(data.visit_datetime).toISOString(), // Ensure ISO format
        },
      });

      if (response.data?.success) {
        toast.success("Appointment booked successfully!");
        router.push("/dashboard/patient/visits");
      } else {
        toast.error(response.data?.message || "Failed to book appointment");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while booking");
        console.error(error);
      }
    } finally {
      setIsSubmitting(false);
    }
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
