"use client";

import { PLATFORMS, type PlatformId } from "@/lib/constants";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

const CHANNEL_ORDER: PlatformId[] = ["twitter", "linkedin", "threads", "instagram"];

export function ChannelSelectors() {
  const { selectedChannels, toggleChannel } = useProjectStore();

  return (
    <div className="flex flex-wrap gap-3">
      {CHANNEL_ORDER.map((id) => {
        const config = PLATFORMS[id];
        const selected = selectedChannels.includes(id);

        return (
          <button
            key={id}
            type="button"
            onClick={() => toggleChannel(id)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 transition-all touch-target min-h-[44px]",
              "bg-[#080808] border-[#242424] hover:border-[#F59E0B]/30",
              selected && config.borderColor,
              selected && config.glowColor
            )}
          >
            <PlatformIcon platform={id} />
            <span className="text-sm font-medium text-[#E4E4E7]">{config.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

function PlatformIcon({ platform }: { platform: PlatformId }) {
  const icons: Record<PlatformId, React.ReactNode> = {
    twitter: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#0A66C2]">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    threads: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
        <path d="M12.186 0C8.74 0 5.94 1.37 3.82 3.82c-1.37 1.37-2.05 3.05-2.05 4.79 0 1.74.68 3.42 2.05 4.79 2.12 2.45 4.92 3.82 8.366 3.82h.007c3.453 0 6.253-1.37 8.373-3.82 1.37-1.37 2.05-3.05 2.05-4.79 0-1.74-.68-3.42-2.05-4.79C18.44 1.37 15.64 0 12.186 0zm0 2.18c2.72 0 4.92 1.02 6.58 2.92.82.95 1.23 2.05 1.23 3.18 0 1.13-.41 2.23-1.23 3.18-1.66 1.9-3.86 2.92-6.58 2.92-2.72 0-4.92-1.02-6.58-2.92-.82-.95-1.23-2.05-1.23-3.18 0-1.13.41-2.23 1.23-3.18 1.66-1.9 3.86-2.92 6.58-2.92z" />
      </svg>
    ),
    instagram: (
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <path
          fill="url(#ig-grad)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
        />
      </svg>
    ),
  };

  return icons[platform];
}
