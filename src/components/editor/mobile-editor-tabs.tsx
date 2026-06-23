"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MobileEditorTabsProps {
  tabs: { id: string; label: string }[];
  children: (activeId: string) => React.ReactNode;
}

export function MobileEditorTabs({ tabs, children }: MobileEditorTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  if (tabs.length === 0) return null;

  return (
    <div className="lg:hidden space-y-4">
      <div className="flex gap-1 overflow-x-auto border-b border-[#242424] pb-px -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "touch-target relative shrink-0 px-4 py-2.5 text-xs font-semibold font-mono uppercase tracking-wide transition-colors",
              active === tab.id ? "text-[#E4E4E7]" : "text-[#E4E4E7]/45"
            )}
          >
            {tab.label}
            {active === tab.id && (
              <motion.div
                layoutId="mobile-editor-tab"
                className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#D97706]"
                transition={spring.switch}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={spring.card}
      >
        {children(active)}
      </motion.div>
    </div>
  );
}
