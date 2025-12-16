"use client";

import { H1, Small } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      const roleMap: Record<string, string> = {
        admin: "/dashboard/admin",
        doctor: "/dashboard/doctor",
        nurse: "/dashboard/registration",
        registration: "/dashboard/registration",
        patient: "/dashboard/patient",
        pharmacy: "/dashboard/pharmacy",
        pharmacist: "/dashboard/pharmacy",
        lab: "/dashboard/lab",
        cashier: "/dashboard/cashier",
      };

      const targetPath = roleMap[username.toLowerCase()];

      if (targetPath) {
        toast.success(`Selamat datang kembali, ${username}!`);
        router.push(targetPath);
      } else {
        router.push("/dashboard");
        if (username) {
          toast.error(
            "Nama pengguna tidak valid atau pemetaan peran tidak ditemukan."
          );
        } else {
          toast.error("Silakan masukkan nama pengguna.");
        }
      }
    }, 1000);
  };

  return (
    <div className="bg-muted/20 flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
            <H1 className="text-primary text-center text-2xl font-bold">
              MediCare
            </H1>
          </CardTitle>
          <CardDescription className="text-center">
            Masukkan kredensial Anda untuk mengakses sistem
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nama Pengguna</Label>
              <Input
                id="username"
                placeholder="admin, dokter, pasien, dll."
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-muted-foreground text-xs">
                Coba: admin, dokter, pasien, pendaftaran, farmasi, lab, kasir
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Masuk..." : "Masuk"}
            </Button>
            <div className="text-center">
              <Button
                variant="link"
                className="text-muted-foreground"
                type="button"
              >
                <Small>Lupa kata sandi?</Small>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
