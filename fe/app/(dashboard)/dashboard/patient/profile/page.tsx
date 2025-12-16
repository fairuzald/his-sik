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
import { patientProfile } from "@/data/mock-data";
import { Edit } from "lucide-react";
import Link from "next/link";

export default function PatientProfilePage() {
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
                <AvatarImage src="/avatars/01.png" alt={patientProfile.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                  {patientProfile.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{patientProfile.name}</CardTitle>
            <CardDescription className="text-primary font-medium">
              Patient ID: {patientProfile.id}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-1 text-center">
              <Muted className="text-xs font-semibold uppercase tracking-wider">
                Email
              </Muted>
              <P className="text-sm font-medium">{patientProfile.email}</P>
            </div>
            <div className="grid gap-1 text-center">
              <Muted className="text-xs font-semibold uppercase tracking-wider">
                Phone
              </Muted>
              <P className="text-sm font-medium">{patientProfile.phone}</P>
            </div>
            <div className="grid gap-1 text-center">
              <Muted className="text-xs font-semibold uppercase tracking-wider">
                Member Since
              </Muted>
              <P className="text-sm font-medium">
                {patientProfile.memberSince}
              </P>
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
                    {patientProfile.nik}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">BPJS Number</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.bpjs}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Birth Date</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.birthDate}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Gender</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.gender}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Blood Type</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.bloodType}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">
                    Marital Status
                  </Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.maritalStatus}
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
                  {patientProfile.address}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">City</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.city}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Province</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.province}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Postal Code</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.postalCode}
                  </div>
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Name</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.emergencyContact.name}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Relationship</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.emergencyContact.relationship}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <div className="bg-muted/30 rounded-md border p-2 font-medium">
                    {patientProfile.emergencyContact.phone}
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
