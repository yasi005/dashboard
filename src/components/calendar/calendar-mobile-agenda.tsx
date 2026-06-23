"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/store/useProjectStore";

function getWeekDays(baseDate: Date): Date[] {
  const start = new Date(baseDate);
  start.setDate(start.getDate() - start.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function toDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function CalendarMobileAgenda() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedKey, setSelectedKey] = useState(toDateKey(new Date()));
  const { calendarEvents } = useProjectStore();

  const baseDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);
    return d;
  }, [weekOffset]);

  const weekDays = useMemo(() => getWeekDays(baseDate), [baseDate]);
  const todayKey = toDateKey(new Date());

  const eventsForDay = useMemo(
    () =>
      calendarEvents
        .filter((e) => e.scheduledAt.split("T")[0] === selectedKey)
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [calendarEvents, selectedKey]
  );

  const weekLabel = `${weekDays[0]?.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${weekDays[6]?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <div className="lg:hidden space-y-5">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" className="touch-target" onClick={() => setWeekOffset((w) => w - 1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-sm font-semibold text-[#E4E4E7] font-mono">{weekLabel}</span>
        <Button variant="ghost" size="icon" className="touch-target" onClick={() => setWeekOffset((w) => w + 1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Weekly horizon slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
        {weekDays.map((day) => {
          const key = toDateKey(day);
          const hasEvents = calendarEvents.some((e) => e.scheduledAt.split("T")[0] === key);
          const selected = selectedKey === key;
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedKey(key)}
              className={cn(
                "touch-target snap-center shrink-0 flex flex-col items-center justify-center rounded-xl border min-w-[52px] py-3 transition-all",
                selected
                  ? "border-[#F59E0B] bg-[#F59E0B]/10 text-[#F59E0B]"
                  : "border-[#242424] bg-[#141414] text-[#E4E4E7]/70",
                isToday && !selected && "border-[#F59E0B]/30"
              )}
            >
              <span className="text-[10px] uppercase font-mono">
                {day.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
              </span>
              <span className="text-lg font-semibold">{day.getDate()}</span>
              {hasEvents && (
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Vertical agenda timeline */}
      <div className="rounded-xl border border-[#242424] bg-[#141414] p-4">
        <p className="text-[10px] uppercase tracking-wider text-[#E4E4E7]/45 font-mono mb-3">
          Agenda — {selectedKey}
        </p>
        {eventsForDay.length === 0 ? (
          <p className="text-sm text-[#E4E4E7]/40">No posts scheduled for this day.</p>
        ) : (
          <ul className="space-y-3">
            {eventsForDay.map((event) => {
              const config = PLATFORMS[event.platform];
              return (
                <li
                  key={event.id}
                  className="flex items-start gap-3 border-l-2 border-[#F59E0B] pl-3 py-1"
                >
                  <span
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#E4E4E7]">{config.shortLabel}</p>
                    <p className="text-sm text-[#E4E4E7]/55 line-clamp-2">{event.title}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
