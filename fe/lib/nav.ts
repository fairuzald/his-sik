import {
  Activity,
  Building2,
  Calendar,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  FilePlus2,
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
    { title: "Dashboard", href: "/dashboard/patient", icon: LayoutDashboard },
    { title: "Profile", href: "/dashboard/patient/profile", icon: User },
    { title: "Visits", href: "/dashboard/patient/visits", icon: Calendar },
    {
      title: "Medical Records",
      href: "/dashboard/patient/records",
      icon: FileText,
    },
    {
      title: "Prescriptions",
      href: "/dashboard/patient/prescriptions",
      icon: Pill,
    },
    {
      title: "Lab Results",
      href: "/dashboard/patient/labs",
      icon: FlaskConical,
    },
    {
      title: "My Referrals",
      href: "/dashboard/patient/referrals",
      icon: FilePlus2,
    },
    { title: "Billing", href: "/dashboard/patient/billing", icon: CreditCard },
    {
      title: "Wearables",
      href: "/dashboard/patient/wearables",
      icon: Activity,
    },
  ],
  registration: [
    {
      title: "Dashboard",
      href: "/dashboard/registration",
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      href: "/dashboard/registration/patients",
      icon: Users,
    },
    {
      title: "Visits",
      href: "/dashboard/registration/visits",
      icon: Calendar,
    },
  ],
  doctor: [
    { title: "Dashboard", href: "/dashboard/doctor", icon: LayoutDashboard },
    { title: "My Queue", href: "/dashboard/doctor/queue", icon: Users },
    {
      title: "Visit History",
      href: "/dashboard/doctor/visits",
      icon: Calendar,
    },
    {
      title: "Referrals",
      href: "/dashboard/doctor/referrals",
      icon: FilePlus2,
    },
  ],
  pharmacy: [
    { title: "Dashboard", href: "/dashboard/pharmacy", icon: LayoutDashboard },
    {
      title: "Prescriptions",
      href: "/dashboard/pharmacy/prescriptions",
      icon: Pill,
    },
    {
      title: "Inventory",
      href: "/dashboard/pharmacy/inventory",
      icon: Database,
    },
  ],
  lab: [
    { title: "Dashboard", href: "/dashboard/lab", icon: LayoutDashboard },
    { title: "Lab Orders", href: "/dashboard/lab/orders", icon: FlaskConical },
    {
      title: "Test Directory",
      href: "/dashboard/lab/tests",
      icon: ClipboardList,
    },
  ],
  cashier: [
    { title: "Dashboard", href: "/dashboard/cashier", icon: LayoutDashboard },
    {
      title: "Invoices",
      href: "/dashboard/cashier/invoices",
      icon: CreditCard,
    },
    {
      title: "Payments",
      href: "/dashboard/cashier/payments",
      icon: FileText,
    },
  ],
  admin: [
    { title: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Users", href: "/dashboard/admin/users", icon: Users },
    { title: "Clinics", href: "/dashboard/admin/clinics", icon: Building2 },
  ],
};
