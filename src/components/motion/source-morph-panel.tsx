"use client";

import { motion } from "framer-motion";
import { FileText, Link2, Type } from "lucide-react";
import { spring } from "@/lib/motion";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

interface SourceMorphPanelProps {
  variant: "sandbox" | "editor";
}

const typeIcons = {
  link: Link2,
  document: FileText,
  concept: Type,
};

export function SourceMorphPanel({ variant }: SourceMorphPanelProps) {
  const { currentSource, sourceType } = useProjectStore();
  const Icon = typeIcons[sourceType ?? "concept"];
  const excerpt = currentSource?.trim() || "No source loaded";

  return (
    <motion.div
      layoutId="source-input"
      transition={spring.structural}
      className={cn(
        "border border-[#242424] bg-[#141414] overflow-hidden",
        variant === "sandbox"
          ? "rounded-xl p-5 w-full"
          : "rounded-lg px-4 py-2.5 flex items-center gap-3 max-w-full"
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md border border-[#242424] bg-[#080808]",
          variant === "sandbox" ? "h-10 w-10" : "h-7 w-7"
        )}
      >
        <Icon className={cn("text-[#F59E0B]", variant === "sandbox" ? "h-5 w-5" : "h-3.5 w-3.5")} />
      </div>

      <div className="min-w-0 flex-1">
        {variant === "sandbox" ? (
          <>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-medium mb-1">
              Active Source
            </p>
            <p className="text-sm text-[#E4E4E7] line-clamp-3 leading-relaxed">{excerpt}</p>
          </>
        ) : (
          <p className="text-xs text-[#E4E4E7]/70 truncate font-mono">{excerpt}</p>
        )}
      </div>

      {variant === "editor" && (
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#D97706] font-semibold">
          Source
        </span>
      )}
    </motion.div>
  );
}
