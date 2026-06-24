"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DistributionLogRow } from "@/lib/console-metrics";
import { MOCK_DISTRIBUTION_LOG } from "@/lib/console-metrics";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  processing: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B]",
  distributed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  scheduled: "border-[#D97706]/30 bg-[#D97706]/10 text-[#D97706]",
};

function StatusBadge({ status }: { status: DistributionLogRow["status"] }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wide",
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  );
}

export function DistributionLog() {
  const isGenerating = useProjectStore((s) => s.isGenerating);
  const currentSource = useProjectStore((s) => s.currentSource);

  const rows: DistributionLogRow[] = [
    ...(isGenerating && currentSource
      ? [
          {
            id: "live",
            source: currentSource.slice(0, 32) + (currentSource.length > 32 ? "…" : ""),
            platform: "Mixed",
            status: "processing" as const,
            scheduledAt: "—",
            draftId: "draft-twitter",
          },
        ]
      : []),
    ...MOCK_DISTRIBUTION_LOG.filter((r) => r.status !== "processing" || !isGenerating),
  ];

  return (
    <div className="rounded-xl border border-[#242424] bg-[#141414] overflow-hidden">
      <div className="border-b border-[#242424] px-5 py-4">
        <p className="text-sm font-semibold text-[#E4E4E7]">Live Distribution Log</p>
        <p className="text-xs text-[#E4E4E7]/45">Pipeline output across all channels</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#242424] text-left">
              {["Campaign Source", "Platform", "Status", "Scheduled", "Action"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-[10px] uppercase tracking-[0.12em] text-[#E4E4E7]/40 font-mono font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[#242424]/60 last:border-0 hover:bg-[#080808]/50 transition-colors"
              >
                <td className="px-5 py-3.5 font-mono text-xs text-[#E4E4E7]/80">{row.source}</td>
                <td className="px-5 py-3.5 text-[#E4E4E7]/60">{row.platform}</td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-3.5 font-mono text-xs text-[#E4E4E7]/50">{row.scheduledAt}</td>
                <td className="px-5 py-3.5">
                  <Button variant="ghost" size="sm" asChild className="touch-target h-9 font-mono text-xs">
                    <Link href="/dashboard/editor">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Editor
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
