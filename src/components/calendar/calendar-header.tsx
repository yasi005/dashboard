"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  view: "week" | "month";
  onViewChange: (view: "week" | "month") => void;
}

export function CalendarHeader({
  currentDate,
  onPrev,
  onNext,
  view,
  onViewChange,
}: CalendarHeaderProps) {
  const label = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-[#E4E4E7] min-w-[180px] text-center tracking-tight">
          {label}
        </h2>
        <Button variant="ghost" size="icon" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex rounded-lg border border-[#242424] p-0.5">
        {(["week", "month"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onViewChange(v)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
              view === v
                ? "bg-[#F59E0B] text-[#080808] font-semibold"
                : "text-[#E4E4E7]/55 hover:text-[#E4E4E7]"
            )}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
