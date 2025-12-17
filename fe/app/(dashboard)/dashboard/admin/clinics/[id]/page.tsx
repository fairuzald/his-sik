"use client";

import { H2, P } from "@/components/elements/typography";
import { ClinicForm, ClinicFormValues } from "@/components/forms/clinic-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { safeApiCall } from "@/lib/api-handler";
import {
  deleteClinicApiClinicsClinicIdDelete,
  getClinicApiClinicsClinicIdGet,
  updateClinicApiClinicsClinicIdPatch,
} from "@/sdk/output/sdk.gen";
import { ClinicDto } from "@/sdk/output/types.gen";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditClinicPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [clinic, setClinic] = useState<ClinicDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchClinic() {
      setIsLoading(true);
      const data = await safeApiCall(
        getClinicApiClinicsClinicIdGet({
          path: { clinic_id: id },
        })
      );
      if (data) {
        setClinic(data);
      } else {
        // If fetch fails (e.g. 404), redirect or show error
        router.push("/dashboard/admin/clinics");
      }
      setIsLoading(false);
    }

    if (id) {
      fetchClinic();
    }
  }, [id, router]);

  const handleUpdate = async (data: ClinicFormValues) => {
    setIsSaving(true);
    const result = await safeApiCall(
      updateClinicApiClinicsClinicIdPatch({
        path: { clinic_id: id },
        body: data,
      }),
      { successMessage: "Clinic updated successfully" }
    );
    setIsSaving(false);

    if (result) {
      router.push("/dashboard/admin/clinics");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await safeApiCall(
      deleteClinicApiClinicsClinicIdDelete({
        path: { clinic_id: id },
      }),
      { successMessage: "Clinic deleted successfully" }
    );
    setIsDeleting(false);

    if (result) {
      router.push("/dashboard/admin/clinics");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!clinic) return null;

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/admin/clinics">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Edit Clinic
            </H2>
            <P className="text-muted-foreground text-sm">
              Update clinic details or remove this location.
            </P>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isSaving || isDeleting}>
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete Clinic
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                clinic "{clinic.name}" and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={e => {
                  e.preventDefault();
                  handleDelete();
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="w-full max-w-2xl">
        <ClinicForm
          initialData={clinic}
          onSubmit={handleUpdate}
          onCancel={() => router.back()}
          isLoading={isSaving}
        />
      </div>
    </div>
  );
}
