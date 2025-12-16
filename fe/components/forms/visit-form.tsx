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
import { Visit, doctors, patients } from "@/data/mock-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const visitSchema = z.object({
  patient_id: z.string().min(1, "Pasien wajib diisi"),
  doctor_id: z.string().min(1, "Dokter wajib diisi"),
  clinic: z.string().min(1, "Klinik wajib diisi"),
  visit_datetime: z.string().min(1, "Tanggal & Waktu wajib diisi"),
  visit_type: z.enum(["general", "follow_up", "referral", "other"]),
  status: z.string().optional(),
});

type VisitFormValues = z.infer<typeof visitSchema>;

interface VisitFormProps {
  initialData?: Visit;
  onSubmit: (data: Partial<Visit>) => void;
  onCancel: () => void;
}

const clinics = [
  "Klinik Umum",
  "Klinik Gigi",
  "Klinik Jantung",
  "Klinik Anak",
  "Klinik Ortopedi",
  "Klinik Saraf",
];

export function VisitForm({ initialData, onSubmit, onCancel }: VisitFormProps) {
  const form = useForm<VisitFormValues>({
    resolver: zodResolver(visitSchema),
    defaultValues: initialData
      ? {
          patient_id: initialData.patient_id,
          doctor_id: initialData.doctor_id,
          clinic: initialData.clinic || "",
          visit_datetime: initialData.visit_datetime,
          visit_type: initialData.visit_type,
          status: initialData.status,
        }
      : {
          patient_id: "",
          doctor_id: "",
          clinic: "",
          visit_datetime: "",
          visit_type: "general",
          status: "Scheduled",
        },
  });

  const handleSubmit = (data: VisitFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="patient_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pasien *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih pasien" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {patients.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.full_name} ({patient.medical_record_number})
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
                <FormLabel>Dokter *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dokter" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.full_name} ({doctor.specialty})
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
            name="clinic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Klinik *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih klinik" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clinics.map(clinic => (
                      <SelectItem key={clinic} value={clinic}>
                        {clinic}
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
                <FormLabel>Tanggal & Waktu *</FormLabel>
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
                <FormLabel>Tipe Kunjungan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe kunjungan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">Umum</SelectItem>
                    <SelectItem value="follow_up">Tindak Lanjut</SelectItem>
                    <SelectItem value="referral">Rujukan</SelectItem>
                    <SelectItem value="other">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Scheduled">Terjadwal</SelectItem>
                    <SelectItem value="In Progress">
                      Sedang Berlangsung
                    </SelectItem>
                    <SelectItem value="Completed">Selesai</SelectItem>
                    <SelectItem value="Canceled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">Simpan Janji Temu</Button>
        </div>
      </form>
    </Form>
  );
}
