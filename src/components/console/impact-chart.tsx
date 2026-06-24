"use client";

import { IMPACT_CHART_DATA } from "@/lib/console-metrics";
import { cn } from "@/lib/utils";

export function ImpactChart() {
  const max = Math.max(...IMPACT_CHART_DATA.map((d) => d.clicks));

  return (
    <div className="rounded-xl border border-[#242424] bg-[#141414] p-5 h-full">
      <div className="mb-6">
        <p className="text-sm font-semibold text-[#E4E4E7]">System Impact Insights</p>
        <p className="text-xs text-[#E4E4E7]/45 mt-0.5">Multi-channel click spikes by month</p>
      </div>
      <div className="flex items-end justify-between gap-2 h-40">
        {IMPACT_CHART_DATA.map((item) => {
          const height = (item.clicks / max) * 100;
          return (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="relative w-full flex justify-center h-32 items-end">
                <div
                  className={cn(
                    "w-full max-w-[36px] rounded-t-md bg-[#1a1a1a] border border-[#242424]",
                    "transition-all duration-200 hover:bg-[#F59E0B]/20 hover:border-[#F59E0B]/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  )}
                  style={{ height: `${height}%` }}
                  title={`${item.clicks}k clicks`}
                />
              </div>
              <span className="text-[10px] font-mono text-[#E4E4E7]/45">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
