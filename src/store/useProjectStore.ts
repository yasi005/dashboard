import { create } from "zustand";
import type { GenerationStepId, GenerationStepStatus, PlatformId } from "@/lib/constants";
import type { PersistedDemoState } from "@/lib/demo-engine";
import { loadPersistedState, savePersistedState } from "@/lib/demo-engine";

export interface PostDraft {
  id: string;
  platform: PlatformId;
  content: string;
  blocks?: string[];
  instagramScenes?: { visual: string; audio: string }[];
}

export interface CalendarEvent {
  id: string;
  draftId: string;
  platform: PlatformId;
  title: string;
  scheduledAt: string;
}

export interface GenerationStep {
  id: GenerationStepId;
  status: GenerationStepStatus;
}

export type AutosaveStatus = "idle" | "pending" | "synced";

interface ProjectStore {
  hydrated: boolean;
  currentSource: string | null;
  sourceType: "link" | "document" | "concept" | null;
  selectedChannels: PlatformId[];
  isGenerating: boolean;
  generationSteps: GenerationStep[];
  telemetryLogs: string[];
  generatedDrafts: PostDraft[];
  calendarEvents: CalendarEvent[];
  draftIterationIndexes: Record<string, number>;
  autosaveStatus: AutosaveStatus;
  scheduleModalOpen: boolean;
  schedulingDraftId: string | null;
  selectedScheduleDate: string | null;

  hydrateFromStorage: () => void;
  setSource: (source: string, type: "link" | "document" | "concept") => void;
  toggleChannel: (channel: PlatformId) => void;
  setGenerating: (status: boolean) => void;
  setGenerationStep: (id: GenerationStepId, status: GenerationStepStatus) => void;
  resetGenerationSteps: () => void;
  appendTelemetryLog: (line: string) => void;
  clearTelemetryLogs: () => void;
  setDrafts: (drafts: PostDraft[]) => void;
  updateSingleDraft: (id: string, updatedContent: string) => void;
  updateDraftBlocks: (id: string, blocks: string[]) => void;
  updateInstagramScenes: (id: string, scenes: { visual: string; audio: string }[]) => void;
  incrementDraftIteration: (draftId: string) => number;
  setAutosaveStatus: (status: AutosaveStatus) => void;
  persistToStorage: () => void;
  openScheduleModal: (draftId: string) => void;
  closeScheduleModal: () => void;
  setSelectedScheduleDate: (dateKey: string | null) => void;
  scheduleDraft: (draftId: string, scheduledAt: string) => void;
  moveCalendarEvent: (eventId: string, newScheduledAt: string) => void;
  rollbackCalendarEvent: (eventId: string, previousScheduledAt: string) => void;
}

const initialSteps = (): GenerationStep[] => [
  { id: "scrape", status: "pending" },
  { id: "themes", status: "pending" },
  { id: "copywrite", status: "pending" },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  hydrated: false,
  currentSource: null,
  sourceType: null,
  selectedChannels: ["twitter", "linkedin", "instagram"],
  isGenerating: false,
  generationSteps: initialSteps(),
  telemetryLogs: [],
  generatedDrafts: [],
  calendarEvents: [],
  draftIterationIndexes: {},
  autosaveStatus: "idle",
  scheduleModalOpen: false,
  schedulingDraftId: null,
  selectedScheduleDate: null,

  hydrateFromStorage: () => {
    const saved = loadPersistedState();
    if (saved) {
      set({
        hydrated: true,
        currentSource: saved.currentSource ?? null,
        sourceType: saved.sourceType ?? null,
        generatedDrafts: saved.generatedDrafts ?? [],
        calendarEvents: saved.calendarEvents ?? [],
        draftIterationIndexes: saved.draftIterationIndexes ?? {},
        autosaveStatus: saved.generatedDrafts?.length ? "synced" : "idle",
      });
    } else {
      set({ hydrated: true });
    }
  },

  setSource: (source, type) => set({ currentSource: source, sourceType: type }),

  toggleChannel: (channel) =>
    set((state) => {
      const selected = state.selectedChannels.includes(channel)
        ? state.selectedChannels.filter((c) => c !== channel)
        : [...state.selectedChannels, channel];
      return { selectedChannels: selected.length ? selected : state.selectedChannels };
    }),

  setGenerating: (status) => set({ isGenerating: status }),

  setGenerationStep: (id, status) =>
    set((state) => ({
      generationSteps: state.generationSteps.map((step) =>
        step.id === id ? { ...step, status } : step
      ),
    })),

  resetGenerationSteps: () => set({ generationSteps: initialSteps() }),

  appendTelemetryLog: (line) =>
    set((state) => ({
      telemetryLogs: [...state.telemetryLogs, `[${timestamp()}] ${line}`],
    })),

  clearTelemetryLogs: () => set({ telemetryLogs: [] }),

  setDrafts: (drafts) => {
    set({ generatedDrafts: drafts });
    get().persistToStorage();
  },

  updateSingleDraft: (id, updatedContent) => {
    set((state) => ({
      generatedDrafts: state.generatedDrafts.map((draft) =>
        draft.id === id ? { ...draft, content: updatedContent } : draft
      ),
    }));
  },

  updateDraftBlocks: (id, blocks) => {
    set((state) => ({
      generatedDrafts: state.generatedDrafts.map((draft) =>
        draft.id === id ? { ...draft, blocks, content: blocks.join("\n\n") } : draft
      ),
    }));
  },

  updateInstagramScenes: (id, scenes) => {
    set((state) => ({
      generatedDrafts: state.generatedDrafts.map((draft) =>
        draft.id === id
          ? {
              ...draft,
              instagramScenes: scenes,
              content: scenes.map((s) => `${s.visual} | ${s.audio}`).join("\n"),
            }
          : draft
      ),
    }));
  },

  incrementDraftIteration: (draftId) => {
    const current = get().draftIterationIndexes[draftId] ?? 0;
    const next = current + 1;
    set((state) => ({
      draftIterationIndexes: { ...state.draftIterationIndexes, [draftId]: next },
    }));
    return next;
  },

  setAutosaveStatus: (status) => set({ autosaveStatus: status }),

  persistToStorage: () => {
    const state = get();
    const payload: PersistedDemoState = {
      currentSource: state.currentSource,
      sourceType: state.sourceType,
      generatedDrafts: state.generatedDrafts,
      calendarEvents: state.calendarEvents,
      draftIterationIndexes: state.draftIterationIndexes,
    };
    savePersistedState(payload);
  },

  openScheduleModal: (draftId) =>
    set({ scheduleModalOpen: true, schedulingDraftId: draftId, selectedScheduleDate: null }),

  closeScheduleModal: () =>
    set({ scheduleModalOpen: false, schedulingDraftId: null, selectedScheduleDate: null }),

  setSelectedScheduleDate: (dateKey) => set({ selectedScheduleDate: dateKey }),

  scheduleDraft: (draftId, scheduledAt) => {
    const draft = get().generatedDrafts.find((d) => d.id === draftId);
    if (!draft) return;

    const event: CalendarEvent = {
      id: `evt-${draftId}-${Date.now()}`,
      draftId,
      platform: draft.platform,
      title: draft.content.slice(0, 48) + (draft.content.length > 48 ? "…" : ""),
      scheduledAt,
    };

    set((state) => ({
      calendarEvents: [...state.calendarEvents.filter((e) => e.draftId !== draftId), event],
    }));
    get().persistToStorage();
  },

  moveCalendarEvent: (eventId, newScheduledAt) => {
    set((state) => ({
      calendarEvents: state.calendarEvents.map((event) =>
        event.id === eventId ? { ...event, scheduledAt: newScheduledAt } : event
      ),
    }));
    get().persistToStorage();
  },

  rollbackCalendarEvent: (eventId, previousScheduledAt) => {
    set((state) => ({
      calendarEvents: state.calendarEvents.map((event) =>
        event.id === eventId ? { ...event, scheduledAt: previousScheduledAt } : event
      ),
    }));
    get().persistToStorage();
  },
}));

function timestamp(): string {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}
