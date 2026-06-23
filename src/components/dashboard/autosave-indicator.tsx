"use client";

import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/useProjectStore";

export function AutosaveIndicator() {
  const status = useProjectStore((s) => s.autosaveStatus);

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-[#E4E4E7]/55">
      <span
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          status === "synced" && "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]",
          status === "pending" && "bg-[#F59E0B] animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]",
          status === "idle" && "bg-[#242424]"
        )}
      />
      {status === "synced" && "Changes synced"}
      {status === "pending" && "Saving…"}
      {status === "idle" && "Autosave ready"}
    </div>
  );
}
