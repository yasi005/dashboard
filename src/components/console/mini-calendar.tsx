"use client";

import Link from "next/link";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/useProjectStore";

function getWeekDays(base: Date): Date[] {
  const start = new Date(base);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function toKey(d: Date) {
  return d.toISOString().split("T")[0];
}

export function MiniCalendarWidget() {
  const calendarEvents = useProjectStore((s) => s.calendarEvents);
  const weekDays = useMemo(() => getWeekDays(new Date()), []);
  const todayKey = toKey(new Date());

  const eventDays = useMemo(
    () => new Set(calendarEvents.map((e) => e.scheduledAt.split("T")[0])),
    [calendarEvents]
  );

  return (
    <div className="rounded-xl border border-[#242424] bg-[#141414] p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[#E4E4E7]">Content Calendar</p>
          <p className="text-xs text-[#E4E4E7]/45">This week&apos;s queue</p>
        </div>
        <Link
          href="/dashboard/calendar"
          className="text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] hover:text-[#D97706]"
        >
          Open →
        </Link>
      </div>

      <div className="grid grid-cols-7 gap-1 flex-1">
        {weekDays.map((day) => {
          const key = toKey(day);
          const hasEvent = eventDays.has(key);
          const isToday = key === todayKey;
          return (
            <div key={key} className="flex flex-col items-center gap-1 py-2">
              <span className="text-[9px] font-mono text-[#E4E4E7]/35 uppercase">
                {day.toLocaleDateString("en-US", { weekday: "narrow" })}
              </span>
              <span
                className={cn(
                  "text-sm font-mono font-semibold",
                  isToday ? "text-[#F59E0B]" : "text-[#E4E4E7]/70"
                )}
              >
                {day.getDate()}
              </span>
              {hasEvent && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[10px] text-[#E4E4E7]/35 font-mono">
        {calendarEvents.length} post{calendarEvents.length !== 1 ? "s" : ""} in queue
      </p>
    </div>
  );
}
