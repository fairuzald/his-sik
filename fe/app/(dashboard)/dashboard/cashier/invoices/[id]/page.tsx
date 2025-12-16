"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, CreditCard, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CashierInvoiceDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/cashier/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Proses Pembayaran
          </H2>
          <P className="text-muted-foreground">ID Faktur: {params.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">Item Faktur</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Biaya Konsultasi - Dr. Sarah Wilson</TableCell>
                  <TableCell className="text-right">Rp 500.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tes Lab (Hitung Darah Lengkap)</TableCell>
                  <TableCell className="text-right">Rp 750.000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Obat-obatan (Amoxicillin, Paracetamol)</TableCell>
                  <TableCell className="text-right">Rp 250.000</TableCell>
                </TableRow>
                <TableRow className="bg-muted/5 border-t-2 font-bold">
                  <TableCell>Subtotal</TableCell>
                  <TableCell className="text-right">Rp 1.500.000</TableCell>
                </TableRow>
                <TableRow className="font-bold">
                  <TableCell>Total Tagihan</TableCell>
                  <TableCell className="text-primary text-right text-xl">
                    Rp 1.500.000
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Detail Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>Metode Pembayaran</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="card">Kartu Kredit/Debit</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                    <SelectItem value="insurance">Asuransi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Jumlah Dibayarkan</Label>
                <Input placeholder="Rp 0" />
              </div>

              <div className="space-y-3 border-t pt-4">
                <Button className="w-full gap-2">
                  <CreditCard className="h-4 w-4" />
                  Konfirmasi Pembayaran
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Printer className="h-4 w-4" />
                  Cetak Faktur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
