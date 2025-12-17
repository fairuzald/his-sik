"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function LabLayout({ children }: { children: ReactNode }) {
  // Staff with Laboratory department can access
  return <RoleGuard allowedDepartments={["lab"]}>{children}</RoleGuard>;
}
