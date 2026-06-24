"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { UpgradeBlock } from "@/components/dashboard/upgrade-block";
import { clearAuth } from "@/components/auth/auth-gate";
import { useProjectStore } from "@/store/useProjectStore";

const navItems = [
  { href: "/dashboard/sandbox", label: "Sandbox", icon: LayoutDashboard },
  { href: "/dashboard/logs", label: "Agent Logs", icon: ScrollText },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/calendar", label: "Content Calendar", icon: Calendar },
];

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isGenerating = useProjectStore((s) => s.isGenerating);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-64 flex-col border-r border-[#242424] bg-[#141414]/95 backdrop-blur-md">
      <Link
        href="/dashboard"
        className="flex h-16 items-center gap-2 border-b border-[#242424] px-4 hover:bg-[#080808]/50 transition-colors"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#080808] font-mono text-sm font-bold text-[#F59E0B]">
          Σ
        </div>
        <div>
          <p className="text-sm font-semibold text-[#E4E4E7] tracking-tight">
            EchoSaaS <span className="text-[#E4E4E7]/35">//</span> Σ
          </p>
          <p className="text-[10px] text-[#E4E4E7]/45 uppercase tracking-wider font-mono">
            Carbon Engine
          </p>
        </div>
      </Link>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        <Link
          href="/dashboard"
          className={cn(
            "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-2",
            pathname === "/dashboard" ? "text-[#E4E4E7]" : "text-[#E4E4E7]/50 hover:text-[#E4E4E7]/80"
          )}
        >
          {pathname === "/dashboard" && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-lg border border-[#F59E0B]/25 bg-[#F59E0B]/8"
              transition={spring.switch}
            />
          )}
          <BarChart3 className="relative h-5 w-5 shrink-0" />
          <span className="relative">Console</span>
        </Link>

        {navItems.map((item) => {
          const active = isNavActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "text-[#E4E4E7]" : "text-[#E4E4E7]/50 hover:text-[#E4E4E7]/80"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg border border-[#F59E0B]/25 bg-[#F59E0B]/8"
                  transition={spring.switch}
                />
              )}
              <item.icon className="relative h-5 w-5 shrink-0" />
              <span className="relative">{item.label}</span>
              {item.href === "/dashboard/sandbox" && isGenerating && (
                <span className="relative ml-auto h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#242424] p-3 space-y-2">
        <UpgradeBlock />

        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            pathname === "/dashboard/settings" ? "text-[#E4E4E7]" : "text-[#E4E4E7]/50 hover:text-[#E4E4E7]/80"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          Settings
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#E4E4E7]/50 hover:text-[#E4E4E7]/80 transition-colors touch-target"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
