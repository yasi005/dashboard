"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GENERATION_STEPS } from "@/lib/constants";
import { spring } from "@/lib/motion";
import { useProjectStore } from "@/store/useProjectStore";
import { Check, Circle, Cog } from "lucide-react";
import { cn } from "@/lib/utils";

export function GenerationLoader() {
  const steps = useProjectStore((s) => s.generationSteps);
  const telemetryLogs = useProjectStore((s) => s.telemetryLogs);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [telemetryLogs]);

  return (
    <div id="loggerBox" className="space-y-6">
      <div className="flex min-h-[40vh] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#242424] bg-[#141414]"
            >
              <Cog className="h-8 w-8 text-[#F59E0B]" />
            </motion.div>
            <h2 className="text-xl font-semibold text-[#E4E4E7] tracking-tight">
              Multi-Agent Pipeline
            </h2>
            <p className="mt-2 text-sm text-[#E4E4E7]/55">
              Sequential stage locking — SSE simulation active
            </p>
          </div>

          <div className="relative space-y-0">
            {GENERATION_STEPS.map((stepDef, index) => {
              const step = steps.find((s) => s.id === stepDef.id);
              const status = step?.status ?? "pending";
              const isLast = index === GENERATION_STEPS.length - 1;

              return (
                <motion.div
                  key={stepDef.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring.card, delay: index * 0.06 }}
                  className="relative flex gap-4"
                >
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-[15px] top-8 h-full w-px",
                        status === "success" ? "bg-[#F59E0B]" : "bg-[#242424]"
                      )}
                    />
                  )}

                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#242424] bg-[#080808]">
                    {status === "success" && <Check className="h-4 w-4 text-[#F59E0B]" />}
                    {status === "processing" && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="h-4 w-4 rounded-full border-2 border-[#F59E0B] border-t-transparent"
                      />
                    )}
                    {status === "pending" && (
                      <Circle className="h-3 w-3 text-[#242424] fill-[#242424]" />
                    )}
                  </div>

                  <div className="pb-8">
                    <p
                      className={cn(
                        "text-sm font-medium font-mono tracking-tight",
                        status === "success" && "text-[#F59E0B]",
                        status === "processing" && "text-[#E4E4E7]",
                        status === "pending" && "text-[#E4E4E7]/40"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")} — {stepDef.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#080808] overflow-hidden lg:hidden">
        <div className="border-b border-[#242424] px-4 py-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-mono">
            System Telemetry
          </span>
        </div>
        <div
          ref={terminalRef}
          className="h-40 overflow-y-auto p-4 font-mono text-xs text-[#F59E0B]/90 space-y-1"
        >
          {telemetryLogs.length === 0 ? (
            <p className="text-[#E4E4E7]/30">Awaiting agent wake signal…</p>
          ) : (
            telemetryLogs.map((line, i) => (
              <p key={i} className="text-[#E4E4E7]/70">
                <span className="text-[#D97706]">{">"}</span> {line}
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
