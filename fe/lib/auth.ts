import { client } from "@/sdk/output/client.gen";
import { StaffDepartmentEnum } from "@/sdk/output/types.gen";
import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

// Actual roles from backend: admin, doctor, staff, patient
export type UserRole = "admin" | "doctor" | "staff" | "patient";

// Staff departments (for staff role only)
export type StaffDepartment =
  | "Registration"
  | "Pharmacy"
  | "Laboratory"
  | "Cashier";

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  Cookies.set(AUTH_TOKEN_KEY, accessToken, {
    secure: true,
    sameSite: "Strict",
  });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    secure: true,
    sameSite: "Strict",
  });

  // Update client config immediately
  client.setConfig({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAuthToken = () => {
  return Cookies.get(AUTH_TOKEN_KEY);
};

export const getRefreshToken = () => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const removeAuthTokens = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);

  // Clear client header
  client.setConfig({
    headers: {
      Authorization: "",
    },
  });
};

/**
 * Get dashboard path based on role.
 * For direct roles (admin, doctor, patient): returns their dashboard.
 * For staff: should use getDashboardPathForStaff with department instead.
 */
export const getDashboardPathForRole = (role: string): string => {
  const normalizedRole = role.toLowerCase();

  const roleMap: Record<string, string> = {
    admin: "/dashboard/admin",
    doctor: "/dashboard/doctor",
    patient: "/dashboard/patient",
    // Staff defaults to registration, but should use department-specific function
    staff: "/dashboard",
  };

  return roleMap[normalizedRole] || "/dashboard";
};

/**
 * Get dashboard path based on staff department.
 */
export const getDashboardPathForStaffDepartment = (
  department: StaffDepartmentEnum
): string => {
  const departmentMap: Record<StaffDepartmentEnum, string> = {
    [StaffDepartmentEnum.REGISTRATION]: "/dashboard/registration",
    [StaffDepartmentEnum.PHARMACY]: "/dashboard/pharmacy",
    [StaffDepartmentEnum.LABORATORY]: "/dashboard/lab",
    [StaffDepartmentEnum.CASHIER]: "/dashboard/cashier",
  };

  return departmentMap[department] || "/dashboard";
};
