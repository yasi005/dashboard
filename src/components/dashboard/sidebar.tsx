"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  PenLine,
  Cog,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { spring } from "@/lib/motion";
import { useProjectStore } from "@/store/useProjectStore";

const navItems = [
  { href: "/dashboard", label: "Sandbox", icon: LayoutDashboard },
  { href: "/dashboard/editor", label: "Editor", icon: PenLine },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();
  const isGenerating = useProjectStore((s) => s.isGenerating);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden lg:flex h-screen w-64 flex-col border-r border-[#242424] bg-[#141414]/95 backdrop-blur-md">
      <div className="flex h-16 items-center gap-2 border-b border-[#242424] px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#080808]">
          <Cog className="h-5 w-5 text-[#F59E0B]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#E4E4E7] tracking-tight">EchoSaaS</p>
          <p className="text-[10px] text-[#E4E4E7]/45 uppercase tracking-wider">Carbon Engine</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const active = pathname === item.href;
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
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[#242424] p-3">
        <div className="rounded-lg border border-[#242424] bg-[#080808] p-3">
          <div className="flex items-center gap-2">
            <Zap
              className={cn(
                "h-4 w-4",
                isGenerating ? "text-[#F59E0B] animate-pulse" : "text-[#E4E4E7]/40"
              )}
            />
            <p className="text-xs font-medium text-[#E4E4E7]">
              {isGenerating ? "Pipeline active" : "Pro Plan"}
            </p>
          </div>
          <p className="text-[10px] text-[#E4E4E7]/45 mt-0.5 font-mono">42 cycles left</p>
        </div>
      </div>
    </aside>
  );
}
