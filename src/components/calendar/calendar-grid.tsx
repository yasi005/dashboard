"use client";

import { useMemo, useState } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { CalendarHeader } from "@/components/calendar/calendar-header";
import { CalendarCell } from "@/components/calendar/calendar-event-card";
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

async function patchEventSchedule(eventId: string, scheduledAt: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return true;

  try {
    const res = await fetch(`${apiUrl}/api/calendar/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scheduledAt }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function CalendarGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const { calendarEvents, moveCalendarEvent, rollbackCalendarEvent } = useProjectStore();

  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);
  const todayKey = toDateKey(new Date());

  const eventsByDay = useMemo(() => {
    const map: Record<string, typeof calendarEvents> = {};
    for (const day of weekDays) {
      map[toDateKey(day)] = [];
    }
    for (const event of calendarEvents) {
      const key = event.scheduledAt.split("T")[0];
      if (map[key]) map[key].push(event);
      else map[key] = [event];
    }
    return map;
  }, [calendarEvents, weekDays]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const eventId = result.draggableId;
    const newDateKey = result.destination.droppableId;
    const event = calendarEvents.find((e) => e.id === eventId);
    if (!event) return;

    const previousScheduledAt = event.scheduledAt;
    const newScheduledAt = `${newDateKey}T09:00:00.000Z`;

    moveCalendarEvent(eventId, newScheduledAt);

    const ok = await patchEventSchedule(eventId, newScheduledAt);
    if (!ok && process.env.NEXT_PUBLIC_API_URL) {
      rollbackCalendarEvent(eventId, previousScheduledAt);
      toast.error("Failed to reschedule post", {
        description: "Your change was rolled back. Please try again.",
      });
    }
  };

  return (
    <div>
      <CalendarHeader
        currentDate={currentDate}
        onPrev={() => {
          const d = new Date(currentDate);
          d.setDate(d.getDate() - (view === "week" ? 7 : 30));
          setCurrentDate(d);
        }}
        onNext={() => {
          const d = new Date(currentDate);
          d.setDate(d.getDate() + (view === "week" ? 7 : 30));
          setCurrentDate(d);
        }}
        view={view}
        onViewChange={setView}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const key = toDateKey(day);
            return (
              <CalendarCell
                key={key}
                droppableId={key}
                label={day.toLocaleDateString("en-US", { weekday: "short" })}
                subLabel={String(day.getDate())}
                events={eventsByDay[key] ?? []}
                isToday={key === todayKey}
              />
            );
          })}
        </div>
      </DragDropContext>

      {calendarEvents.length === 0 && (
        <p className="mt-8 text-center text-sm text-[#E4E4E7]/45">
          No scheduled posts yet. Schedule drafts from the Editor view.
        </p>
      )}
    </div>
  );
}
