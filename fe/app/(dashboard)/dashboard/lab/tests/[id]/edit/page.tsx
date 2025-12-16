"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Upload } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const labResultSchema = z.object({
  hemoglobin: z.string().min(1, "Wajib"),
  leukocytes: z.string().min(1, "Wajib"),
  platelets: z.string().min(1, "Wajib"),
});

type LabResultValues = z.infer<typeof labResultSchema>;

export default function LabOrderDetailPage() {
  const params = useParams();
  const router = useRouter();

  const form = useForm<LabResultValues>({
    resolver: zodResolver(labResultSchema),
    defaultValues: {
      hemoglobin: "",
      leukocytes: "",
      platelets: "",
    },
  });

  const onSubmit = (data: LabResultValues) => {
    console.log("Lab Results:", data);
    toast.success("Hasil lab berhasil dikirim");
    router.push("/dashboard/lab/orders");
  };

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/lab/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Proses Pesanan Lab
          </H2>
          <P className="text-muted-foreground">ID: {params.id}</P>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="shadow-sm md:col-span-2">
              <CardHeader className="bg-muted/20 border-b">
                <CardTitle className="text-primary text-lg">
                  Input Hasil: Hitung Darah Lengkap
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Rentang Referensi</TableHead>
                      <TableHead>Nilai Hasil</TableHead>
                      <TableHead>Satuan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Hemoglobin</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        13.5 - 17.5
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name="hemoglobin"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Masukkan nilai"
                                  className="w-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        g/dL
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Leukosit</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        4.5 - 11.0
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name="leukocytes"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Masukkan nilai"
                                  className="w-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        10^3/uL
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Trombosit</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        150 - 450
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name="platelets"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Masukkan nilai"
                                  className="w-32"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        10^3/uL
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="bg-muted/5 mt-6 flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4">
                  <Upload className="text-muted-foreground h-8 w-8" />
                  <p className="text-muted-foreground text-sm">
                    Unggah hasil cetak mesin (PDF/JPG)
                  </p>
                  <Button variant="secondary" size="sm" type="button">
                    Pilih File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-muted/20 border-b">
                  <CardTitle className="text-primary text-lg">
                    Info Sampel
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Pasien
                    </p>
                    <p className="font-medium">Alice Johnson</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Prioritas
                    </p>
                    <Badge variant="outline">Rutin</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Tipe Sampel
                    </p>
                    <p className="font-medium">Darah Utuh (EDTA)</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">
                      Diambil Pada
                    </p>
                    <p className="font-medium">2023-11-20 09:45</p>
                  </div>

                  <div className="border-t pt-4">
                    <Button className="w-full gap-2" type="submit">
                      <Save className="h-4 w-4" />
                      Kirim Hasil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
