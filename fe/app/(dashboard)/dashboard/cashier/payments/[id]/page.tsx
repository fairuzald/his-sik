"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Printer } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentDetailPage() {
  const params = useParams();
  const id = params.id as string;

  // Mock data - in real app fetch based on ID
  const payment = {
    id: id,
    invoiceId: "INV-" + id.split("-")[1],
    date: "2023-11-20 14:30",
    patient: "Alice Johnson",
    patientId: "P-12345",
    method: "Kartu Kredit",
    status: "Sukses",
    items: [
      { description: "Biaya Konsultasi", amount: 150000 },
      { description: "Paracetamol 500mg (10 tabs)", amount: 50000 },
      { description: "Amoxicillin 500mg (15 caps)", amount: 75000 },
    ],
    subtotal: 275000,
    tax: 27500,
    total: 302500,
  };

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/cashier/payments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Kwitansi Pembayaran
            </H2>
            <P className="text-muted-foreground">{payment.id}</P>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Cetak
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Unduh PDF
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b text-center">
            <CardTitle className="text-primary text-xl">
              MediCare Clinic
            </CardTitle>
            <P className="text-muted-foreground text-sm">
              123 Health Street, Medical District
            </P>
            <P className="text-muted-foreground text-sm">
              Phone: (021) 555-0123
            </P>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="flex justify-between">
              <div className="space-y-1">
                <Small className="text-muted-foreground">
                  Ditagihkan Kepada
                </Small>
                <p className="font-medium">{payment.patient}</p>
                <p className="text-sm text-gray-500">ID: {payment.patientId}</p>
              </div>
              <div className="space-y-1 text-right">
                <Small className="text-muted-foreground">
                  Detail Pembayaran
                </Small>
                <p className="text-sm">
                  <span className="text-muted-foreground">Tanggal:</span>{" "}
                  {payment.date}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Metode:</span>{" "}
                  {payment.method}
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 border-green-200 bg-green-50 text-green-700"
                >
                  {payment.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-12 text-sm font-medium text-gray-500">
                <div className="col-span-8">Deskripsi</div>
                <div className="col-span-4 text-right">Jumlah</div>
              </div>
              {payment.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 text-sm">
                  <div className="col-span-8">{item.description}</div>
                  <div className="col-span-4 text-right">
                    Rp {item.amount.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rp {payment.subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pajak (10%)</span>
                <span>Rp {payment.tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Dibayar</span>
                <span className="text-primary">
                  Rp {payment.total.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="pt-8 text-center">
              <P className="text-muted-foreground text-sm">
                Terima kasih telah memilih MediCare.
              </P>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
