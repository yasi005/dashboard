"use client";

import { motion } from "framer-motion";
import { cascadeDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ElasticColumnWrapperProps {
  children: React.ReactNode;
  index?: number;
  total?: number;
  className?: string;
}

export function ElasticColumnWrapper({
  children,
  index = 0,
  total = 1,
  className,
}: ElasticColumnWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={cascadeDelay(index, total)}
      className={cn(
        "bg-[#141414] border border-[#242424] hover:border-[#F59E0B]/30 rounded-xl transition-colors",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
