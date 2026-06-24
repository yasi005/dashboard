"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UpgradeBlock() {
  return (
    <div className="rounded-xl border border-[#242424] bg-[#080808] p-4 shadow-[inset_0_1px_0_rgba(245,158,11,0.05)]">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-4 w-4 text-[#F59E0B]" />
        <p className="text-xs font-semibold text-[#E4E4E7]">Upgrade to Pro</p>
      </div>
      <p className="text-[10px] text-[#E4E4E7]/45 leading-relaxed mb-3">
        Unlock unlimited pipelines, priority agent processing, and white-label exports.
      </p>
      <Button asChild size="sm" className="w-full shadow-[0_0_16px_rgba(245,158,11,0.2)]">
        <Link href="/dashboard/billing">Upgrade Now</Link>
      </Button>
    </div>
  );
}
