"use client";

import { AutoBreadcrumbs } from "@/components/dashboard/AutoBreadcrumbs";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Determine the navigation role for sidebar
  // For staff users, map department to navigation key
  let navRole = user?.role || "";
  if (user?.role === "staff" && user.details) {
    const staffDetails = user.details as { department?: string };
    const department = staffDetails?.department;

    // Map department to navigation key
    if (department === "Laboratory") {
      navRole = "lab";
    } else if (department === "Pharmacy") {
      navRole = "pharmacy";
    } else if (department === "Registration") {
      navRole = "registration";
    } else if (department === "Cashier") {
      navRole = "cashier";
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <Sidebar role={navRole} />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <AutoBreadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
