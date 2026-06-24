"use client";

import { PLATFORM_EFFICIENCY } from "@/lib/console-metrics";

export function EfficiencyWidget() {
  return (
    <div className="rounded-xl border border-[#242424] bg-[#141414] p-5 h-full flex flex-col justify-between">
      <div>
        <p className="text-sm font-semibold text-[#E4E4E7]">Platform Efficiency</p>
        <p className="text-xs text-[#E4E4E7]/45 mt-0.5">Marketing time saved vs manual drafting</p>
      </div>

      <div className="my-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold font-mono text-[#F59E0B]">{PLATFORM_EFFICIENCY}%</span>
          <span className="text-xs text-[#E4E4E7]/45 font-mono">saved</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-2 rounded-full bg-[#080808] border border-[#242424] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#F59E0B]"
            style={{ width: `${PLATFORM_EFFICIENCY}%` }}
          />
        </div>
        <p className="text-[10px] text-[#E4E4E7]/35 font-mono leading-relaxed">
          Multi-agent framework vs manual channel-by-channel repurposing
        </p>
      </div>
    </div>
  );
}
