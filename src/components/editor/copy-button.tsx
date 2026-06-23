"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
    }));
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 600);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={cn("relative overflow-visible touch-target min-h-[44px] min-w-[44px]", className)}
    >
      <motion.div
        animate={copied ? { scale: [1, 1.3, 1] } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#F59E0B]" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </motion.div>
      <span className="sr-only">Copy</span>

      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 1, x: s.x, y: s.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[#F59E0B]"
          />
        ))}
      </AnimatePresence>
    </Button>
  );
}
