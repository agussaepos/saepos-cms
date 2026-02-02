"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/api/useAuth";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const { initialize, token } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending, isError } = useLogin();

  // Initialize auth from cookies on mount
  useEffect(() => {
    initialize();
    // If already logged in, redirect to dashboard
    if (token) {
      router.push("/dashboard");
    }
  }, [initialize, token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[rgb(var(--background))] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-[rgb(var(--text))]">
              SAE POS Admin
            </h1>
            <p className="text-sm text-[rgb(var(--text-secondary))]">
              Platform Administration Dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
                Invalid email or password
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-700">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-[rgb(var(--text-secondary))]">
            Authorized personnel only
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
