"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { safeApiCall } from "@/lib/api-handler";
import {
  createPrescriptionApiPrescriptionsPost,
  listMedicinesApiMedicinesGet,
} from "@/sdk/output/sdk.gen";
import { MedicineDto, PrescriptionDto } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pill, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

interface PrescriptionTabProps {
  visitId: string;
  prescriptions: PrescriptionDto[];
  onRefresh: () => void;
}

const prescriptionSchema = z.object({
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        medicine_id: z.string().min(1, "Medicine is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        dosage: z.string().min(1, "Dosage is required"),
        frequency: z.string().min(1, "Frequency is required"),
        duration: z.string().min(1, "Duration is required"),
        instructions: z.string().optional(),
      })
    )
    .min(1, "At least one medicine is required"),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export function PrescriptionTab({
  visitId,
  prescriptions,
  onRefresh,
}: PrescriptionTabProps) {
  const [medicines, setMedicines] = useState<MedicineDto[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form definition
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      notes: "",
      items: [], // Start empty
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    const response = await safeApiCall(
      listMedicinesApiMedicinesGet({
        query: { limit: 100 },
      })
    );
    if (response?.data) {
      setMedicines(response.data);
    }
  };

  const onSubmit = async (data: PrescriptionFormValues) => {
    setIsSubmitting(true);
    try {
      await safeApiCall(
        createPrescriptionApiPrescriptionsPost({
          body: {
            visit_id: visitId,
            notes: data.notes || "",
            items: data.items.map(item => ({
              ...item,
              instructions: item.instructions || undefined,
            })),
          },
        }),
        { successMessage: "Prescription created successfully" }
      );

      setIsDialogOpen(false);
      form.reset();
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMedicineName = (id: string) => {
    return medicines.find(m => m.id === id)?.medicine_name || "Unknown";
  };

  const getMedicineCode = (id: string) => {
    return medicines.find(m => m.id === id)?.medicine_code || "";
  };

  const getMedicineUnit = (id: string) => {
    return medicines.find(m => m.id === id)?.unit || "pcs";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-primary text-lg font-semibold">Prescriptions</h3>
        <Dialog
          open={isDialogOpen}
          onOpenChange={open => {
            setIsDialogOpen(open);
            if (!open) form.reset();
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Prescription</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Prescription Items</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        append({
                          medicine_id: "",
                          quantity: 1,
                          dosage: "",
                          frequency: "",
                          duration: "",
                          instructions: "",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Medicine
                    </Button>
                  </div>

                  {/* Validation Error for Array */}
                  <FormMessage>
                    {form.formState.errors.items?.root?.message}
                  </FormMessage>

                  {fields.length === 0 && (
                    <div className="text-muted-foreground bg-muted/20 rounded-md border border-dashed py-8 text-center text-sm">
                      No medicines added yet. Click &quot;Add Medicine&quot; to
                      start.
                    </div>
                  )}

                  {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.medicine_id`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-xs">
                                Medicine
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select medicine" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {medicines.map(m => (
                                    <SelectItem key={m.id} value={m.id}>
                                      {m.medicine_name} ({m.medicine_code})
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
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Qty</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.dosage`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Dosage</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 500mg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.frequency`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Frequency
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 3x1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.duration`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">
                                Duration
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 5 days" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`items.${index}.instructions`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel className="text-xs">
                                Instructions (Optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. After meals"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional notes..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || fields.length === 0}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Prescription
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {prescriptions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground flex flex-col items-center justify-center p-6">
            <Pill className="mb-2 h-8 w-8 opacity-50" />
            <p>No prescriptions prescribed yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(script => (
            <Card key={script.id}>
              <CardHeader className="bg-muted/20 border-b py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      Prescription #{script.id.slice(0, 8)}
                    </CardTitle>
                    <Badge
                      variant={
                        script.prescription_status === "pending"
                          ? "outline"
                          : "default"
                      }
                      className="text-[10px] uppercase"
                    >
                      {script.prescription_status}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {new Date(script.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Medicine</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {script.items?.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="align-top font-medium">
                          {item.medicine?.medicine_name ||
                            getMedicineName(item.medicine_id)}
                          <span className="text-muted-foreground block text-xs">
                            {item.medicine?.medicine_code ||
                              getMedicineCode(item.medicine_id)}
                          </span>
                        </TableCell>
                        <TableCell className="align-top text-sm">
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                            <div>
                              <span className="text-muted-foreground">
                                Dosage:
                              </span>{" "}
                              {item.dosage || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Freq:
                              </span>{" "}
                              {item.frequency || "-"}
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Dur:
                              </span>{" "}
                              {item.duration || "-"}
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">
                                Instr:
                              </span>{" "}
                              {item.instructions || "-"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right align-top">
                          {item.quantity}{" "}
                          {item.medicine?.unit ||
                            getMedicineUnit(item.medicine_id)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {script.notes && (
                  <div className="bg-muted/10 border-t p-4 pt-2">
                    <p className="text-muted-foreground text-xs">
                      <span className="font-semibold">Note:</span>{" "}
                      {script.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
