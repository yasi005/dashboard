"use client";

import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}

export function useSidebarWidth() {
  const [width, setWidth] = useState(256);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = () => setWidth(mq.matches ? 0 : 256);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return width;
}
