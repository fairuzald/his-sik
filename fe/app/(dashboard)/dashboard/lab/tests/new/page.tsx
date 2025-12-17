"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { safeApiCall } from "@/lib/api-handler";
import { createLabTestApiLabTestsPost } from "@/sdk/output/sdk.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const testSchema = z.object({
  test_code: z.string().min(1, "Code is required"),
  test_name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  unit: z.string().optional(),
  reference_range: z.string().optional(),
  is_active: z.boolean(),
});

type TestValues = z.input<typeof testSchema>;

export default function NewTestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TestValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      test_code: "",
      test_name: "",
      category: "",
      price: "0",
      unit: "",
      reference_range: "",
      is_active: true,
    },
  });

  const onSubmit = async (data: TestValues) => {
    setIsSubmitting(true);
    const result = await safeApiCall(
      createLabTestApiLabTestsPost({
        body: {
          test_code: data.test_code,
          test_name: data.test_name,
          category: data.category,
          price: parseFloat(data.price) || 0,
          unit: data.unit || null,
          reference_range: data.reference_range || null,
          is_active: data.is_active,
        },
      }),
      { successMessage: "Lab test created successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/lab/tests");
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/lab/tests">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Add New Test
          </H2>
          <P className="text-muted-foreground text-sm">
            Define a new laboratory test parameter.
          </P>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="test_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. CBC" {...field} />
                  </FormControl>
                  <FormDescription>Unique identifier code.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="test_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Complete Blood Count" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hematology">Hematology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Microbiology">Microbiology</SelectItem>
                      <SelectItem value="Immunology">Immunology</SelectItem>
                      <SelectItem value="Serology">Serology</SelectItem>
                      <SelectItem value="Urinalysis">Urinalysis</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (Rp) *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. mg/dL" {...field} />
                  </FormControl>
                  <FormDescription>Measurement unit.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 10-20" {...field} />
                  </FormControl>
                  <FormDescription>
                    Normal range for interpretation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="gap-2 px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Test
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
