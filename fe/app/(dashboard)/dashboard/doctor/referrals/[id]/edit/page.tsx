"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { safeApiCall } from "@/lib/api-handler";
import {
  getReferralApiReferralsReferralIdGet,
  updateReferralApiReferralsReferralIdPatch,
} from "@/sdk/output/sdk.gen";
import { ReferralDto } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const referralSchema = z.object({
  referred_to_facility: z.string().min(1, "Facility name is required"),
  specialty: z.string().optional(),
  reason: z.string().min(1, "Reason for referral is required"),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
  referral_status: z.string().min(1, "Status is required"),
});

type ReferralFormValues = z.infer<typeof referralSchema>;

export default function EditReferralPage() {
  const params = useParams();
  const router = useRouter();
  const referralId = params.id as string;
  const [referral, setReferral] = useState<ReferralDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      referred_to_facility: "",
      specialty: "",
      reason: "",
      diagnosis: "",
      notes: "",
      referral_status: "pending",
    },
  });

  useEffect(() => {
    const fetchReferral = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        getReferralApiReferralsReferralIdGet({
          path: { referral_id: referralId },
        })
      );
      if (result) {
        setReferral(result);
        form.reset({
          referred_to_facility: result.referred_to_facility,
          specialty: result.specialty || "",
          reason: result.reason,
          diagnosis: result.diagnosis || "",
          notes: result.notes || "",
          referral_status: result.referral_status,
        });
      }
      setIsLoading(false);
    };
    fetchReferral();
  }, [referralId, form]);

  const onSubmit = async (data: ReferralFormValues) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      updateReferralApiReferralsReferralIdPatch({
        path: { referral_id: referralId },
        body: {
          referred_to_facility: data.referred_to_facility,
          specialty: data.specialty || undefined,
          reason: data.reason,
          diagnosis: data.diagnosis || undefined,
          notes: data.notes || undefined,
          referral_status: data.referral_status,
        },
      }),
      { successMessage: "Referral updated successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/doctor/referrals");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!referral) {
    return <div className="p-8 text-center">Referral not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/doctor/referrals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Edit Referral
          </H2>
          <P className="text-muted-foreground">
            Update referral information
          </P>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">
              Referral Destination
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="referred_to_facility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., ABC Specialist Hospital"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialty</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Cardiology, Neurology"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Clinical Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Referral *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the reason for this referral"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Current diagnosis or suspected condition"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information for the receiving facility"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Status</h3>
            <FormField
              control={form.control}
              name="referral_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referral Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/doctor/referrals")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Update Referral
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
