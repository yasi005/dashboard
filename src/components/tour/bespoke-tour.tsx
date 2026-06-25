"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, X } from "lucide-react";
import { TOUR_SPOTLIGHT_SPRING, TOUR_STEPS } from "@/lib/tour-config";
import { useTourStore } from "@/store/useTourStore";
import { useBespokeTourOrchestrator } from "@/hooks/useBespokeTourOrchestrator";
import { cn } from "@/lib/utils";

const PADDING = 10;

function unionRects(ids: string[], padding: number): DOMRect | null {
  const rects = ids
    .map((id) => document.getElementById(id)?.getBoundingClientRect())
    .filter((r): r is DOMRect => !!r && r.width > 0 && r.height > 0);

  if (!rects.length) return null;

  const top = Math.min(...rects.map((r) => r.top)) - padding;
  const left = Math.min(...rects.map((r) => r.left)) - padding;
  const bottom = Math.max(...rects.map((r) => r.bottom)) + padding;
  const right = Math.max(...rects.map((r) => r.right)) + padding;

  return new DOMRect(left, top, right - left, bottom - top);
}

function useSpotlightRect(targetIds: string[]) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const key = targetIds.join(",");

  const measure = useCallback(() => {
    setRect(unionRects(targetIds, PADDING));
  }, [key, targetIds]);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const interval = setInterval(measure, 280);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      clearInterval(interval);
    };
  }, [measure]);

  return rect;
}

function MaskPanels({ rect }: { rect: DOMRect }) {
  const panelClass = "fixed z-[90] backdrop-blur-[2px] bg-black/40 pointer-events-auto";

  return (
    <>
      <div className={panelClass} style={{ top: 0, left: 0, right: 0, height: Math.max(0, rect.top) }} />
      <div
        className={panelClass}
        style={{
          top: rect.top,
          left: 0,
          width: Math.max(0, rect.left),
          height: rect.height,
        }}
      />
      <div
        className={panelClass}
        style={{
          top: rect.top,
          left: rect.right,
          right: 0,
          height: rect.height,
        }}
      />
      <div
        className={panelClass}
        style={{
          top: rect.bottom,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </>
  );
}

function TourTooltip({
  heading,
  body,
  step,
  total,
  rect,
  onNext,
  onSkip,
  actionRunning,
}: {
  heading: string;
  body: string;
  step: number;
  total: number;
  rect: DOMRect;
  onNext: () => void;
  onSkip: () => void;
  actionRunning: boolean;
}) {
  const preferBelow = rect.bottom + 200 < window.innerHeight;
  const top = preferBelow ? rect.bottom + 16 : rect.top - 16;
  const transform = preferBelow ? "translateY(0)" : "translateY(-100%)";

  return (
    <motion.div
      initial={{ opacity: 0, y: preferBelow ? 8 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={TOUR_SPOTLIGHT_SPRING}
      className="fixed z-[92] w-[min(22rem,calc(100vw-2rem))] rounded-lg border border-[#242424] bg-[#141414] p-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
      style={{
        left: Math.min(Math.max(16, rect.left), window.innerWidth - 16 - 352),
        top,
        transform,
      }}
    >
      <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#F59E0B]">
        Bespoke Tour · {String(step).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </p>
      <h3 className="mt-1.5 text-sm font-semibold text-[#E4E4E7] font-mono tracking-tight">{heading}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#E4E4E7]/60 font-mono">{body}</p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onSkip}
          className="text-[10px] font-mono uppercase tracking-wider text-[#E4E4E7]/40 hover:text-[#E4E4E7]/70 transition-colors"
        >
          Exit Tour
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={actionRunning}
          className={cn(
            "rounded-md border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-[#F59E0B]",
            "hover:bg-[#F59E0B]/15 transition-colors disabled:opacity-40"
          )}
        >
          {actionRunning ? "Running…" : step === total ? "Finish" : "Next"}
        </button>
      </div>
    </motion.div>
  );
}

export function BespokeTour() {
  useBespokeTourOrchestrator();

  const active = useTourStore((s) => s.active);
  const step = useTourStore((s) => s.step);
  const actionRunning = useTourStore((s) => s.actionRunning);
  const advanceStep = useTourStore((s) => s.advanceStep);
  const endTour = useTourStore((s) => s.endTour);

  const config = useMemo(
    () => (step > 0 ? TOUR_STEPS.find((s) => s.step === step) : undefined),
    [step]
  );

  const rect = useSpotlightRect(config?.targets ?? []);

  if (!active || !config) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[89] pointer-events-none">
        {rect ? (
          <>
            <MaskPanels rect={rect} />
            <motion.div
              className="fixed z-[91] pointer-events-none rounded-lg"
              initial={false}
              animate={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
              }}
              transition={TOUR_SPOTLIGHT_SPRING}
            >
              <motion.div
                className="absolute inset-0 rounded-lg border border-[#F59E0B]"
                animate={{
                  boxShadow: [
                    "0 0 0 1px rgba(245,158,11,0.35), 0 0 16px rgba(245,158,11,0.12)",
                    "0 0 0 1px rgba(245,158,11,0.65), 0 0 28px rgba(245,158,11,0.28)",
                    "0 0 0 1px rgba(245,158,11,0.35), 0 0 16px rgba(245,158,11,0.12)",
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <TourTooltip
              heading={config.heading}
              body={config.body}
              step={step}
              total={TOUR_STEPS.length}
              rect={rect}
              onNext={() => (step >= 4 ? endTour() : advanceStep())}
              onSkip={endTour}
              actionRunning={actionRunning}
            />
          </>
        ) : (
          <div className="fixed inset-0 backdrop-blur-[2px] bg-black/40 pointer-events-auto" />
        )}

        <button
          type="button"
          onClick={endTour}
          className="fixed top-20 right-4 z-[93] flex h-9 w-9 items-center justify-center rounded-lg border border-[#242424] bg-[#141414]/90 text-[#E4E4E7]/50 hover:text-[#E4E4E7] pointer-events-auto backdrop-blur-sm"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </AnimatePresence>
  );
}

export function TourLaunchButton({ className }: { className?: string }) {
  const startTour = useTourStore((s) => s.startTour);
  const active = useTourStore((s) => s.active);

  return (
    <motion.button
      type="button"
      onClick={startTour}
      disabled={active}
      animate={
        active
          ? undefined
          : {
              opacity: [0.65, 1, 0.65],
            }
      }
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      className={cn(
        "flex items-center gap-1.5 rounded-md border border-[#242424] bg-[#080808] px-2.5 py-1",
        "text-[10px] font-mono text-[#E4E4E7]/55 hover:text-[#E4E4E7]/85 hover:border-[#E4E4E7]/20 transition-colors",
        "disabled:opacity-40 disabled:pointer-events-none",
        className
      )}
    >
      <Compass className="h-3 w-3 shrink-0 text-[#E4E4E7]/45" />
      <span className="hidden sm:inline">Run 60-Second Console Tour</span>
      <span className="sm:hidden">Tour</span>
    </motion.button>
  );
}
