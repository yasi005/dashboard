"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";

export function DemoHydrator() {
  const hydrateFromStorage = useProjectStore((s) => s.hydrateFromStorage);
  const hydrated = useProjectStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) hydrateFromStorage();
  }, [hydrateFromStorage, hydrated]);

  return null;
}
