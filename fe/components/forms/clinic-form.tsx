"use client";

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
import { ClinicDto } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const clinicSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ClinicFormValues = z.infer<typeof clinicSchema>;

interface ClinicFormProps {
  initialData?: ClinicDto;
  onSubmit: (data: ClinicFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ClinicForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: ClinicFormProps) {
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clinic Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="General Clinic"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Clinic
          </Button>
        </div>
      </form>
    </Form>
  );
}
