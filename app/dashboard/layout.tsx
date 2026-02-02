"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useLogout } from "@/hooks/api/useAuth";
import {
  LayoutDashboard,
  Briefcase,
  Receipt,
  Shield,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Partners", href: "/dashboard/partners", icon: Briefcase },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Administrators", href: "/dashboard/admins", icon: Shield },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mutate: logoutMutation } = useLogout();
  const { token, user, initialize, isInitialized } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth from cookies on mount ONCE
  useEffect(() => {
    initialize();
  }, [initialize]); // Add initialize to deps

  // Only redirect after initialization is complete
  useEffect(() => {
    if (isInitialized && !token) {
      router.push("/");
    }
  }, [isInitialized, token, router]);

  // Show nothing while initializing to prevent flash
  if (!isInitialized || !token) return null;

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-zinc-200 bg-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-6 border-b border-zinc-200">
            <h1 className="text-xl font-bold text-zinc-900">SAE POS</h1>
            <p className="text-sm text-zinc-500 mt-1">CMS Portal</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <Card className="mt-auto">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-zinc-700">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100"
                onClick={() => logoutMutation()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
