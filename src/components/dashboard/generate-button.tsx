"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function GenerateButton({ onClick, loading, disabled }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "relative w-full overflow-hidden rounded-xl py-4 text-base font-semibold",
        "bg-[#F59E0B] text-[#080808] hover:bg-[#D97706]",
        "shadow-[0_0_24px_rgba(245,158,11,0.15)]",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        loading && "opacity-80"
      )}
    >
      {loading && (
        <span className="absolute inset-0 -translate-x-full animate-[amber-scan_1.8s_infinite] bg-gradient-to-r from-transparent via-[#E4E4E7]/20 to-transparent" />
      )}
      <span className="relative flex items-center justify-center gap-2">
        <Sparkles className={cn("h-5 w-5", loading && "animate-spin")} />
        {loading ? "Pipeline Locked — Processing…" : "Generate Multi-Channel Campaign"}
      </span>
    </button>
  );
}
