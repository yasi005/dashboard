export const PLATFORMS = {
  twitter: {
    id: "twitter" as const,
    label: "X (Twitter)",
    shortLabel: "X",
    color: "#FFFFFF",
    borderColor: "border-white/40",
    glowColor: "shadow-[0_0_12px_rgba(255,255,255,0.25)]",
    bgBadge: "bg-zinc-900 border-zinc-600",
  },
  linkedin: {
    id: "linkedin" as const,
    label: "LinkedIn",
    shortLabel: "LinkedIn",
    color: "#0A66C2",
    borderColor: "border-[#0A66C2]/60",
    glowColor: "shadow-[0_0_12px_rgba(10,102,194,0.35)]",
    bgBadge: "bg-[#0A66C2]/20 border-[#0A66C2]/50",
  },
  threads: {
    id: "threads" as const,
    label: "Threads",
    shortLabel: "Threads",
    color: "#FFFFFF",
    borderColor: "border-zinc-400/50",
    glowColor: "shadow-[0_0_12px_rgba(255,255,255,0.15)]",
    bgBadge: "bg-zinc-800 border-zinc-600",
  },
  instagram: {
    id: "instagram" as const,
    label: "Instagram Reels",
    shortLabel: "Reels",
    color: "#E1306C",
    borderColor: "border-[#E1306C]/60",
    glowColor: "shadow-[0_0_12px_rgba(225,48,108,0.35)]",
    bgBadge: "bg-[#E1306C]/20 border-[#E1306C]/50",
  },
} as const;

export type PlatformId = keyof typeof PLATFORMS;

export const GENERATION_STEPS = [
  { id: "scrape", label: "Scraping & Parsing" },
  { id: "themes", label: "Semantic Analysis" },
  { id: "copywrite", label: "Omni-Channel Synthesis" },
] as const;

export type GenerationStepId = (typeof GENERATION_STEPS)[number]["id"];
export type GenerationStepStatus = "pending" | "processing" | "success" | "error";
