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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const prescriptionSchema = z.object({
  patient_name: z.string().min(1, "Nama pasien wajib diisi"),
  doctor_name: z.string().min(1, "Nama dokter wajib diisi"),
  notes: z.string().optional(),
  status: z.enum(["Pending", "Processing", "Ready", "Completed", "Cancelled"]),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface PrescriptionFormProps {
  initialData?: Partial<PrescriptionFormValues>;
  onSubmit: (data: PrescriptionFormValues) => void;
  onCancel: () => void;
}

export function PrescriptionForm({
  initialData,
  onSubmit,
  onCancel,
}: PrescriptionFormProps) {
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patient_name: initialData?.patient_name || "",
      doctor_name: initialData?.doctor_name || "",
      notes: initialData?.notes || "",
      status: initialData?.status || "Pending",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="patient_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pasien</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="doctor_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Dokter</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Smith" {...field} />
                </FormControl>
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
                    <SelectItem value="Pending">Tertunda</SelectItem>
                    <SelectItem value="Processing">Sedang Diproses</SelectItem>
                    <SelectItem value="Ready">Siap</SelectItem>
                    <SelectItem value="Completed">Selesai</SelectItem>
                    <SelectItem value="Cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Catatan tambahan..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">Simpan Resep</Button>
        </div>
      </form>
    </Form>
  );
}
