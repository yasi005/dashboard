"use client";

import { useEffect, useRef } from "react";
import { useProjectStore } from "@/store/useProjectStore";

const DEBOUNCE_MS = 1000;

export function useDebouncedAutosave() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generatedDrafts = useProjectStore((s) => s.generatedDrafts);
  const calendarEvents = useProjectStore((s) => s.calendarEvents);
  const draftIterationIndexes = useProjectStore((s) => s.draftIterationIndexes);
  const setAutosaveStatus = useProjectStore((s) => s.setAutosaveStatus);
  const persistToStorage = useProjectStore((s) => s.persistToStorage);
  const hydrated = useProjectStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated || generatedDrafts.length === 0) return;

    setAutosaveStatus("pending");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      persistToStorage();
      setAutosaveStatus("synced");
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generatedDrafts, calendarEvents, draftIterationIndexes, hydrated, persistToStorage, setAutosaveStatus]);
}
