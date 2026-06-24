export const CONSOLE_METRICS = {
  totalReach: { value: "2.4M", delta: "+12.4%", highlighted: true },
  tokensUsed: { value: "4,819", delta: "+8.1%" },
  activePipelines: { value: "7", delta: "3 live" },
  campaignsGenerated: { value: "128", delta: "+24 this week" },
};

export const IMPACT_CHART_DATA = [
  { month: "Jan", clicks: 42 },
  { month: "Feb", clicks: 58 },
  { month: "Mar", clicks: 51 },
  { month: "Apr", clicks: 72 },
  { month: "May", clicks: 68 },
  { month: "Jun", clicks: 89 },
];

export const PLATFORM_EFFICIENCY = 73;

export interface DistributionLogRow {
  id: string;
  source: string;
  platform: string;
  status: "processing" | "distributed" | "scheduled";
  scheduledAt: string;
  draftId?: string;
}

export const MOCK_DISTRIBUTION_LOG: DistributionLogRow[] = [
  {
    id: "log-1",
    source: "blog/decoupling-latency",
    platform: "Mixed (X, LinkedIn)",
    status: "processing",
    scheduledAt: "—",
    draftId: "draft-twitter",
  },
  {
    id: "log-2",
    source: "youtube/saas-growth-2024",
    platform: "X (Twitter)",
    status: "distributed",
    scheduledAt: "Jun 18, 09:00",
    draftId: "draft-twitter",
  },
  {
    id: "log-3",
    source: "medium/content-repurposing",
    platform: "LinkedIn",
    status: "scheduled",
    scheduledAt: "Jun 22, 14:00",
    draftId: "draft-linkedin",
  },
  {
    id: "log-4",
    source: "notion/product-launch-notes",
    platform: "Instagram Reels",
    status: "distributed",
    scheduledAt: "Jun 15, 11:30",
    draftId: "draft-instagram",
  },
];
