"use client";

import { H2, P, Small } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { medicalRecords, patients, visits } from "@/data/mock-data";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PatientDetailPage() {
  const params = useParams();
  const patient = patients.find(p => p.id === params.id) || patients[0]; // Fallback for demo

  if (!patient) {
    return <div>Patient not found</div>;
  }

  // Find visits for this patient
  const patientVisits = visits.filter(v => v.patient_id === patient.id);
  const patientVisitIds = patientVisits.map(v => v.id);

  // Find medical records for these visits
  const patientRecords = medicalRecords.filter(r =>
    patientVisitIds.includes(r.visit_id)
  );

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/registration/patients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Patient Details
          </H2>
          <P className="text-muted-foreground">
            MRN: {patient.medical_record_number}
          </P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium">
                Personal Information
              </CardTitle>
              <Badge
                variant={patient.status === "Aktif" ? "default" : "secondary"}
              >
                {patient.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <User className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Full Name</Small>
                <P className="font-medium">{patient.full_name}</P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CreditCard className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">ID Number</Small>
                <P className="font-medium">{patient.nik}</P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Date of Birth</Small>
                <P className="font-medium">
                  {patient.birth_date} ({patient.gender})
                </P>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b pb-2">
            <CardTitle className="text-lg font-medium">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <Phone className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Phone Number</Small>
                <P className="font-medium">{patient.phone_number}</P>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="text-muted-foreground mt-0.5 h-5 w-5" />
              <div>
                <Small className="text-muted-foreground">Address</Small>
                <P className="font-medium">{patient.full_address}</P>
                <P className="text-muted-foreground text-sm">{patient.city}</P>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b pb-2">
          <CardTitle className="text-lg font-medium">Medical Records</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {patientRecords.length > 0 ? (
            <div className="space-y-6">
              {patientRecords.map(record => (
                <div
                  key={record.id}
                  className="border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="text-primary mt-1 h-5 w-5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <P className="font-semibold">
                          {record.primary_diagnosis}
                        </P>
                        <Badge variant="outline">{record.date}</Badge>
                      </div>
                      <P className="text-muted-foreground text-sm">
                        Doctor: {record.doctor_name}
                      </P>
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <div className="bg-muted/30 rounded p-2">
                          <Small className="text-muted-foreground font-semibold">
                            Anamnesis
                          </Small>
                          <P className="text-sm">{record.anamnesis}</P>
                        </div>
                        <div className="bg-muted/30 rounded p-2">
                          <Small className="text-muted-foreground font-semibold">
                            Treatment Plan
                          </Small>
                          <P className="text-sm">{record.treatment_plan}</P>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <P className="text-muted-foreground py-4 text-center">
              No medical records found for this patient.
            </P>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
