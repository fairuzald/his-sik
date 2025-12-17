import { client } from "@/sdk/output/client.gen";
import Cookies from "js-cookie";

export const AUTH_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export type UserRole =
  | "admin"
  | "doctor"
  | "nurse"
  | "registration"
  | "staff"
  | "patient"
  | "pharmacy"
  | "pharmacist"
  | "lab"
  | "cashier";

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

export const getDashboardPathForRole = (role: string): string => {
  const normalizeRole = role.toLowerCase();

  const roleMap: Record<string, string> = {
    admin: "/dashboard/admin",
    doctor: "/dashboard/doctor",
    header_nurse: "/dashboard/registration",
    nurse: "/dashboard/registration",
    registration: "/dashboard/registration",
    staff: "/dashboard/registration",
    patient: "/dashboard/patient",
    pharmacy: "/dashboard/pharmacy",
    pharmacist: "/dashboard/pharmacy",
    lab: "/dashboard/lab",
    cashier: "/dashboard/cashier",
  };

  if (roleMap[normalizeRole]) {
    return roleMap[normalizeRole];
  }

  // Partial match fallback
  if (normalizeRole.includes("registration")) return "/dashboard/registration";
  if (normalizeRole.includes("pharmacy")) return "/dashboard/pharmacy";
  if (normalizeRole.includes("lab")) return "/dashboard/lab";
  if (normalizeRole.includes("cashier")) return "/dashboard/cashier";

  return "/dashboard";
};
