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
import { Switch } from "@/components/ui/switch";
import { safeApiCall } from "@/lib/api-handler";
import {
  getLabTestApiLabTestsTestIdGet,
  updateLabTestApiLabTestsTestIdPatch,
} from "@/sdk/output/sdk.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

type TestValues = z.infer<typeof testSchema>;

export default function EditTestPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const fetchTest = async () => {
      if (typeof params.id === "string") {
        const result = await safeApiCall(
          getLabTestApiLabTestsTestIdGet({
            path: { test_id: params.id },
          })
        );

        if (result) {
          form.reset({
            test_code: result.test_code,
            test_name: result.test_name,
            category: result.category || "",
            price: result.price?.toString() || "0",
            unit: result.unit || "",
            reference_range: result.reference_range || "",
            is_active: result.is_active ?? true,
          });
        }
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [params.id, form]);

  const onSubmit = async (data: TestValues) => {
    if (typeof params.id !== "string") return;

    setIsSubmitting(true);
    const result = await safeApiCall(
      updateLabTestApiLabTestsTestIdPatch({
        path: { test_id: params.id },
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
      { successMessage: "Lab test updated successfully" }
    );

    setIsSubmitting(false);

    if (result) {
      router.push("/dashboard/lab/tests");
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
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/lab/tests">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Edit Test
          </H2>
          <P className="text-muted-foreground text-sm">
            Update laboratory test parameters.
          </P>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="test_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CBC01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Unique identifier for the test
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="test_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Complete Blood Count"
                      {...field}
                    />
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
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hematology">Hematology</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Microbiology">
                        Microbiology
                      </SelectItem>
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
                  <FormLabel>Price (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50000"
                      {...field}
                    />
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
                  <FormLabel>Unit (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., mg/dL" {...field} />
                  </FormControl>
                  <FormDescription>Measurement unit</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reference_range"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Range (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 10-20" {...field} />
                  </FormControl>
                  <FormDescription>Normal value range</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <FormDescription>
                    Inactive tests won&apos;t be available for ordering
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/lab/tests")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
