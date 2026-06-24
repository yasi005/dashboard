"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AUTH_KEY = "echosaas-auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem(AUTH_KEY)) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}

export function setAuthenticated() {
  localStorage.setItem(AUTH_KEY, "true");
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(AUTH_KEY);
}
