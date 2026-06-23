"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
}

interface MechanicalTabsProps {
  tabs: Tab[];
  defaultValue?: string;
  children: (activeTab: string) => React.ReactNode;
  className?: string;
}

export function MechanicalTabs({
  tabs,
  defaultValue,
  children,
  className,
}: MechanicalTabsProps) {
  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? "");

  return (
    <div className={className}>
      <div className="relative flex border-b border-[#242424]">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActive(tab.value)}
            className={cn(
              "relative flex-1 px-4 py-2.5 text-sm font-medium transition-colors",
              active === tab.value ? "text-[#E4E4E7]" : "text-[#E4E4E7]/45 hover:text-[#E4E4E7]/70"
            )}
          >
            {tab.label}
            {active === tab.value && (
              <motion.div
                layoutId="mechanical-tab-underline"
                className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#D97706] rounded-full shadow-[0_0_8px_rgba(217,119,6,0.5)]"
                transition={spring.switch}
              />
            )}
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring.card}
        className="pt-4"
      >
        {children(active)}
      </motion.div>
    </div>
  );
}
