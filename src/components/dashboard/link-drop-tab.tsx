"use client";

import { useEffect, useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import { TOUR_DEMO_URL } from "@/lib/tour-config";
import { useProjectStore } from "@/store/useProjectStore";
import { useTourStore } from "@/store/useTourStore";

export function LinkDropTab() {
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const setSource = useProjectStore((s) => s.setSource);
  const urlTypewriterToken = useTourStore((s) => s.urlTypewriterToken);

  useEffect(() => {
    if (urlTypewriterToken === 0) return;

    let cancelled = false;

    (async () => {
      for (let i = 1; i <= TOUR_DEMO_URL.length; i++) {
        if (cancelled) return;
        const slice = TOUR_DEMO_URL.slice(0, i);
        setUrl(slice);
        setSource(slice, "link");
        await new Promise((r) => setTimeout(r, 28));
      }
      window.dispatchEvent(new Event("echosaas-tour-typewriter-done"));
    })();

    return () => {
      cancelled = true;
    };
  }, [urlTypewriterToken, setSource]);

  const handleFetch = async () => {
    if (!url.trim()) return;
    setFetching(true);
    setSource(url, "link");
    await new Promise((r) => setTimeout(r, 800));
    setFetching(false);
  };

  return (
    <div id="sandboxInputZone" className="space-y-4">
      <p className="text-sm text-[#E4E4E7]/55">
        Paste a YouTube, Medium, or blog URL — we&apos;ll fetch and parse automatically.
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#E4E4E7]/40" />
          <input
            id="sandbox-url-input"
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (e.target.value) setSource(e.target.value, "link");
            }}
            placeholder="https://youtube.com/watch?v=…"
            className="w-full rounded-lg border border-[#242424] bg-[#080808] py-3 pl-10 pr-4 text-sm text-[#E4E4E7] placeholder:text-[#E4E4E7]/30 focus:border-[#F59E0B]/40 focus:outline-none focus:ring-1 focus:ring-[#F59E0B]/20"
          />
        </div>
        <button
          type="button"
          onClick={handleFetch}
          disabled={!url.trim() || fetching}
          className="rounded-lg border border-[#242424] bg-[#141414] px-4 text-sm text-[#E4E4E7]/55 hover:text-[#E4E4E7] disabled:opacity-50"
        >
          {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
        </button>
      </div>
    </div>
  );
}
