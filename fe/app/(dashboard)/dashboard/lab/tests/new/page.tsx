"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const testSchema = z.object({
  code: z.string().min(1, "Kode diperlukan"),
  name: z.string().min(1, "Nama diperlukan"),
  category: z.string().min(1, "Kategori diperlukan"),
  price: z.string().min(1, "Harga diperlukan"),
  tat: z.string().min(1, "Waktu pengerjaan diperlukan"),
  description: z.string().optional(),
  specimen: z.string().min(1, "Tipe spesimen diperlukan"),
  department: z.string().min(1, "Departemen diperlukan"),
});

type TestValues = z.infer<typeof testSchema>;

export default function NewTestPage() {
  const router = useRouter();

  const form = useForm<TestValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      code: "",
      name: "",
      category: "",
      price: "",
      tat: "",
      description: "",
      specimen: "",
      department: "",
    },
  });

  const onSubmit = (data: TestValues) => {
    console.log("New Test Data:", data);
    toast.success("Tes baru berhasil ditambahkan");
    router.push("/dashboard/lab/tests");
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/lab/tests">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Tambah Tes Baru
          </H2>
          <P className="text-muted-foreground text-sm">
            Definisikan parameter tes laboratorium baru.
          </P>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Tes</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. CBC" {...field} />
                  </FormControl>
                  <FormDescription>Pengenal unik untuk tes.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Tes</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. Hitung Darah Lengkap" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hematology">Hematologi</SelectItem>
                      <SelectItem value="Chemistry">Kimia</SelectItem>
                      <SelectItem value="Microbiology">Mikrobiologi</SelectItem>
                      <SelectItem value="Immunology">Imunologi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departemen</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Main Lab">Lab Utama</SelectItem>
                      <SelectItem value="Emergency Lab">Lab Darurat</SelectItem>
                      <SelectItem value="Outpatient Lab">
                        Lab Rawat Jalan
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specimen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe Spesimen</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih spesimen..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Whole Blood">Darah Utuh</SelectItem>
                      <SelectItem value="Serum">Serum</SelectItem>
                      <SelectItem value="Plasma">Plasma</SelectItem>
                      <SelectItem value="Urine">Urin</SelectItem>
                      <SelectItem value="Stool">Tinja</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="cth. 150000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Waktu Pengerjaan</FormLabel>
                  <FormControl>
                    <Input placeholder="cth. 2 jam" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Deskripsi singkat tes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" size="lg" className="gap-2 px-8">
              <Save className="h-4 w-4" />
              Simpan Definisi Tes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
