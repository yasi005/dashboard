"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLATFORMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/useProjectStore";

function getMonthDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const pad = first.getDay();
  const days: (Date | null)[] = Array(pad).fill(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  return days;
}

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function ScheduleModal() {
  const [viewDate, setViewDate] = useState(new Date());
  const {
    scheduleModalOpen,
    schedulingDraftId,
    selectedScheduleDate,
    generatedDrafts,
    closeScheduleModal,
    setSelectedScheduleDate,
    scheduleDraft,
  } = useProjectStore();

  const draft = generatedDrafts.find((d) => d.id === schedulingDraftId);
  const platform = draft ? PLATFORMS[draft.platform] : null;

  const days = useMemo(
    () => getMonthDays(viewDate.getFullYear(), viewDate.getMonth()),
    [viewDate]
  );

  const monthLabel = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleConfirm = () => {
    if (!schedulingDraftId || !selectedScheduleDate) return;
    const scheduledAt = `${selectedScheduleDate}T09:00:00.000Z`;
    scheduleDraft(schedulingDraftId, scheduledAt);
    closeScheduleModal();
    toast.success("Post locked into publishing loop", {
      description: `${platform?.label ?? "Post"} scheduled for ${selectedScheduleDate}`,
    });
  };

  return (
    <Dialog open={scheduleModalOpen} onOpenChange={(open) => !open && closeScheduleModal()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule {platform?.label ?? "Post"}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-[#E4E4E7]">{monthLabel}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-[10px] text-[#E4E4E7]/40 font-mono py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const key = toDateKey(day);
            const selected = selectedScheduleDate === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedScheduleDate(key)}
                className={cn(
                  "relative aspect-square rounded-lg border text-sm font-mono transition-all",
                  selected
                    ? "border-[#F59E0B] bg-[#F59E0B]/15 text-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "border-[#242424] bg-[#080808] text-[#E4E4E7]/70 hover:border-[#F59E0B]/30"
                )}
              >
                {day.getDate()}
                {selected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                )}
              </button>
            );
          })}
        </div>

        <Button
          className="w-full mt-4"
          disabled={!selectedScheduleDate}
          onClick={handleConfirm}
        >
          Confirm Schedule
        </Button>
      </DialogContent>
    </Dialog>
  );
}
