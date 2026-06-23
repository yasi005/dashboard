"use client";

import { useCallback, useEffect, useRef } from "react";
import type { GenerationStepId } from "@/lib/constants";
import { TELEMETRY_BY_STEP } from "@/lib/demo-engine";
import { useProjectStore } from "@/store/useProjectStore";
import { generateMockDrafts } from "@/lib/mock-generation";

interface UseGenerationStreamOptions {
  onComplete?: () => void;
  enabled?: boolean;
}

const STEP_DELAYS: Record<GenerationStepId, number> = {
  scrape: 1400,
  themes: 1800,
  copywrite: 2200,
};

export function useGenerationStream({ onComplete, enabled = true }: UseGenerationStreamOptions = {}) {
  const abortRef = useRef<AbortController | null>(null);
  const lockedRef = useRef(false);
  const {
    setGenerating,
    resetGenerationSteps,
    setGenerationStep,
    setDrafts,
    clearTelemetryLogs,
    appendTelemetryLog,
    currentSource,
    selectedChannels,
  } = useProjectStore();

  const simulateGeneration = useCallback(async () => {
    if (lockedRef.current) return;
    lockedRef.current = true;

    resetGenerationSteps();
    clearTelemetryLogs();
    setGenerating(true);
    appendTelemetryLog("Pipeline initialized. Duplicate calls locked.");

    const steps: GenerationStepId[] = ["scrape", "themes", "copywrite"];

    for (const step of steps) {
      const telemetry = TELEMETRY_BY_STEP[step];
      setGenerationStep(step, "processing");
      appendTelemetryLog(telemetry.start);
      await new Promise((resolve) => setTimeout(resolve, STEP_DELAYS[step]));
      setGenerationStep(step, "success");
      appendTelemetryLog(telemetry.done);
    }

    const drafts = generateMockDrafts(currentSource ?? "Your content", selectedChannels);
    setDrafts(drafts);
    appendTelemetryLog("Drafts bound to omni-editor. Redirecting…");
    setGenerating(false);
    lockedRef.current = false;
    onComplete?.();
  }, [
    appendTelemetryLog,
    clearTelemetryLogs,
    currentSource,
    onComplete,
    resetGenerationSteps,
    selectedChannels,
    setDrafts,
    setGenerating,
    setGenerationStep,
  ]);

  const connectSSE = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      await simulateGeneration();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    resetGenerationSteps();
    clearTelemetryLogs();
    setGenerating(true);

    try {
      const response = await fetch(`${apiUrl}/api/generate/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: currentSource, channels: selectedChannels }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        await simulateGeneration();
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = JSON.parse(line.slice(6)) as {
            type: "step" | "log" | "complete";
            step?: GenerationStepId;
            status?: "processing" | "success" | "error";
            message?: string;
            drafts?: ReturnType<typeof generateMockDrafts>;
          };

          if (payload.type === "log" && payload.message) {
            appendTelemetryLog(payload.message);
          }

          if (payload.type === "step" && payload.step && payload.status) {
            setGenerationStep(payload.step, payload.status);
            const telemetry = TELEMETRY_BY_STEP[payload.step];
            if (payload.status === "processing") appendTelemetryLog(telemetry.start);
            if (payload.status === "success") appendTelemetryLog(telemetry.done);
          }

          if (payload.type === "complete" && payload.drafts) {
            setDrafts(payload.drafts);
            setGenerating(false);
            lockedRef.current = false;
            onComplete?.();
          }
        }
      }
    } catch {
      if (!controller.signal.aborted) {
        await simulateGeneration();
      }
    }
  }, [
    appendTelemetryLog,
    clearTelemetryLogs,
    currentSource,
    onComplete,
    resetGenerationSteps,
    selectedChannels,
    setDrafts,
    setGenerating,
    setGenerationStep,
    simulateGeneration,
  ]);

  const startGeneration = useCallback(() => {
    if (!enabled || lockedRef.current) return;
    void connectSSE();
  }, [connectSSE, enabled]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      lockedRef.current = false;
    };
  }, []);

  return { startGeneration };
}
