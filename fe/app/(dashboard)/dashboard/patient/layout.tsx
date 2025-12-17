"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["patient"]}>{children}</RoleGuard>;
}
