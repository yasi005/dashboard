"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Calendar, LayoutDashboard, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/useProjectStore";

const navItems = [
  { href: "/dashboard", label: "Console", icon: BarChart3 },
  { href: "/dashboard/sandbox", label: "Sandbox", icon: LayoutDashboard },
  { href: "/dashboard/calendar", label: "Calendar", icon: Calendar },
  { href: "/dashboard/logs", label: "Logs", icon: ScrollText },
];

export function BottomNav() {
  const pathname = usePathname();
  const isGenerating = useProjectStore((s) => s.isGenerating);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#242424] bg-[#141414]/95 backdrop-blur-md lg:hidden">
      <div className="flex items-stretch justify-around px-1 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors",
                active ? "text-[#F59E0B]" : "text-[#E4E4E7]/50"
              )}
            >
              <span className="relative">
                <item.icon className="h-5 w-5" />
                {item.href === "/dashboard/sandbox" && isGenerating && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
