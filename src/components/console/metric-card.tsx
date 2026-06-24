"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  delta: string;
  highlighted?: boolean;
}

export function MetricCard({ label, value, delta, highlighted }: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-colors",
        highlighted
          ? "border-[#F59E0B]/30 bg-[#080808] shadow-[0_0_24px_rgba(245,158,11,0.06)]"
          : "border-[#242424] bg-[#141414]"
      )}
    >
      <p className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-mono">{label}</p>
      <p
        className={cn(
          "mt-2 text-2xl sm:text-3xl font-bold tracking-tight font-mono",
          highlighted ? "text-[#F59E0B]" : "text-[#E4E4E7]"
        )}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-[#E4E4E7]/45 font-mono">{delta}</p>
    </div>
  );
}
