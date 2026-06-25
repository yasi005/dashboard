"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { runTourGeneration } from "@/lib/tour-generation";
import { useTourStore } from "@/store/useTourStore";

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function waitForUrlTypewriter(): Promise<void> {
  return new Promise((resolve) => {
    const handler = () => {
      window.removeEventListener("echosaas-tour-typewriter-done", handler);
      resolve();
    };
    window.addEventListener("echosaas-tour-typewriter-done", handler);
    useTourStore.getState().triggerUrlTypewriter();
  });
}

export function useBespokeTourOrchestrator() {
  const router = useRouter();
  const pathname = usePathname();
  const active = useTourStore((s) => s.active);
  const step = useTourStore((s) => s.step);
  const setActionRunning = useTourStore((s) => s.setActionRunning);
  const advanceStep = useTourStore((s) => s.advanceStep);
  const lastExecuted = useRef(0);

  useEffect(() => {
    if (!active) {
      lastExecuted.current = 0;
      return;
    }
    if (step === 0 || step <= lastExecuted.current) return;

    const run = async () => {
      lastExecuted.current = step;
      setActionRunning(true);

      try {
        if (step === 1) {
          if (pathname !== "/dashboard/sandbox") {
            router.push("/dashboard/sandbox");
            await wait(500);
          }
          await wait(400);
          await waitForUrlTypewriter();
          await wait(1800);
          advanceStep();
        } else if (step === 2) {
          if (pathname !== "/dashboard/sandbox") {
            router.push("/dashboard/sandbox");
            await wait(500);
          }
          await wait(300);
          await runTourGeneration();
          router.push("/dashboard/editor");
          await wait(500);
          advanceStep();
        } else if (step === 3) {
          if (pathname !== "/dashboard/editor") {
            router.push("/dashboard/editor");
            await wait(600);
          }
          document.getElementById("omniEditorView")?.scrollIntoView({ behavior: "smooth", block: "center" });
          await wait(8000);
          advanceStep();
        } else if (step === 4) {
          if (pathname !== "/dashboard/editor") {
            router.push("/dashboard/editor");
            await wait(600);
          }
          document.getElementById("charCountX")?.scrollIntoView({ behavior: "smooth", block: "center" });
          await wait(10000);
          useTourStore.getState().endTour();
        }
      } finally {
        setActionRunning(false);
      }
    };

    void run();
  }, [active, step, pathname, router, setActionRunning, advanceStep]);
}
