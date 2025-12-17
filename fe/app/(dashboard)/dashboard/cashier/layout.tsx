"use client";

import { RoleGuard } from "@/components/guards/RoleGuard";
import { ReactNode } from "react";

export default function CashierLayout({ children }: { children: ReactNode }) {
  // Staff with Cashier department can access
  return <RoleGuard allowedDepartments={["cashier"]}>{children}</RoleGuard>;
}
