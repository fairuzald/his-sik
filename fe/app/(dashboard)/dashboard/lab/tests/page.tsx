"use client";

import { H2, P } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listLabTestsApiLabTestsGet } from "@/sdk/output/sdk.gen";
import { LabTestDto } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<LabTestDto>[] = [
  { accessorKey: "test_code", header: "Code" },
  { accessorKey: "test_name", header: "Test Name" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const price = row.original.price;
      return typeof price === "number"
        ? `Rp ${price.toLocaleString("id-ID")}`
        : "-";
    },
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) => (row.original.is_active ? "Yes" : "No"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button size="sm" variant="ghost" asChild>
        <Link href={`/dashboard/lab/tests/${row.original.id}`}>View</Link>
      </Button>
    ),
  },
];

export default function LabTestsPage() {
  const [data, setData] = useState<LabTestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listLabTestsApiLabTestsGet({ query: { limit: 100 } })
      );
      if (result && Array.isArray(result)) {
        setData(result);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <H2 className="text-primary text-3xl font-bold tracking-tight">
            Test Directory
          </H2>
          <P className="text-muted-foreground mt-1">
            Master data of available laboratory tests.
          </P>
        </div>
        <Button className="gap-2 shadow-sm" asChild>
          <Link href="/dashboard/lab/tests/new">
            <Plus className="h-4 w-4" />
            Add New Test
          </Link>
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/20 border-b">
          <CardTitle className="text-primary text-lg">
            Available Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DataTable
            columns={columns}
            data={data}
            searchKey="test_name"
            filterKey="category"
            // We can fetch categories later dynamically if needed, or stick to hardcoded ones for now if backend standardizes them
            filterOptions={[
              { label: "Hematology", value: "Hematology" },
              { label: "Chemistry", value: "Chemistry" },
              { label: "Microbiology", value: "Microbiology" },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
