"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PharmacyPrescriptionDetailPage() {
  const params = useParams();

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/pharmacy/prescriptions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Proses Resep
          </H2>
          <P className="text-muted-foreground">ID: {params.id}</P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-lg">Daftar Obat</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obat</TableHead>
                  <TableHead>Dosis</TableHead>
                  <TableHead>Jml</TableHead>
                  <TableHead>Status Stok</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    Amoxicillin 500mg
                  </TableCell>
                  <TableCell>3x1</TableCell>
                  <TableCell>15</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-600"
                    >
                      Tersedia
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="secondary">
                      Siapkan
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Paracetamol 500mg
                  </TableCell>
                  <TableCell>3x1 (prn)</TableCell>
                  <TableCell>10</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-green-200 bg-green-50 text-green-600"
                    >
                      Tersedia
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="secondary">
                      Siapkan
                    </Button>
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
                Info Pesanan
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
                  Dokter
                </p>
                <p className="font-medium">Dr. Sarah Wilson</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">
                  Tanggal
                </p>
                <p className="font-medium">2023-11-20 10:00</p>
              </div>

              <div className="border-t pt-4">
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4" />
                  Selesaikan Pesanan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
