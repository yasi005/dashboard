"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AgentTelemetryPanel } from "@/components/dashboard/agent-telemetry-panel";
import { ChannelSelectors } from "@/components/dashboard/channel-selectors";
import { DocumentUploadTab } from "@/components/dashboard/document-upload-tab";
import { GenerateButton } from "@/components/dashboard/generate-button";
import { LinkDropTab } from "@/components/dashboard/link-drop-tab";
import { RawConceptTab } from "@/components/dashboard/raw-concept-tab";
import { GenerationLoader } from "@/components/editor/generation-loader";
import { MechanicalTabs } from "@/components/motion/mechanical-tabs";
import { SourceMorphPanel } from "@/components/motion/source-morph-panel";
import { useGenerationStream } from "@/hooks/useWebSocket";
import { spring } from "@/lib/motion";
import { useProjectStore } from "@/store/useProjectStore";

const SANDBOX_TABS = [
  { value: "link", label: "Link Drop" },
  { value: "document", label: "Document" },
  { value: "concept", label: "Raw Concept" },
];

export default function SandboxPage() {
  const router = useRouter();
  const { currentSource, isGenerating, selectedChannels } = useProjectStore();

  const { startGeneration } = useGenerationStream({
    onComplete: () => router.push("/dashboard/editor"),
  });

  const handleGenerate = () => {
    if (!currentSource?.trim()) return;
    startGeneration();
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#E4E4E7] tracking-tight">Content Sandbox</h2>
        <p className="mt-1 text-sm text-[#E4E4E7]/55">
          Drop raw material — pipeline agents parse and repurpose across channels.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="space-y-6 min-w-0">
          {currentSource?.trim() && <SourceMorphPanel variant="sandbox" />}

          {!isGenerating ? (
            <motion.div layout transition={spring.structural} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Source Material</CardTitle>
                  <CardDescription>Feed content into the repurposing engine.</CardDescription>
                </CardHeader>
                <CardContent>
                  <MechanicalTabs tabs={SANDBOX_TABS} defaultValue="link">
                    {(active) => (
                      <>
                        {active === "link" && <LinkDropTab />}
                        {active === "document" && <DocumentUploadTab />}
                        {active === "concept" && <RawConceptTab />}
                      </>
                    )}
                  </MechanicalTabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Channels</CardTitle>
                  <CardDescription>Select output platforms.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChannelSelectors />
                </CardContent>
              </Card>

              <GenerateButton
                onClick={handleGenerate}
                loading={isGenerating}
                disabled={!currentSource?.trim() || selectedChannels.length === 0}
              />
            </motion.div>
          ) : (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={spring.structural}>
              <GenerationLoader />
            </motion.div>
          )}

          <div className="lg:hidden">
            <AgentTelemetryPanel compact />
          </div>
        </div>

        <div className="hidden lg:block sticky top-24">
          <AgentTelemetryPanel />
        </div>
      </div>
    </div>
  );
}
