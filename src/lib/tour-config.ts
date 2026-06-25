export const TOUR_DEMO_URL = "https://engineering.blog/decoupling-latency";

export type TourStepId = 1 | 2 | 3 | 4;

export interface TourStepConfig {
  step: TourStepId;
  heading: string;
  body: string;
  targets: string[];
  route: "/dashboard/sandbox" | "/dashboard/editor";
}

export const TOUR_STEPS: TourStepConfig[] = [
  {
    step: 1,
    heading: "Context Sandbox",
    body: "Welcome to the Context Sandbox. Drop a raw technical reference link or design specification sheet here silently—no typing or talking required.",
    targets: ["sandboxInputZone"],
    route: "/dashboard/sandbox",
  },
  {
    step: 2,
    heading: "Multi-Agent Compute Engine",
    body: "Watch the telemetry stream. Clicking generate wakes up three independent background workers: Scraping, Semantic Filtering, and Omni-Channel Synthesis. Each step logs real-time network states.",
    targets: ["loggerBox"],
    route: "/dashboard/sandbox",
  },
  {
    step: 3,
    heading: "Omni-Channel Suite",
    body: "The layout states are bound. The system automatically populates distinct, platform-optimized copywriting drafts into isolated, interactive rich-text editor blocks simultaneously.",
    targets: ["omniEditorView"],
    route: "/dashboard/editor",
  },
  {
    step: 4,
    heading: "Live Calibration",
    body: "Full user control remains intact. Modify text lines directly to track live safety character counters, or trigger an internal refinement rotation to swap content matrices instantly.",
    targets: ["charCountX", "refineX"],
    route: "/dashboard/editor",
  },
];

export const TOUR_SPOTLIGHT_SPRING = {
  type: "spring" as const,
  stiffness: 150,
  damping: 22,
};
