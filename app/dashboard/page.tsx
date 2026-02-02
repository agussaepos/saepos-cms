"use client";

import { useAuthStore } from "@/store/auth";
import { useDashboardStats } from "@/hooks/api/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Store,
  Banknote,
  TrendingUp,
  Grid,
  Package,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuthStore();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (!user) return null;

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading stats</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[rgb(var(--text))]">
          Dashboard
        </h2>
        <p className="text-[rgb(var(--text-secondary))]">
          Overview of platform performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Banknote className="h-4 w-4 text-[rgb(var(--text-secondary))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {stats?.totalRevenue.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-[rgb(var(--text-secondary))]">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Partners
            </CardTitle>
            <Users className="h-4 w-4 text-[rgb(var(--text-secondary))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalPartners || 0}
            </div>
            <p className="text-xs text-[rgb(var(--text-secondary))]">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <Store className="h-4 w-4 text-[rgb(var(--text-secondary))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStores || 0}</div>
            <p className="text-xs text-[rgb(var(--text-secondary))]">
              +19% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <TrendingUp className="h-4 w-4 text-[rgb(var(--text-secondary))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-[rgb(var(--text-secondary))]">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center text-[rgb(var(--text-secondary))]">
              Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Platform Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 mr-4">
                  <Package className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Products</p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    Active Catalog Items
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {stats?.activeProducts || 0}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-900 mr-4">
                  <Grid className="h-4 w-4" />
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Categories</p>
                  <p className="text-sm text-[rgb(var(--text-secondary))]">
                    Product Categories
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  {stats?.totalCategories || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
