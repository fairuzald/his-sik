"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allowedRoles={["admin"]}>{children}</RoleGuard>;
}
