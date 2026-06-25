import type { GenerationStepId } from "@/lib/constants";
import { TELEMETRY_BY_STEP } from "@/lib/demo-engine";
import { generateMockDrafts } from "@/lib/mock-generation";
import { useProjectStore } from "@/store/useProjectStore";

const TOUR_STEP_DELAYS: Record<GenerationStepId, number> = {
  scrape: 900,
  themes: 1100,
  copywrite: 1300,
};

/** Accelerated pipeline for the guided tour — no auto-redirect. */
export async function runTourGeneration(): Promise<void> {
  const {
    setGenerating,
    resetGenerationSteps,
    setGenerationStep,
    setDrafts,
    clearTelemetryLogs,
    appendTelemetryLog,
    currentSource,
    selectedChannels,
  } = useProjectStore.getState();

  resetGenerationSteps();
  clearTelemetryLogs();
  setGenerating(true);
  appendTelemetryLog("Tour mode: pipeline agents waking…");

  const steps: GenerationStepId[] = ["scrape", "themes", "copywrite"];

  for (const step of steps) {
    const telemetry = TELEMETRY_BY_STEP[step];
    setGenerationStep(step, "processing");
    appendTelemetryLog(telemetry.start);
    await new Promise((r) => setTimeout(r, TOUR_STEP_DELAYS[step]));
    setGenerationStep(step, "success");
    appendTelemetryLog(telemetry.done);
  }

  const drafts = generateMockDrafts(
    currentSource ?? "https://engineering.blog/decoupling-latency",
    selectedChannels
  );
  setDrafts(drafts);
  appendTelemetryLog("Drafts bound to omni-editor. Tour advancing…");
  setGenerating(false);
}
