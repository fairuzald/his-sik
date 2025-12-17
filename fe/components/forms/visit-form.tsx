"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { safeApiCall } from "@/lib/api-handler";
import {
  listClinicsApiClinicsGet,
  listUsersApiUsersGet,
} from "@/sdk/output/sdk.gen";
import {
  ClinicDto,
  UserDao,
  VisitDto,
  VisitStatusEnum,
  VisitTypeEnum,
} from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const visitSchema = z.object({
  patient_id: z.string().uuid("Patient is required"),
  doctor_id: z.string().uuid("Doctor is required"),
  clinic_id: z.string().uuid("Clinic is required"),
  visit_datetime: z.string().min(1, "Date & Time is required"),
  visit_type: z.nativeEnum(VisitTypeEnum),
  visit_status: z.nativeEnum(VisitStatusEnum).optional(),
  chief_complaint: z.string().optional(),
});

export type VisitFormValues = z.infer<typeof visitSchema>;

interface VisitFormProps {
  initialData?: VisitDto;
  onSubmit: (data: VisitFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function VisitForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: VisitFormProps) {
  const [patients, setPatients] = useState<UserDao[]>([]);
  const [doctors, setDoctors] = useState<UserDao[]>([]);
  const [clinics, setClinics] = useState<ClinicDto[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsFetching(true);
      const [patientsRes, doctorsRes, clinicsRes] = await Promise.all([
        safeApiCall(
          listUsersApiUsersGet({
            query: { roles: "patient", limit: 1000 },
          })
        ),
        safeApiCall(
          listUsersApiUsersGet({
            query: { roles: "doctor", limit: 1000 },
          })
        ),
        safeApiCall(listClinicsApiClinicsGet({ query: { limit: 100 } })),
      ]);

      if (patientsRes) setPatients(patientsRes);
      if (doctorsRes) setDoctors(doctorsRes);
      if (clinicsRes) setClinics(clinicsRes);
      setIsFetching(false);
    };

    fetchOptions();
  }, []);

  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: initialData
      ? {
          patient_id: initialData.patient_id,
          doctor_id: initialData.doctor_id,
          clinic_id: initialData.clinic_id,
          visit_datetime: initialData.visit_datetime?.substring(0, 16), // Format for datetime-local
          visit_type: initialData.visit_type,
          visit_status: initialData.visit_status,
          chief_complaint: initialData.chief_complaint || "",
        }
      : {
          patient_id: "",
          doctor_id: "",
          clinic_id: "",
          visit_datetime: "",
          visit_type: VisitTypeEnum.GENERAL,
          visit_status: VisitStatusEnum.REGISTERED, // Default status
          chief_complaint: "",
        },
  });

  const handleSubmit = (data: VisitFormValues) => {
    // Ensure ISO format for date
    const isoDate = new Date(data.visit_datetime).toISOString();
    onSubmit({ ...data, visit_datetime: isoDate });
  };

  if (isFetching) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Patient *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name} ({patient.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doctor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clinic_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clinics.map(clinic => (
                      <SelectItem key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visit_datetime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date & Time *</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visit Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(VisitTypeEnum).map(type => (
                      <SelectItem
                        key={type}
                        value={type}
                        className="capitalize"
                      >
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visit_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(VisitStatusEnum).map(status => (
                      <SelectItem
                        key={status}
                        value={status}
                        className="capitalize"
                      >
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="chief_complaint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chief Complaint</FormLabel>
              <FormControl>
                <Input placeholder="Optional complaint..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Visit
          </Button>
        </div>
      </form>
    </Form>
  );
}
