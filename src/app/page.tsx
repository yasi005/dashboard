import Link from "next/link";
import { ArrowRight, Calendar, Cog, Layers, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <nav className="sticky top-0 z-50 border-b border-[#242424] bg-[#141414]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Cog className="h-6 w-6 text-[#F59E0B]" />
            <span className="text-lg font-bold text-[#E4E4E7] tracking-tight">EchoSaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#E4E4E7]/55 hover:text-[#E4E4E7]">
              Sign In
            </Link>
            <Button asChild>
              <Link href="/login">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-md border border-[#F59E0B]/25 bg-[#F59E0B]/8 px-4 py-1.5 text-sm text-[#F59E0B] mb-8 font-mono uppercase tracking-wider">
            <Zap className="h-4 w-4" />
            Carbon &amp; Amber Engine
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-[#E4E4E7] sm:text-6xl">
            One source.
            <br />
            <span className="text-[#F59E0B]">Every channel.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#E4E4E7]/55">
            Industrial-grade content repurposing. Drop raw material, watch the pipeline
            process it, edit platform-native drafts with mechanical precision.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">
                Open the Sandbox
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/dashboard/editor">View Demo Editor</Link>
            </Button>
          </div>
        </section>

        <section className="border-t border-[#242424] bg-[#141414]/40 py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "Parallel Omni-Editor",
                desc: "Elastic column cascade. Edit X, LinkedIn, and Reels side-by-side.",
              },
              {
                icon: Zap,
                title: "Spring-Motion Pipeline",
                desc: "Source panel morphs into editor header. No jarring page cuts.",
              },
              {
                icon: Calendar,
                title: "Tactical Calendar",
                desc: "Drag posts across the grid with optimistic rollback.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[#242424] bg-[#141414] p-6 hover:border-[#F59E0B]/20 transition-colors"
              >
                <feature.icon className="mb-4 h-8 w-8 text-[#F59E0B]" />
                <h3 className="text-lg font-semibold text-[#E4E4E7]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#E4E4E7]/55">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#242424] py-8 text-center text-sm text-[#E4E4E7]/40">
        © {new Date().getFullYear()} EchoSaaS. Engineered interface. Not a template.
      </footer>
    </div>
  );
}
