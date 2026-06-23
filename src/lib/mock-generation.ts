import type { PlatformId } from "@/lib/constants";
import type { PostDraft } from "@/store/useProjectStore";

export function generateMockDrafts(source: string, channels: PlatformId[]): PostDraft[] {
  const excerpt = source.slice(0, 80).trim() || "your latest insight";
  const drafts: PostDraft[] = [];

  if (channels.includes("twitter")) {
    drafts.push({
      id: "draft-twitter",
      platform: "twitter",
      content: "",
      blocks: [
        `🧵 Thread on ${excerpt} — here's what most people miss about repurposing content across channels.`,
        `The secret isn't copying. It's translating intent. Each platform has its own rhythm, hook style, and attention window.`,
        `Start with one strong idea. Extract 3 core themes. Then reshape each theme for the channel's native format.`,
        `X loves punchy hooks + numbered insights. LinkedIn wants story + credibility. Reels need visual beats every 2–3 seconds.`,
        `EchoSaaS automates the translation layer so you edit, not reinvent. Drop a link. Get a campaign. Ship faster.`,
      ],
    });
  }

  if (channels.includes("linkedin")) {
    drafts.push({
      id: "draft-linkedin",
      platform: "linkedin",
      content: `Stop posting the same caption everywhere.\n\n${excerpt} deserves a format that respects how LinkedIn actually works.\n\n• Lead with a contrarian hook\n• Use whitespace for scanability\n• End with a question that invites replies\n\nRepurposing isn't lazy — it's strategic when you treat each channel as a different audience contract.`,
    });
  }

  if (channels.includes("instagram")) {
    drafts.push({
      id: "draft-instagram",
      platform: "instagram",
      content: "",
      instagramScenes: [
        { visual: "Dark room, laptop glow on face", audio: "You don't need more content. You need better distribution." },
        { visual: "Split screen: blog vs. 3 social posts", audio: `One source — "${excerpt.slice(0, 40)}…" — becomes an entire week of posts.` },
        { visual: "Timeline UI animating channel drafts", audio: "EchoSaaS turns raw material into platform-native campaigns in minutes." },
        { visual: "CTA card with logo", audio: "Link in bio. Start your multi-channel campaign today." },
      ],
    });
  }

  if (channels.includes("threads")) {
    drafts.push({
      id: "draft-threads",
      platform: "threads",
      content: `Hot take: repurposing > creating from scratch.\n\n${excerpt} — but written for people who scroll fast and reply faster.`,
    });
  }

  return drafts;
}
