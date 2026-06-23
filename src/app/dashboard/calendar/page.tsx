"use client";

import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { CalendarMobileAgenda } from "@/components/calendar/calendar-mobile-agenda";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E4E4E7] tracking-tight">Content Calendar</h2>
        <p className="mt-1 text-sm text-[#E4E4E7]/55">
          Full grid on desktop · weekly horizon on mobile
        </p>
      </div>

      <div className="hidden lg:block">
        <CalendarGrid />
      </div>

      <CalendarMobileAgenda />
    </div>
  );
}
