"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { PLATFORMS } from "@/lib/constants";
import type { CalendarEvent } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

interface CalendarEventCardProps {
  event: CalendarEvent;
  index: number;
  compact?: boolean;
}

export function CalendarEventCard({ event, index, compact }: CalendarEventCardProps) {
  const config = PLATFORMS[event.platform];

  return (
    <Draggable draggableId={event.id} index={index}>
      {(provided, snapshot) => {
        const { style, ...draggableProps } = provided.draggableProps;
        return (
          <div
            ref={provided.innerRef}
            {...draggableProps}
            {...provided.dragHandleProps}
            style={style as React.CSSProperties}
            className={cn(
              "rounded-md border px-2 py-1.5 text-xs cursor-grab active:cursor-grabbing transition-shadow",
              config.bgBadge,
              snapshot.isDragging && "shadow-lg ring-2 ring-[#F59E0B]/40 rotate-1",
              compact ? "truncate" : ""
            )}
          >
            <span className="font-medium text-[#E4E4E7]">{config.shortLabel}</span>
            {!compact && (
              <p className="mt-0.5 text-[#E4E4E7]/55 line-clamp-2">{event.title}</p>
            )}
          </div>
        );
      }}
    </Draggable>
  );
}

interface CalendarCellProps {
  droppableId: string;
  label: string;
  subLabel?: string;
  events: CalendarEvent[];
  isToday?: boolean;
}

export function CalendarCell({ droppableId, label, subLabel, events, isToday }: CalendarCellProps) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "min-h-[100px] rounded-lg border p-2 transition-colors",
            isToday ? "border-[#F59E0B]/35 bg-[#F59E0B]/5" : "border-[#242424] bg-[#080808]",
            snapshot.isDraggingOver && "border-[#F59E0B]/50 bg-[#F59E0B]/8"
          )}
        >
          <div className="mb-2">
            <span
              className={cn(
                "text-sm font-medium",
                isToday ? "text-[#F59E0B]" : "text-[#E4E4E7]"
              )}
            >
              {label}
            </span>
            {subLabel && (
              <span className="ml-1 text-[10px] text-[#E4E4E7]/45 font-mono">{subLabel}</span>
            )}
            {events.length > 0 && (
              <span className="ml-2 inline-flex h-1.5 w-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            )}
          </div>
          <div className="space-y-1">
            {events.map((event, index) => (
              <CalendarEventCard key={event.id} event={event} index={index} compact />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
