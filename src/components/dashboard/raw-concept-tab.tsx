"use client";

import { useProjectStore } from "@/store/useProjectStore";

export function RawConceptTab() {
  const { currentSource, setSource } = useProjectStore();

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#E4E4E7]/55">
        Describe your idea, paste notes, or drop unstructured thoughts.
      </p>
      <textarea
        value={currentSource ?? ""}
        onChange={(e) => setSource(e.target.value, "concept")}
        placeholder="e.g. A thread about how AI is changing content marketing for solo founders…"
        rows={8}
        className="w-full resize-y rounded-xl border border-[#242424] bg-[#080808] p-4 text-sm text-[#E4E4E7] placeholder:text-[#E4E4E7]/30 focus:border-[#F59E0B]/40 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/20"
      />
    </div>
  );
}
