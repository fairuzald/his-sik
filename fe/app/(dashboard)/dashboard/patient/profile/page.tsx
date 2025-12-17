"use client";

import { H2, Muted, P } from "@/components/elements/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getMyProfileApiProfileMeGet } from "@/sdk/output/sdk.gen";
import { PatientProfileDao, UserProfileDao } from "@/sdk/output/types.gen";
import { Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<UserProfileDao | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfileApiProfileMeGet();
        if (response.data?.success && response.data.data) {
          setProfile(response.data.data);
        } else {
          // If failed, maybe redirect to login? handled by auth guard usually
          toast.error("Failed to load profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  // Cast details to PatientProfileDao safely if role is patient
  const patientDetails = profile.details as PatientProfileDao | undefined;

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            My Profile
          </H2>
          <P className="text-muted-foreground mt-1">
            Manage your personal information and settings.
          </P>
        </div>
        <Button className="w-full gap-2 shadow-sm md:w-auto" asChild>
          <Link href="/dashboard/patient/profile/edit">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        <Card className="border-t-primary h-fit border-t-4 shadow-md">
          <CardHeader className="pb-2 text-center">
            <div className="relative mx-auto mb-4 h-32 w-32">
              <Avatar className="border-muted h-full w-full border-4">
                <AvatarImage
                  src={profile.photo_url || ""}
                  alt={profile.full_name}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                  {profile.full_name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
            <CardDescription className="text-primary font-medium">
              @{profile.username}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-1 text-center">
              <Muted className="text-xs font-semibold uppercase tracking-wider">
                Email
              </Muted>
              <P className="text-sm font-medium">{profile.email || "-"}</P>
            </div>
            <div className="grid gap-1 text-center">
              <Muted className="text-xs font-semibold uppercase tracking-wider">
                Phone
              </Muted>
              <P className="text-sm font-medium">
                {profile.phone_number || "-"}
              </P>
            </div>
            <div className="grid gap-1 text-center">
              <Muted className="text-xs font-semibold uppercase tracking-wider">
                Role
              </Muted>
              <P className="text-sm font-medium capitalize">{profile.role}</P>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-xl">
                Personal Information
              </CardTitle>
              <CardDescription>
                Your official identification details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">NIK</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.nik || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">BPJS Number</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.bpjs_number || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Birth Date</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.date_of_birth || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Gender</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.gender === "L"
                      ? "Male"
                      : patientDetails?.gender === "P"
                        ? "Female"
                        : patientDetails?.gender || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Blood Type</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.blood_type || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-xl">
                Address & Contact
              </CardTitle>
              <CardDescription>Where we can reach you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Full Address</Label>
                <div className="bg-muted/30 rounded-md border p-2 font-medium">
                  {patientDetails?.address || "-"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-primary text-xl">
                Emergency Contact
              </CardTitle>
              <CardDescription>
                Who to contact in case of emergency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Name</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.emergency_contact_name || "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientDetails?.emergency_contact_phone || "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
