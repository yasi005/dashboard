"use client";

import { useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { AutosaveIndicator } from "@/components/dashboard/autosave-indicator";
import { ScheduleModal } from "@/components/calendar/schedule-modal";
import { InstagramColumn } from "@/components/editor/instagram-column";
import { LinkedInColumn } from "@/components/editor/linkedin-column";
import { TwitterColumn } from "@/components/editor/twitter-column";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { EditorColumnShell } from "@/components/editor/editor-column-shell";
import { MobileEditorTabs } from "@/components/editor/mobile-editor-tabs";
import { ElasticColumnWrapper } from "@/components/motion/elastic-column-wrapper";
import { SourceMorphPanel } from "@/components/motion/source-morph-panel";
import { useDebouncedAutosave } from "@/hooks/useDebouncedAutosave";
import { PLATFORMS } from "@/lib/constants";
import {
  getRefineAlternative,
  parseReelsScenes,
  splitTwitterBlocks,
} from "@/lib/demo-engine";
import { generateMockDrafts } from "@/lib/mock-generation";
import type { PostDraft } from "@/store/useProjectStore";
import { useProjectStore } from "@/store/useProjectStore";

const MOBILE_TAB_LABELS: Record<string, string> = {
  twitter: "X Draft",
  linkedin: "LinkedIn",
  instagram: "Reels Script",
  threads: "Threads",
};

export default function EditorPage() {
  useDebouncedAutosave();

  const {
    generatedDrafts,
    hydrated,
    setDrafts,
    updateSingleDraft,
    updateDraftBlocks,
    updateInstagramScenes,
    incrementDraftIteration,
    openScheduleModal,
    currentSource,
    selectedChannels,
  } = useProjectStore();

  useEffect(() => {
    if (!hydrated) return;
    if (generatedDrafts.length === 0) {
      const drafts = generateMockDrafts(
        currentSource ?? "Demo content for EchoSaaS portfolio showcase",
        selectedChannels
      );
      setDrafts(drafts);
    }
  }, [generatedDrafts.length, currentSource, selectedChannels, setDrafts, hydrated]);

  const handleRefine = useCallback(
    (draftId: string, platform: string) => {
      const draft = generatedDrafts.find((d) => d.id === draftId);
      if (!draft) return;

      const iteration = incrementDraftIteration(draftId);
      const alt = getRefineAlternative(platform, iteration - 1);
      if (!alt) return;

      const text = typeof alt === "string" ? alt : alt.join("\n");

      if (platform === "twitter") {
        updateDraftBlocks(draftId, splitTwitterBlocks(text));
      } else if (platform === "instagram") {
        updateInstagramScenes(draftId, parseReelsScenes(text));
      } else {
        updateSingleDraft(draftId, text);
      }

      const label = PLATFORMS[draft.platform as keyof typeof PLATFORMS]?.label ?? platform;
      toast.success(`${label} — Variation ${iteration} loaded`, {
        description: "Alternative copywriting bank rotation applied.",
      });
    },
    [generatedDrafts, incrementDraftIteration, updateDraftBlocks, updateInstagramScenes, updateSingleDraft]
  );

  const handleSchedule = useCallback(
    (draftId: string) => openScheduleModal(draftId),
    [openScheduleModal]
  );

  const columns = useMemo(() => {
    const items: { key: string; draft: PostDraft }[] = [];
    for (const platform of ["twitter", "linkedin", "instagram", "threads"] as const) {
      const draft = generatedDrafts.find((d) => d.platform === platform);
      if (draft) items.push({ key: platform, draft });
    }
    return items;
  }, [generatedDrafts]);

  const mobileTabs = columns.map((c) => ({
    id: c.key,
    label: MOBILE_TAB_LABELS[c.key] ?? c.key,
  }));

  const renderColumnContent = (col: { key: string; draft: PostDraft }) => {
    const { draft } = col;
    switch (col.key) {
      case "twitter":
        return (
          <TwitterColumn
            draft={draft}
            onUpdateBlocks={(blocks) => updateDraftBlocks(draft.id, blocks)}
            onRefine={() => handleRefine(draft.id, draft.platform)}
            onSchedule={() => handleSchedule(draft.id)}
          />
        );
      case "linkedin":
        return (
          <LinkedInColumn
            draft={draft}
            onUpdate={(content) => updateSingleDraft(draft.id, content)}
            onRefine={() => handleRefine(draft.id, draft.platform)}
            onSchedule={() => handleSchedule(draft.id)}
          />
        );
      case "instagram":
        return (
          <InstagramColumn
            draft={draft}
            onUpdateScenes={(scenes) => updateInstagramScenes(draft.id, scenes)}
            onRefine={() => handleRefine(draft.id, draft.platform)}
            onSchedule={() => handleSchedule(draft.id)}
          />
        );
      case "threads":
        return (
          <EditorColumnShell
            platform="threads"
            copyText={draft.content}
            onRefine={() => handleRefine(draft.id, draft.platform)}
            onSchedule={() => handleSchedule(draft.id)}
          >
            <TiptapEditor
              content={draft.content}
              onChange={(content) => updateSingleDraft(draft.id, content)}
            />
          </EditorColumnShell>
        );
      default:
        return null;
    }
  };

  const total = columns.length;

  return (
    <div className="space-y-5" id="omni-editor">
      <ScheduleModal />
      <SourceMorphPanel variant="editor" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E4E4E7] tracking-tight">Omni-Editor</h2>
          <p className="mt-1 text-sm text-[#E4E4E7]/55">
            Side-by-side on desktop · tabbed on mobile
          </p>
        </div>
        <AutosaveIndicator />
      </div>

      <div id="omniEditorView" className="space-y-4">
        <MobileEditorTabs tabs={mobileTabs}>
          {(activeId) => {
            const col = columns.find((c) => c.key === activeId);
            if (!col) return null;
            return (
              <div className="rounded-xl border border-[#242424] bg-[#141414] overflow-hidden min-h-[400px]">
                {renderColumnContent(col)}
              </div>
            );
          }}
        </MobileEditorTabs>

        <div className="hidden lg:grid gap-4 lg:grid-cols-3">
          {columns.map((col, index) => (
            <ElasticColumnWrapper key={col.key} index={index} total={total} className="p-0">
              {renderColumnContent(col)}
            </ElasticColumnWrapper>
          ))}
        </div>
      </div>
    </div>
  );
}
