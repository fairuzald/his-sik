"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { safeApiCall } from "@/lib/api-handler";
import {
  getDashboardPathForRole,
  getDashboardPathForStaffDepartment,
  setAuthTokens,
} from "@/lib/auth";
import {
  getMyProfileApiProfileMeGet,
  loginApiAuthLoginPost,
} from "@/sdk/output/sdk.gen";
import { StaffDepartmentEnum } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);

    // 1. Login
    const loginData = await safeApiCall(
      loginApiAuthLoginPost({
        body: {
          username: data.username,
          password: data.password,
        },
      }),
      {
        errorMessage: "Invalid username or password.",
      }
    );

    if (loginData) {
      setAuthTokens(loginData.access_token, loginData.refresh_token);
      toast.success("Login successful!");

      // 2. Get Profile
      const profileData = await safeApiCall(getMyProfileApiProfileMeGet(), {
        errorMessage: "Failed to fetch profile details",
      });

      if (profileData) {
        const role = profileData.role.toLowerCase();

        // Handle staff users by redirecting based on department
        if (role === "staff" && profileData.details) {
          const staffDetails = profileData.details as {
            department?: StaffDepartmentEnum;
          };
          if (staffDetails.department) {
            const targetPath = getDashboardPathForStaffDepartment(
              staffDetails.department
            );
            router.push(targetPath);
          } else {
            router.push("/dashboard");
          }
        } else {
          // For admin, doctor, patient - use role-based redirect
          const targetPath = getDashboardPathForRole(role);
          router.push(targetPath);
        }
      } else {
        // Fallback
        router.push("/dashboard");
      }
    }

    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Enter your credentials to access the system."
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign Up"
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            disabled={isLoading}
            {...form.register("username")}
            className={
              form.formState.errors.username ? "border-destructive" : ""
            }
          />
          {form.formState.errors.username && (
            <p className="text-destructive text-xs">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Button
              variant="link"
              className="text-muted-foreground h-auto p-0 text-xs font-normal"
              type="button"
              onClick={() =>
                toast.info(
                  "Please contact the administrator to reset your password."
                )
              }
              tabIndex={-1}
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...form.register("password")}
            className={
              form.formState.errors.password ? "border-destructive" : ""
            }
          />
          {form.formState.errors.password && (
            <p className="text-destructive text-xs">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <Button className="mt-6 w-full" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {submitText}...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

const submitText = "Logging in";
