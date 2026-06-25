"use client";

import { Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLATFORMS } from "@/lib/constants";
import type { PlatformId } from "@/lib/constants";
import { CopyButton } from "@/components/editor/copy-button";

interface EditorColumnShellProps {
  platform: PlatformId;
  children: React.ReactNode;
  onRefine?: () => void;
  onSchedule?: () => void;
  copyText: string;
  refineButtonId?: string;
}

export function EditorColumnShell({
  platform,
  children,
  onRefine,
  onSchedule,
  copyText,
  refineButtonId,
}: EditorColumnShellProps) {
  const config = PLATFORMS[platform];

  return (
    <div className="flex flex-col h-full min-h-[360px] lg:min-h-[500px]">
      <div className="border-b border-[#242424] px-5 py-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-[#E4E4E7]">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.color }} />
          {config.label}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
      <div className="flex items-center gap-1 border-t border-[#242424] p-3">
        <Button
          id={refineButtonId}
          variant="ghost"
          size="sm"
          onClick={onRefine}
          className="touch-target min-h-[44px]"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refine with AI</span>
        </Button>
        <CopyButton text={copyText} />
        <Button variant="ghost" size="sm" onClick={onSchedule} className="touch-target min-h-[44px]">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Schedule</span>
        </Button>
      </div>
    </div>
  );
}
