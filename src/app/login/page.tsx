"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";
import { setAuthenticated } from "@/components/auth/auth-gate";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setAuthenticated();
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-[#080808] flex items-center justify-center p-4 overflow-hidden">
      {/* Industrial grid mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(#E4E4E7 1px, transparent 1px),
            linear-gradient(90deg, #E4E4E7 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08)_0%,transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className={cn(
          "relative w-full max-w-md border border-[#242424] bg-[#141414] p-6 sm:p-8",
          "rounded-none sm:rounded-xl"
        )}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#242424] bg-[#080808]">
            <Cog className="h-5 w-5 text-[#F59E0B]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#E4E4E7] tracking-tight">EchoSaaS</h1>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#E4E4E7]/45 font-mono">
              Machined Access Gateway
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-[#E4E4E7]/45 font-mono">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              placeholder="operator@echosaas.io"
              className={cn(
                "w-full border bg-[#080808] px-4 py-3 font-mono text-sm text-[#E4E4E7] placeholder:text-[#E4E4E7]/25 transition-all touch-target",
                focused === "email"
                  ? "border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "border-[#242424]"
              )}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-wider text-[#E4E4E7]/45 font-mono">
              Security Cipher
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              placeholder="••••••••••••"
              className={cn(
                "w-full border bg-[#080808] px-4 py-3 font-mono text-sm text-[#E4E4E7] placeholder:text-[#E4E4E7]/25 transition-all touch-target",
                focused === "password"
                  ? "border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "border-[#242424]"
              )}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className={cn(
              "touch-target w-full bg-[#F59E0B] py-3.5 text-sm font-semibold text-[#080808] transition-all",
              "hover:bg-[#D97706] disabled:opacity-40 disabled:cursor-not-allowed",
              loading && "opacity-80"
            )}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#080808] border-t-transparent" />
                Authorizing…
              </span>
            ) : (
              "Authorize Access"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[10px] text-[#E4E4E7]/35 font-mono">
          Portfolio demo — any credentials grant access
        </p>
      </motion.div>
    </div>
  );
}
