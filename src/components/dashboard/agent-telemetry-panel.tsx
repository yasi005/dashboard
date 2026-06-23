"use client";

import { useProjectStore } from "@/store/useProjectStore";

export function AgentTelemetryPanel({ compact }: { compact?: boolean }) {
  const { telemetryLogs, isGenerating, generationSteps } = useProjectStore();
  const activeStep = generationSteps.find((s) => s.status === "processing");
  const completedCount = generationSteps.filter((s) => s.status === "success").length;

  return (
    <div
      className={`rounded-xl border border-[#242424] bg-[#141414] overflow-hidden ${
        compact ? "" : "h-full"
      }`}
    >
      <div className="border-b border-[#242424] px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-mono">
          Agent Telemetry
        </p>
        <div className="mt-2 flex items-center gap-4 text-xs font-mono">
          <span className="text-[#E4E4E7]/55">
            Stages: <span className="text-[#F59E0B]">{completedCount}/3</span>
          </span>
          <span className="text-[#E4E4E7]/55">
            Status:{" "}
            <span className={isGenerating ? "text-[#F59E0B]" : "text-emerald-500"}>
              {isGenerating ? "ACTIVE" : "STANDBY"}
            </span>
          </span>
        </div>
        {activeStep && (
          <p className="mt-1 text-[10px] text-[#D97706] font-mono truncate">
            Running: {activeStep.id}
          </p>
        )}
      </div>

      <div
        className={`overflow-y-auto p-3 font-mono text-[11px] space-y-1 ${
          compact ? "max-h-48" : "h-[calc(100%-5rem)] min-h-[200px]"
        }`}
      >
        {telemetryLogs.length === 0 ? (
          <p className="text-[#E4E4E7]/30">Awaiting pipeline signal…</p>
        ) : (
          telemetryLogs.slice(-12).map((line, i) => (
            <p key={i} className="text-[#E4E4E7]/60 leading-relaxed">
              <span className="text-[#D97706]">{">"}</span> {line}
            </p>
          ))
        )}
      </div>
    </div>
  );
}
