"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["doctor"]}>{children}</RoleGuard>;
}
