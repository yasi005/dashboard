"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { EditorColumnShell } from "@/components/editor/editor-column-shell";
import type { PostDraft } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

const LINKEDIN_SOFT_MAX = 3000;

interface LinkedInColumnProps {
  draft: PostDraft;
  onUpdate: (content: string) => void;
  onRefine: () => void;
  onSchedule: () => void;
}

export function LinkedInColumn({ draft, onUpdate, onRefine, onSchedule }: LinkedInColumnProps) {
  const lines = draft.content.split("\n");
  const hook = lines[0] ?? "";
  const charCount = draft.content.length;
  const overLimit = charCount > LINKEDIN_SOFT_MAX;

  return (
    <EditorColumnShell
      platform="linkedin"
      copyText={draft.content}
      onRefine={onRefine}
      onSchedule={onSchedule}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider text-[#0A66C2]">Hook Preview</span>
          <span
            className={cn(
              "text-xs font-mono",
              overLimit ? "text-red-400" : "text-[#E4E4E7]/45"
            )}
          >
            {charCount} / {LINKEDIN_SOFT_MAX}
          </span>
        </div>
        <div className="rounded-lg border border-[#0A66C2]/30 bg-[#0A66C2]/5 p-4">
          <p className="text-base font-semibold text-[#E4E4E7] leading-snug">{hook}</p>
        </div>
        <TiptapEditor
          content={draft.content}
          onChange={onUpdate}
          placeholder="Write your LinkedIn post…"
        />
      </div>
    </EditorColumnShell>
  );
}
