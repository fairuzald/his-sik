"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function RegistrationLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Staff with Registration department can access
  return (
    <RoleGuard allowedDepartments={["registration"]}>{children}</RoleGuard>
  );
}
