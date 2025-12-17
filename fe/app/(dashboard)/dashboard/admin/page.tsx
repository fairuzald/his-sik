"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { safeApiCall } from "@/lib/api-handler";
import { listUsersApiUsersGet } from "@/sdk/output/sdk.gen";
import { UserDao } from "@/sdk/output/types.gen";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: ColumnDef<UserDao>[] = [
  { accessorKey: "full_name", header: "User" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "secondary"}>
        {row.original.is_active ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserDao[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        listUsersApiUsersGet({
          query: { limit: 100 },
        })
      );

      if (result && Array.isArray(result)) {
        // Limit to top 5 for "Recent"
        setUsers(result.slice(0, 5));

        setStats({
          totalUsers: result.length,
          activeUsers: result.filter(u => u.is_active).length,
        });
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
      <div>
        <H2 className="text-primary text-3xl font-bold tracking-tight">
          Admin Dashboard
        </H2>
        <P className="text-muted-foreground mt-1">
          System overview and user management.
        </P>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          description="Registered accounts"
          icon={Users}
        />
        <StatCard
          title="System Health"
          value="100%"
          description="Uptime (Mock)"
          icon={Activity}
          trend="Good"
          trendUp={true}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm md:col-span-2">
          <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
            <CardTitle className="text-primary text-xl">Recent Users</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/admin/users">Manage Users</Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <DataTable columns={columns} data={users} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="text-primary text-xl">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/admin/users/new">
                <Users className="mr-2 h-4 w-4" />
                Add New User
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
