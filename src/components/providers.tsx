"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { DemoHydrator } from "@/components/demo-hydrator";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <DemoHydrator />
      {children}
      <CommandPalette />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#141414",
            border: "1px solid #242424",
            color: "#E4E4E7",
          },
        }}
      />
    </TooltipProvider>
  );
}
