import type { GenerationStepId } from "@/lib/constants";
import type { CalendarEvent, PostDraft } from "@/store/useProjectStore";

/** Expand these arrays to test alternative copywriting variations locally. */
export const alternativeDrafts = {
  X: [
    "Your custom variation 1 — thread hook engineered for maximum scroll-stop on X.",
    "Your custom variation 2 — contrarian opener that reframes the entire narrative in 240 chars.",
    "Your custom variation 3 — data-driven punchline with a numbered insight structure.",
  ],
  LinkedIn: [
    "Your custom business variant 1 — authority-led hook with whitespace rhythm for scanability.",
    "Your custom business variant 2 — story arc opening with a credibility anchor in line one.",
    "Your custom business variant 3 — contrarian thesis designed to drive comment-section debate.",
  ],
  Reels: [
    "Scene 1: Close-up terminal glow | Hook: Stop creating. Start translating.\nScene 2: Split-screen sources | One blog becomes a week of posts.\nScene 3: Amber UI cascade | EchoSaaS ships the campaign.\nScene 4: Logo lockup | Link in bio.",
    "Scene 1: Hands on keyboard | Your content is already good enough.\nScene 2: Platform icons animate | Distribution is the bottleneck.\nScene 3: Calendar grid fills | Schedule once, publish everywhere.",
  ],
  Threads: [
    "Hot take: repurposing beats creating from scratch every single time.",
    "Unpopular opinion: one great idea deserves four native formats, not one lazy repost.",
  ],
} as const;

export type RefineChannel = keyof typeof alternativeDrafts;

export const CHANNEL_TO_REFINE_KEY: Record<string, RefineChannel> = {
  twitter: "X",
  linkedin: "LinkedIn",
  instagram: "Reels",
  threads: "Threads",
};

export const TELEMETRY_BY_STEP: Record<GenerationStepId, { start: string; done: string }> = {
  scrape: {
    start: "[agent:scraper] Initializing headless fetch on target URL…",
    done: "[agent:scraper] DOM parsed. 2,847 tokens extracted. Handoff → semantic.",
  },
  themes: {
    start: "[agent:semantic] Running theme extraction on document corpus…",
    done: "[agent:semantic] 3 core themes locked. Confidence: 0.94. Handoff → synthesis.",
  },
  copywrite: {
    start: "[agent:synthesis] Generating omni-channel copy variants…",
    done: "[agent:synthesis] 4 platform drafts materialized. Pipeline sealed.",
  },
};

export const STORAGE_KEY = "echosaas-demo-state";

export interface PersistedDemoState {
  currentSource: string | null;
  sourceType: "link" | "document" | "concept" | null;
  generatedDrafts: PostDraft[];
  calendarEvents: CalendarEvent[];
  draftIterationIndexes: Record<string, number>;
}

export function loadPersistedState(): Partial<PersistedDemoState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedDemoState;
  } catch {
    return null;
  }
}

export function savePersistedState(state: PersistedDemoState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getRefineAlternative(
  platform: string,
  iterationIndex: number
): string | string[] | null {
  const key = CHANNEL_TO_REFINE_KEY[platform];
  if (!key) return null;
  const bank = alternativeDrafts[key];
  if (!bank?.length) return null;
  return bank[iterationIndex % bank.length];
}

export function splitTwitterBlocks(text: string): string[] {
  if (text.includes("\n\n")) return text.split(/\n\n+/).filter(Boolean);
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 280) {
    chunks.push(remaining.slice(0, 280));
    remaining = remaining.slice(280);
  }
  if (remaining) chunks.push(remaining);
  return chunks.length ? chunks : [text];
}

export function parseReelsScenes(text: string): { visual: string; audio: string }[] {
  return text.split("\n").filter(Boolean).map((line) => {
    const match = line.match(/^Scene \d+:\s*(.+?)\s*\|\s*(.+)$/i);
    if (match) return { visual: match[1].trim(), audio: match[2].trim() };
    const pipe = line.split("|");
    if (pipe.length >= 2) {
      return { visual: pipe[0].replace(/^Scene \d+:\s*/i, "").trim(), audio: pipe[1].trim() };
    }
    return { visual: line, audio: "" };
  });
}
