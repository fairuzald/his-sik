"use client";

import { Muted, Span } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  Calendar,
  Check,
  ClipboardList,
  Clock,
  Database,
  FileText,
  Heart,
  Shield,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Pendaftaran Pasien",
    description:
      "Pendaftaran pasien cepat dengan pengambilan informasi demografis dan asuransi yang komprehensif.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Alur Kerja Klinis",
    description:
      "Alur kerja dokter yang efisien dengan manajemen antrean cerdas dan data pasien waktu nyata.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Calendar,
    title: "Penjadwalan Cerdas",
    description:
      "Pemesanan janji temu bertenaga AI dengan pengingat otomatis dan alokasi sumber daya yang optimal.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: ClipboardList,
    title: "Rekam Kesehatan Digital",
    description:
      "Sistem EMR komprehensif dengan akses instan ke riwayat pasien di seluruh departemen.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: Activity,
    title: "Manajemen Laboratorium",
    description:
      "Alur kerja laboratorium lengkap mulai dari pemesanan tes hingga pelaporan hasil dengan kontrol kualitas.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Shield,
    title: "Keamanan & Kepatuhan",
    description:
      "Infrastruktur yang mematuhborder-green-200 border bg-green-50 text-green-600een-600ak audit yang komprehensif.",
    color: "bg-red-50 text-red-600",
  },
];

const benefits = [
  {
    icon: TrendingUp,
    title: "Meningkatkan Efisiensi",
    description:
      "Kurangi beban kerja administratif hingga 40% dengan alur kerja otomatis",
  },
  {
    icon: Clock,
    title: "Hemat Waktu",
    description:
      "Rata-rata 30 menit dihemat per kunjungan pasien melalui proses yang efisien",
  },
  {
    icon: FileText,
    title: "Rekaman Lebih Baik",
    description:
      "Akurasi data 99,9% dengan rekam kesehatan elektronik terpusat",
  },
  {
    icon: Database,
    title: "Wawasan Data",
    description:
      "Analitik dan pelaporan waktu nyata untuk pengambilan keputusan yang lebih baik",
  },
];

const workflow = [
  {
    step: "01",
    title: "Pendaftaran Pasien",
    description:
      "Check-in pasien cepat dan mudah dengan formulir digital dan verifikasi asuransi",
  },
  {
    step: "02",
    title: "Manajemen Antrean",
    description:
      "Perutean pasien cerdas berdasarkan urgensi, spesialisasi, dan ketersediaan sumber daya",
  },
  {
    step: "03",
    title: "Perawatan Klinis",
    description:
      "Dokter mengakses rekam medis pasien lengkap, meresepkan perawatan, dan memesan tes",
  },
  {
    step: "04",
    title: "Lab & Farmasi",
    description: "Integrasi mulus untuk pemrosesan tes lab dan pemberian obat",
  },
  {
    step: "05",
    title: "Penagihan & Laporan",
    description:
      "Penagihan otomatis, klaim asuransi, dan pelaporan komprehensif",
  },
];

const stats = [
  { value: "10,000+", label: "Pasien Aktif", icon: Users },
  { value: "500+", label: "Staf Kesehatan", icon: Stethoscope },
  { value: "99.9%", label: "Waktu Operasional Sistem", icon: Activity },
  { value: "24/7", label: "Dukungan Tersedia", icon: Clock },
];

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-blue-100/20 blur-3xl" />
        <div className="absolute -left-40 top-60 h-80 w-80 rounded-full bg-cyan-100/20 blur-3xl" />
        <div className="absolute bottom-40 right-60 h-80 w-80 rounded-full bg-blue-50/30 blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="bg-card/95 fixed top-0 z-50 w-full border-b shadow-sm backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="MediCare Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div>
              <Span level="xl" weight="bold" colorStyle="primary">
                MediCare
              </Span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild className="shadow-md">
              <Link href="/login">Mulai</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container relative mx-auto px-4 pb-20 pt-32">
        <div className="text-center">
          <div className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm">
            <Activity className="text-primary h-4 w-4 animate-pulse" />
            <span className="text-primary">
              Platform Manajemen Kesehatan Perusahaan
            </span>
          </div>

          <h1 className="text-foreground mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Transformasikan Rumah Sakit Anda
            <br />
            <span className="text-primary relative inline-block">
              Menjadi Keunggulan Digital
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5h-8 border-yellow-200 border text-yellow-800 hover:bg-yellow-100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-primary/30"
                />
              </svg>
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg leading-relaxed md:text-xl">
            Sistem Informasi Rumah Sakit komprehensif yang dirancang untuk
            fasilitas kesehatan modern. Efisienkan operasi, tingkatkan perawatan
            pasien, dan perbaiki hasil klinis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="gap-2 shadow-lg" asChild>
              <Link href="/login">
                Akses Sistem
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Pelajari Lebih Lanjut</Link>
            </Button>
          </div>

          {/* Decorative Elements */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <div className="bg-muted/50 aspect-video overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                  <Heart className="text-primary mx-auto mb-4 h-20 w-20 opacity-20" />
                  <p className="text-muted-foreground font-medium">
                    Pratinjau Dasbor
                  </p>
                </div>
              </div>
            </div>
            {/* Floating cards decoration */}
            <div className="absolute -right-4 top-4 hidden lg:block">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-green-100">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Aktif</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="absolute -left-4 bottom-4 hidden lg:block">
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="text-primary h-5 w-5" />
                    <span className="text-sm font-medium">10rb+ Pasien</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="mx-auto mb-2 h-8 w-8 text-white/80" />
                <div className="mb-1 text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold">
              Mengapa Memilih MediCare?
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Hasil terbukti dari fasilitas kesehatan yang sudah menggunakan
              platform kami
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-l-primary/50 hover:border-l-primary group border-l-4 shadow-md transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="bg-primary/10 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg">
                    <benefit.icon className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-2 text-lg font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold">
              Solusi Kesehatan Lengkap
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Modul terintegrasi yang mencakup setiap aspek operasi rumah sakit
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:border-primary/30 group overflow-hidden border-2 transition-all hover:shadow-xl"
              >
                <CardHeader>
                  <div
                    className={`mb-3 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}
                  >
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-foreground text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="text-foreground mb-4 text-4xl font-bold">
              Cara Kerja
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Perjalanan pasien yang mulus dari pendaftaran hingga pemulangan
            </p>
          </div>
          <div className="relative">
            {/* Connection line */}
            <div className="from-primary/20 via-primary to-primary/20 absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b lg:block" />

            <div className="space-y-8">
              {workflow.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "flex-row lg:flex" : "lg:flex-row-reverse"}`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "" : "lg:text-right"}`}
                  >
                    <Card className="shadow-md transition-all hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="text-primary text-4xl font-bold">
                            {item.step}
                          </span>
                          <h3 className="text-foreground text-xl font-semibold">
                            {item.title}
                          </h3>
                        </div>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative z-10 hidden lg:block">
                    <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                      <div className="h-4 w-4 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="hidden flex-1 lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary relative overflow-hidden py-20">
        <div className="bg-radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1) bg-transparent_50%) absolute inset-0" />
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Siap Mengubah Fasilitas Kesehatan Anda?
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            Bergabunglah dengan rumah sakit terkemuka yang memberikan perawatan
            pasien luar biasa dengan MediCare
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="secondary" className="shadow-xl" asChild>
              <Link href="/login">Mulai Sekarang</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border border-white bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              asChild
            >
              <Link href="/login">Jadwalkan Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="MediCare Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
                <Span level="lg" weight="bold" colorStyle="primary">
                  MediCare
                </Span>
              </div>
              <Muted>
                Sistem Informasi Rumah Sakit Profesional untuk fasilitas
                kesehatan modern.
              </Muted>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">Produk</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="#features"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Modul
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Keamanan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">Perusahaan</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Tentang
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Dukungan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground mb-4 font-semibold">Hukum</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Privasi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Syarat
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Kepatuhan
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            © 2024 MediCare. Hak cipta dilindungi undang-undang. • Dibangun
            untuk keunggulan kesehatan
          </div>
        </div>
      </footer>
    </div>
  );
}
