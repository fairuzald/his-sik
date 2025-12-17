"use client";

import { getDashboardPathForRole } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { StaffDepartmentEnum } from "@/sdk/output/types.gen";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

// Role is one of: admin, doctor, staff, patient
// For staff, the department determines access: Registration, Pharmacy, Laboratory, Cashier
export type AllowedRole = "admin" | "doctor" | "patient";
export type AllowedDepartment = "registration" | "pharmacy" | "lab" | "cashier";

interface RoleGuardProps {
  children: ReactNode;
  /** Allowed user roles (admin, doctor, patient) */
  allowedRoles?: AllowedRole[];
  /** Allowed staff departments (for staff role only) */
  allowedDepartments?: AllowedDepartment[];
  fallbackPath?: string;
}

/**
 * Maps frontend department keys to SDK StaffDepartmentEnum values
 */
const departmentMap: Record<AllowedDepartment, StaffDepartmentEnum> = {
  registration: StaffDepartmentEnum.REGISTRATION,
  pharmacy: StaffDepartmentEnum.PHARMACY,
  lab: StaffDepartmentEnum.LABORATORY,
  cashier: StaffDepartmentEnum.CASHIER,
};

/**
 * RoleGuard component that protects routes based on user roles and staff departments.
 * - For admin, doctor, patient: checks the role field
 * - For staff: checks the department in details.department
 */
export function RoleGuard({
  children,
  allowedRoles = [],
  allowedDepartments = [],
  fallbackPath,
}: RoleGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    const userRole = user.role.toLowerCase();
    let isAllowed = false;

    // Check if user role is directly allowed (admin, doctor, patient)
    if (allowedRoles.length > 0) {
      isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
    }

    // If not directly allowed, check if user is staff with allowed department
    if (!isAllowed && userRole === "staff" && allowedDepartments.length > 0) {
      // Get department from user details
      const staffDetails = user.details as {
        department?: StaffDepartmentEnum;
      } | null;
      const userDepartment = staffDetails?.department;

      if (userDepartment) {
        isAllowed = allowedDepartments.some(
          dept => departmentMap[dept] === userDepartment
        );
      }
    }

    // If not allowed, redirect to appropriate dashboard
    if (!isAllowed) {
      // Determine correct path based on role and department
      let correctPath = fallbackPath;
      if (!correctPath) {
        if (userRole === "staff" && user.details) {
          const staffDetails = user.details as {
            department?: StaffDepartmentEnum;
          };
          const dept = staffDetails?.department;
          if (dept === StaffDepartmentEnum.REGISTRATION) {
            correctPath = "/dashboard/registration";
          } else if (dept === StaffDepartmentEnum.PHARMACY) {
            correctPath = "/dashboard/pharmacy";
          } else if (dept === StaffDepartmentEnum.LABORATORY) {
            correctPath = "/dashboard/lab";
          } else if (dept === StaffDepartmentEnum.CASHIER) {
            correctPath = "/dashboard/cashier";
          } else {
            correctPath = "/dashboard";
          }
        } else {
          correctPath = getDashboardPathForRole(user.role);
        }
      }
      router.replace(correctPath);
    }
  }, [
    user,
    isLoading,
    isAuthenticated,
    allowedRoles,
    allowedDepartments,
    fallbackPath,
    router,
  ]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, show loading (redirect will happen)
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Check authorization before rendering
  const userRole = user.role.toLowerCase();
  let isAllowed = false;

  if (allowedRoles.length > 0) {
    isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
  }

  if (!isAllowed && userRole === "staff" && allowedDepartments.length > 0) {
    const staffDetails = user.details as {
      department?: StaffDepartmentEnum;
    } | null;
    const userDepartment = staffDetails?.department;

    if (userDepartment) {
      isAllowed = allowedDepartments.some(
        dept => departmentMap[dept] === userDepartment
      );
    }
  }

  if (!isAllowed) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
