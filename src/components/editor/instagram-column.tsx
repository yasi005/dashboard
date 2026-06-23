"use client";

import { EditorColumnShell } from "@/components/editor/editor-column-shell";
import { TiptapEditor } from "@/components/editor/tiptap-editor";
import type { PostDraft } from "@/store/useProjectStore";

interface InstagramColumnProps {
  draft: PostDraft;
  onUpdateScenes: (scenes: { visual: string; audio: string }[]) => void;
  onRefine: () => void;
  onSchedule: () => void;
}

export function InstagramColumn({
  draft,
  onUpdateScenes,
  onRefine,
  onSchedule,
}: InstagramColumnProps) {
  const scenes = draft.instagramScenes ?? [];

  const updateScene = (index: number, field: "visual" | "audio", value: string) => {
    const next = scenes.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    onUpdateScenes(next);
  };

  const copyText = scenes.map((s) => `[Visual] ${s.visual}\n[Audio] ${s.audio}`).join("\n\n");

  return (
    <EditorColumnShell
      platform="instagram"
      copyText={copyText}
      onRefine={onRefine}
      onSchedule={onSchedule}
    >
      <div className="space-y-3">
        {scenes.map((scene, i) => (
          <div
            key={i}
            className="grid grid-cols-2 gap-2 rounded-lg border border-[#E1306C]/20 bg-[#080808] p-3"
          >
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#E1306C] mb-1.5">
                Visual Cue
              </p>
              <TiptapEditor
                content={scene.visual}
                onChange={(val) => updateScene(i, "visual", val)}
                minimal
                className="min-h-[60px]"
              />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#D97706] mb-1.5">
                Audio / Voiceover
              </p>
              <TiptapEditor
                content={scene.audio}
                onChange={(val) => updateScene(i, "audio", val)}
                minimal
                className="min-h-[60px]"
              />
            </div>
          </div>
        ))}
      </div>
    </EditorColumnShell>
  );
}
