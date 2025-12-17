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
import { Textarea } from "@/components/ui/textarea";
import { ClinicDto, UserDao, VisitTypeEnum } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const appointmentSchema = z.object({
  clinic_id: z.string().min(1, "Please select a clinic"),
  doctor_id: z.string().min(1, "Please select a doctor"),
  visit_type: z.nativeEnum(VisitTypeEnum),
  visit_datetime: z.string().min(1, "Please select a date and time"), // datetime-local input
  chief_complaint: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface PatientAppointmentFormProps {
  clinics: ClinicDto[];
  doctors: UserDao[]; // We will pass doctors here
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PatientAppointmentForm({
  clinics,
  doctors,
  onSubmit,
  onCancel,
  isLoading,
}: PatientAppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clinic_id: "",
      doctor_id: "",
      visit_datetime: "",
      chief_complaint: "",
      visit_type: VisitTypeEnum.GENERAL,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="clinic_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Clinic" />
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
            name="doctor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading || doctors.length === 0}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          doctors.length === 0
                            ? "No doctors available"
                            : "Select Doctor"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map(doc => (
                      <SelectItem key={doc.id} value={doc.id}>
                        {doc.full_name} ({doc.username})
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
            name="visit_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visit Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(VisitTypeEnum).map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                <FormLabel>Date & Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
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
              <FormLabel>Chief Complaint (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isLoading}
                  placeholder="Describe your symptoms..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Book Appointment"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
