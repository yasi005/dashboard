"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  PenLine,
  Cog,
  Zap,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { useProjectStore } from "@/store/useProjectStore";
import { useGenerationStream } from "@/hooks/useWebSocket";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const currentSource = useProjectStore((s) => s.currentSource);
  const setGenerating = useProjectStore((s) => s.setGenerating);
  const { startGeneration } = useGenerationStream({
    onComplete: () => {
      router.push("/dashboard/editor");
      setTimeout(() => {
        document.getElementById("omni-editor")?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    },
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string, scrollTo?: string) => {
    setOpen(false);
    router.push(path);
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const triggerGeneration = () => {
    if (!currentSource?.trim()) {
      setOpen(false);
      router.push("/dashboard");
      return;
    }
    setOpen(false);
    setGenerating(true);
    router.push("/dashboard");
    setTimeout(() => startGeneration(), 100);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/dashboard")}>
            <LayoutDashboard />
            Content Sandbox
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/editor", "omni-editor")}>
            <PenLine />
            Multi-Column Editor
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/calendar")}>
            <Calendar />
            Content Calendar
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/billing")}>
            <CreditCard />
            Billing & Plans
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={triggerGeneration}>
            <Zap />
            Generate Multi-Channel Campaign
          </CommandItem>
          <CommandItem onSelect={() => navigate("/")}>
            <Cog />
            Back to Marketing Site
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
