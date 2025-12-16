import {
  Activity,
  Calendar,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  FlaskConical,
  LayoutDashboard,
  type LucideIcon,
  Pill,
  User,
  Users,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const navItems: Record<string, NavItem[]> = {
  patient: [
    { title: "Dasbor", href: "/dashboard/patient", icon: LayoutDashboard },
    { title: "Profil", href: "/dashboard/patient/profile", icon: User },
    { title: "Kunjungan", href: "/dashboard/patient/visits", icon: Calendar },
    {
      title: "Rekam Medis",
      href: "/dashboard/patient/records",
      icon: FileText,
    },
    { title: "Resep", href: "/dashboard/patient/prescriptions", icon: Pill },
    { title: "Hasil Lab", href: "/dashboard/patient/labs", icon: FlaskConical },
    { title: "Tagihan", href: "/dashboard/patient/billing", icon: CreditCard },
    {
      title: "Perangkat Wearable",
      href: "/dashboard/patient/wearables",
      icon: Activity,
    },
  ],
  registration: [
    { title: "Dasbor", href: "/dashboard/registration", icon: LayoutDashboard },
    { title: "Pasien", href: "/dashboard/registration/patients", icon: Users },
    {
      title: "Kunjungan",
      href: "/dashboard/registration/visits",
      icon: Calendar,
    },
  ],
  doctor: [
    { title: "Dasbor", href: "/dashboard/doctor", icon: LayoutDashboard },
    { title: "Antrean Saya", href: "/dashboard/doctor/queue", icon: Users },
    {
      title: "Riwayat Kunjungan",
      href: "/dashboard/doctor/visits",
      icon: Calendar,
    },
  ],
  pharmacy: [
    { title: "Dasbor", href: "/dashboard/pharmacy", icon: LayoutDashboard },
    { title: "Resep", href: "/dashboard/pharmacy/prescriptions", icon: Pill },
    {
      title: "Inventaris",
      href: "/dashboard/pharmacy/inventory",
      icon: Database,
    },
  ],
  lab: [
    { title: "Dasbor", href: "/dashboard/lab", icon: LayoutDashboard },
    { title: "Pesanan Lab", href: "/dashboard/lab/orders", icon: FlaskConical },
    {
      title: "Direktori Tes",
      href: "/dashboard/lab/tests",
      icon: ClipboardList,
    },
  ],
  cashier: [
    { title: "Dasbor", href: "/dashboard/cashier", icon: LayoutDashboard },
    { title: "Faktur", href: "/dashboard/cashier/invoices", icon: CreditCard },
    {
      title: "Pembayaran",
      href: "/dashboard/cashier/payments",
      icon: FileText,
    },
  ],
  admin: [
    { title: "Dasbor", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Pengguna", href: "/dashboard/admin/users", icon: Users },
  ],
};
