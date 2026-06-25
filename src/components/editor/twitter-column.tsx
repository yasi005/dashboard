"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { EditorColumnShell } from "@/components/editor/editor-column-shell";
import type { PostDraft } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

const TWITTER_MAX = 280;

interface TwitterColumnProps {
  draft: PostDraft;
  onUpdateBlocks: (blocks: string[]) => void;
  onRefine: () => void;
  onSchedule: () => void;
}

export function TwitterColumn({ draft, onUpdateBlocks, onRefine, onSchedule }: TwitterColumnProps) {
  const blocks = draft.blocks ?? [draft.content];

  const updateBlock = (index: number, value: string) => {
    const next = [...blocks];
    next[index] = value;
    onUpdateBlocks(next);
  };

  return (
    <EditorColumnShell
      platform="twitter"
      copyText={blocks.join("\n\n")}
      onRefine={onRefine}
      onSchedule={onSchedule}
      refineButtonId="refineX"
    >
      <div className="space-y-4">
        {blocks.map((block, i) => {
          const charCount = block.length;
          const overLimit = charCount > TWITTER_MAX;
          return (
            <div
              key={i}
              className="rounded-lg border border-[#242424] bg-[#080808] p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-[#E4E4E7]/55">
                  Thread Block #{i + 1}
                </span>
                <span
                  id={i === 0 ? "charCountX" : undefined}
                  className={cn(
                    "text-xs font-mono",
                    overLimit ? "text-red-400" : "text-[#E4E4E7]/45"
                  )}
                >
                  {charCount}/{TWITTER_MAX}
                </span>
              </div>
              <TiptapEditor
                content={block}
                onChange={(val) => updateBlock(i, val)}
                minimal
              />
            </div>
          );
        })}
      </div>
    </EditorColumnShell>
  );
}
