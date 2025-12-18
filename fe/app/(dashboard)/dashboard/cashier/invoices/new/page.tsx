"use client";

import { H2, P } from "@/components/elements/typography";
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
  createInvoiceApiInvoicesPost,
  listVisitsApiVisitsGet,
} from "@/sdk/output/sdk.gen";
import { VisitDto } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const invoiceSchema = z.object({
  visit_id: z.string().min(1, "Visit is required"),
  notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export default function NewInvoicePage() {
  const router = useRouter();
  const [visits, setVisits] = useState<VisitDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      visit_id: "",
      notes: "",
    },
  });

  useEffect(() => {
    const fetchVisits = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listVisitsApiVisitsGet({ query: { limit: 100 } })
      );
      if (result) {
        const visitsList = Array.isArray(result)
          ? result
          : (result as any).data || [];
        // Filter to show only completed visits without invoices
        const completedVisits = visitsList.filter(
          (v: VisitDto) => v.visit_status === "completed"
        );
        setVisits(completedVisits);
      }
      setIsLoading(false);
    };
    fetchVisits();
  }, []);

  const onSubmit = async (data: InvoiceFormValues) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      createInvoiceApiInvoicesPost({
        body: {
          visit_id: data.visit_id,
          notes: data.notes || undefined,
        },
      }),
      { successMessage: "Invoice created successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/cashier/invoices");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/cashier/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Create Invoice
          </H2>
          <P className="text-muted-foreground">
            Generate invoice for a completed visit
          </P>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="visit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Visit *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a completed visit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {visits.map((visit) => (
                          <SelectItem key={visit.id} value={visit.id}>
                            {format(new Date(visit.created_at), "PPP")} -{" "}
                            Patient: {visit.patient_id.substring(0, 8)}... -{" "}
                            {visit.visit_type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes for this invoice"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Note:</strong> The invoice will automatically include
                  charges from consultations, prescriptions, and lab tests
                  associated with this visit.
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/cashier/invoices")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Save className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
