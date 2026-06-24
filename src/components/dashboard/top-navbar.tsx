"use client";

import { usePathname } from "next/navigation";
import { Search, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/useProjectStore";

const breadcrumbs: Record<string, string> = {
  "/dashboard": "Console Dashboard",
  "/dashboard/sandbox": "Sandbox",
  "/dashboard/logs": "Agent Logs",
  "/dashboard/analytics": "Analytics",
  "/dashboard/editor": "Omni-Editor",
  "/dashboard/calendar": "Content Calendar",
  "/dashboard/billing": "Billing",
  "/dashboard/settings": "Settings",
};

interface TopNavbarProps {
  onOpenCommand: () => void;
}

export function TopNavbar({ onOpenCommand }: TopNavbarProps) {
  const pathname = usePathname();
  const isGenerating = useProjectStore((s) => s.isGenerating);
  const pageName = breadcrumbs[pathname] ?? "Console Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#242424] bg-[#141414]/90 px-4 sm:px-6 backdrop-blur-md">
      <div>
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/40 font-medium font-mono">
          EchoSaaS Console
        </p>
        <h1 className="text-lg font-semibold text-[#E4E4E7] tracking-tight">{pageName}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isGenerating && (
          <span className="hidden sm:flex items-center gap-2 rounded-md border border-[#F59E0B]/30 bg-[#F59E0B]/8 px-3 py-1 text-xs text-[#F59E0B] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.8)] animate-pulse" />
            PIPELINE
          </span>
        )}

        <span className="hidden md:flex items-center gap-1.5 rounded-md border border-[#242424] bg-[#080808] px-2.5 py-1 text-[10px] font-mono text-emerald-400">
          <Wifi className="h-3 w-3" />
          12ms
        </span>

        <Button variant="outline" size="sm" onClick={onOpenCommand} className="hidden sm:flex gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden lg:inline">Search…</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-[#242424] bg-[#080808] px-1.5 font-mono text-[10px] font-medium lg:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <div className="h-9 w-9 rounded-md border border-[#242424] bg-[#080808] flex items-center justify-center text-xs font-bold text-[#F59E0B] font-mono touch-target">
          ES
        </div>
      </div>
    </header>
  );
}
