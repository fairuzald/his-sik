import { H1, H3, Muted, Small } from "@/components/elements/typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  FlaskConical,
  Pill,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

const roles = [
  {
    name: "Pasien",
    href: "/dashboard/patient",
    icon: User,
    color: "text-blue-500",
  },
  {
    name: "Pendaftaran",
    href: "/dashboard/registration",
    icon: Users,
    color: "text-green-500",
  },
  {
    name: "Dokter",
    href: "/dashboard/doctor",
    icon: Stethoscope,
    color: "text-teal-500",
  },
  {
    name: "Farmasi",
    href: "/dashboard/pharmacy",
    icon: Pill,
    color: "text-purple-500",
  },
  {
    name: "Lab",
    href: "/dashboard/lab",
    icon: FlaskConical,
    color: "text-red-500",
  },
  {
    name: "Kasir",
    href: "/dashboard/cashier",
    icon: CreditCard,
    color: "text-yellow-500",
  },
  {
    name: "Admin",
    href: "/dashboard/admin",
    icon: ShieldCheck,
    color: "text-gray-500",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <H1 className="text-3xl font-bold tracking-tight">
          Selamat datang di MediCare
        </H1>
        <Muted>Pilih peran untuk melihat dasbor.</Muted>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roles.map(role => {
          const Icon = role.icon;
          return (
            <Link key={role.name} href={role.href}>
              <Card className="hover:bg-muted/50 h-full cursor-pointer transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {role.name}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${role.color}`} />
                </CardHeader>
                <CardContent>
                  <H3 className="text-2xl font-bold">Dasbor</H3>
                  <Small className="text-muted-foreground">
                    Akses portal {role.name}
                  </Small>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
