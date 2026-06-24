"use client";

import { ImpactChart } from "@/components/console/impact-chart";
import { MetricCard } from "@/components/console/metric-card";
import { EfficiencyWidget } from "@/components/console/efficiency-widget";
import { CONSOLE_METRICS } from "@/lib/console-metrics";

export default function AnalyticsPage() {
  const m = CONSOLE_METRICS;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E4E4E7] tracking-tight">Analytics</h2>
        <p className="mt-1 text-sm text-[#E4E4E7]/55">Extended performance matrices and channel insights.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Reach" value={m.totalReach.value} delta={m.totalReach.delta} highlighted />
        <MetricCard label="Tokens Used" value={m.tokensUsed.value} delta={m.tokensUsed.delta} />
        <MetricCard label="Active Pipelines" value={m.activePipelines.value} delta={m.activePipelines.delta} />
        <MetricCard label="Campaigns Generated" value={m.campaignsGenerated.value} delta={m.campaignsGenerated.delta} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImpactChart />
        </div>
        <EfficiencyWidget />
      </div>
    </div>
  );
}
