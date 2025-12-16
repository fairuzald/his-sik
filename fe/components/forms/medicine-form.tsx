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
import { Medicine } from "@/data/mock-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const medicineSchema = z.object({
  medicine_code: z.string().min(1, "Kode obat wajib diisi"),
  medicine_name: z.string().min(1, "Nama obat wajib diisi"),
  dosage_form: z.string().optional(),
  unit: z.string().optional(),
  unit_price: z.number().min(0, "Harga harus positif"),
  stock: z.number().min(0, "Stok harus positif"),
  status: z.string().optional(),
});

export type MedicineFormValues = z.infer<typeof medicineSchema>;

interface MedicineFormProps {
  initialData?: Medicine;
  onSubmit: (data: MedicineFormValues) => void;
  onCancel: () => void;
}

export function MedicineForm({
  initialData,
  onSubmit,
  onCancel,
}: MedicineFormProps) {
  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: (initialData
      ? {
          medicine_code: initialData.medicine_code,
          medicine_name: initialData.medicine_name,
          dosage_form: initialData.dosage_form,
          unit: initialData.unit,
          unit_price: initialData.unit_price,
          stock: initialData.stock,
          status: initialData.status,
        }
      : {
          medicine_code: "",
          medicine_name: "",
          dosage_form: "",
          unit: "",
          unit_price: 0,
          stock: 0,
          status: "Active",
        }) as MedicineFormValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="medicine_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kode Obat</FormLabel>
                <FormControl>
                  <Input placeholder="MED-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="medicine_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Obat</FormLabel>
                <FormControl>
                  <Input placeholder="Paracetamol" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dosage_form"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bentuk Sediaan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih bentuk" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Capsule">Kapsul</SelectItem>
                    <SelectItem value="Syrup">Sirup</SelectItem>
                    <SelectItem value="Injection">Injeksi</SelectItem>
                    <SelectItem value="Cream">Krim</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Satuan</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih satuan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Strip">Strip</SelectItem>
                    <SelectItem value="Bottle">Botol</SelectItem>
                    <SelectItem value="Box">Kotak</SelectItem>
                    <SelectItem value="Vial">Vial</SelectItem>
                    <SelectItem value="Tube">Tube</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Satuan (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">Simpan Obat</Button>
        </div>
      </form>
    </Form>
  );
}
