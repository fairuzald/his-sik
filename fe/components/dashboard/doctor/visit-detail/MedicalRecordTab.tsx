"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { safeApiCall } from "@/lib/api-handler";
import {
  createMedicalRecordApiMedicalRecordsPost,
  updateMedicalRecordApiMedicalRecordsRecordIdPatch,
} from "@/sdk/output/sdk.gen";
import { MedicalRecordDto } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface MedicalRecordTabProps {
  visitId: string;
  medicalRecord: MedicalRecordDto | null;
  onUpdate: (record: MedicalRecordDto) => void;
}

const medicalRecordSchema = z.object({
  anamnesis: z.string().min(1, "Anamnesis is required"),
  diagnosis: z.string().min(1, "Diagnosis is required"),
  physical_exam: z.string().optional(),
  treatment_plan: z.string().optional(),
});

type MedicalRecordFormValues = z.infer<typeof medicalRecordSchema>;

export function MedicalRecordTab({
  visitId,
  medicalRecord,
  onUpdate,
}: MedicalRecordTabProps) {
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordSchema),
    defaultValues: {
      anamnesis: "",
      diagnosis: "",
      physical_exam: "",
      treatment_plan: "",
    },
  });

  // Update form values when medicalRecord prop changes
  useEffect(() => {
    if (medicalRecord) {
      form.reset({
        anamnesis: medicalRecord.anamnesis || "",
        diagnosis: medicalRecord.diagnosis || "",
        physical_exam: medicalRecord.physical_exam || "",
        treatment_plan: medicalRecord.treatment_plan || "",
      });
    } else {
      // Only reset if we truly want to clear it, but usually typically we keep it unless visitId changes.
      // Assuming this component is remounted or prop changes significantly.
      // If visitId changes, we might want to reset.
    }
  }, [medicalRecord, form]);

  const onSubmit = async (data: MedicalRecordFormValues) => {
    setIsSaving(true);
    try {
      if (medicalRecord) {
        // Update
        const updated = await safeApiCall(
          updateMedicalRecordApiMedicalRecordsRecordIdPatch({
            path: { record_id: medicalRecord.id },
            body: {
              anamnesis: data.anamnesis,
              diagnosis: data.diagnosis,
              physical_exam: data.physical_exam,
              treatment_plan: data.treatment_plan,
            },
          }),
          { successMessage: "Medical record updated" }
        );
        if (updated) onUpdate(updated as MedicalRecordDto);
      } else {
        // Create
        const created = await safeApiCall(
          createMedicalRecordApiMedicalRecordsPost({
            body: {
              visit_id: visitId,
              anamnesis: data.anamnesis,
              diagnosis: data.diagnosis,
              physical_exam: data.physical_exam,
              treatment_plan: data.treatment_plan,
            },
          }),
          { successMessage: "Medical record created" }
        );
        if (created) onUpdate(created as MedicalRecordDto);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-muted/20 border-b">
        <CardTitle className="text-primary text-lg">Clinical Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="anamnesis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Anamnesis / Chief Complaint</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Patient's chief complaint..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Input placeholder="ICD-10 or description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="physical_exam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vitals (Physical Exam)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="BP, HR, Temp, Weight, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="treatment_plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treatment Plan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Action plan, medication strategy..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Record
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
