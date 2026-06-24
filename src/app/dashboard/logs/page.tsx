"use client";

import { GenerationLoader } from "@/components/editor/generation-loader";
import { AgentTelemetryPanel } from "@/components/dashboard/agent-telemetry-panel";
import { useProjectStore } from "@/store/useProjectStore";

export default function AgentLogsPage() {
  const { telemetryLogs, isGenerating } = useProjectStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E4E4E7] tracking-tight">Agent Logs</h2>
        <p className="mt-1 text-sm text-[#E4E4E7]/55">
          Full telemetry stream from autonomous pipeline nodes.
        </p>
      </div>

      {isGenerating ? (
        <GenerationLoader />
      ) : (
        <AgentTelemetryPanel />
      )}

      {telemetryLogs.length > 0 && !isGenerating && (
        <div className="rounded-xl border border-[#242424] bg-[#080808] p-4 font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
          {telemetryLogs.map((line, i) => (
            <p key={i} className="text-[#E4E4E7]/60">
              <span className="text-[#D97706]">{">"}</span> {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
