"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function PharmacyLayout({ children }: { children: ReactNode }) {
  // Staff with Pharmacy department can access
  return <RoleGuard allowedDepartments={["pharmacy"]}>{children}</RoleGuard>;
}
