"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { clearAuth } from "@/components/auth/auth-gate";
import { useRouter } from "next/navigation";

const AUTH_KEY = "echosaas-auth";

export default function SettingsPage() {
  const router = useRouter();
  const [operator, setOperator] = useState("guest_dev");

  useEffect(() => {
    const session = localStorage.getItem(AUTH_KEY);
    if (session && session !== "true") setOperator(session);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E4E4E7] tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-[#E4E4E7]/55">System configuration and account controls.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your EchoSaaS operator session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-[#242424] bg-[#080808] p-3 font-mono text-xs text-[#E4E4E7]/60">
            operator: {operator} · Pro Plan · session active
          </div>
          <Button variant="secondary" onClick={handleLogout} className="w-full touch-target">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
