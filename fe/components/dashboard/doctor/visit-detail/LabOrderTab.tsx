"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { safeApiCall } from "@/lib/api-handler";
import { createLabOrderApiLabOrdersPost } from "@/sdk/output/sdk.gen";
import { LabOrderDto, LabTestDto } from "@/sdk/output/types.gen";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, FlaskConical, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface LabOrderTabProps {
  visitId: string;
  labOrders: LabOrderDto[];
  labTests: LabTestDto[];
  onRefresh: () => void;
}

const labOrderSchema = z.object({
  lab_test_id: z.string().min(1, "Test is required"),
  notes: z.string().optional(),
});

type LabOrderFormValues = z.infer<typeof labOrderSchema>;

export function LabOrderTab({
  visitId,
  labOrders,
  labTests,
  onRefresh,
}: LabOrderTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LabOrderFormValues>({
    resolver: zodResolver(labOrderSchema),
    defaultValues: {
      lab_test_id: "",
      notes: "",
    },
  });

  const onSubmit = async (data: LabOrderFormValues) => {
    setIsSubmitting(true);
    try {
      await safeApiCall(
        createLabOrderApiLabOrdersPost({
          body: {
            visit_id: visitId,
            lab_test_id: data.lab_test_id,
            notes: data.notes,
          },
        }),
        { successMessage: "Lab order created" }
      );
      setIsDialogOpen(false);
      form.reset();
      onRefresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  } as Record<string, string>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-primary text-lg font-semibold">Lab Requests</h3>
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
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Lab Request</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="lab_test_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Test</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a lab test" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {labTests.map(test => (
                            <SelectItem key={test.id} value={test.id}>
                              {test.test_name} ({test.test_code})
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
                          placeholder="Clinical context or specific instructions"
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
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit Request
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {labOrders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-muted-foreground flex flex-col items-center justify-center p-6">
            <FlaskConical className="mb-2 h-8 w-8 opacity-50" />
            <p>No lab orders requested yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {labOrders.map(order => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/20 p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {order.lab_test?.test_name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Code: {order.lab_test?.test_code}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={statusColors[order.order_status] || ""}
                  >
                    {order.order_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                {order.notes && (
                  <div className="text-muted-foreground bg-muted/30 mb-2 rounded p-2 text-sm">
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Notes:
                    </span>{" "}
                    {order.notes}
                  </div>
                )}
                {order.result ? (
                  <div className="mt-2 space-y-1">
                    <div className="text-sm font-medium text-green-700">
                      Result Available
                    </div>
                    <div className="text-sm">
                      Value: {order.result.result_value}{" "}
                      {order.result.result_unit}
                    </div>
                    {order.result.interpretation && (
                      <div className="text-muted-foreground text-xs">
                        Interpretation: {order.result.interpretation}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground mt-2 flex items-center text-sm">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Awaiting results
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
