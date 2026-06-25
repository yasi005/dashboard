"use client";

import { LayoutGroup } from "framer-motion";
import { AuthGate } from "@/components/auth/auth-gate";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import { useSidebarWidth } from "@/hooks/useBreakpoint";
import { BespokeTour } from "@/components/tour/bespoke-tour";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarWidth = useSidebarWidth();

  return (
    <AuthGate>
      <LayoutGroup id="dashboard-morph">
        <div className="min-h-screen bg-[#080808]">
          <Sidebar />
          <div
            className="min-h-screen pb-20 lg:pb-0"
            style={{ marginLeft: sidebarWidth }}
          >
            <TopNavbar
              onOpenCommand={() => {
                document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
              }}
            />
            <main className="p-4 sm:p-6">{children}</main>
          </div>
          <BottomNav />
          <BespokeTour />
        </div>
      </LayoutGroup>
    </AuthGate>
  );
}
