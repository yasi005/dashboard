"use client";

import { useCallback, useState } from "react";
import { FileText, Upload } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { cn } from "@/lib/utils";

export function DocumentUploadTab() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const setSource = useProjectStore((s) => s.setSource);

  const handleFile = useCallback(
    (file: File) => {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) ?? file.name;
        setSource(text.slice(0, 2000), "document");
      };
      reader.readAsText(file);
    },
    [setSource]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#E4E4E7]/55">Drop a PDF or TXT file to extract raw material.</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all",
          dragging
            ? "border-[#F59E0B] bg-[#F59E0B]/5"
            : "border-[#242424] hover:border-[#F59E0B]/30"
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-[#E4E4E7]/40" />
        <p className="text-sm text-[#E4E4E7]">Drag & drop your file here</p>
        <p className="mt-1 text-xs text-[#E4E4E7]/45">PDF, TXT up to 10MB</p>
        <label className="mt-4 cursor-pointer rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-[#080808] hover:bg-[#D97706]">
          Browse Files
          <input
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </label>
        {fileName && (
          <div className="mt-4 flex items-center gap-2 text-sm text-[#F59E0B]">
            <FileText className="h-4 w-4" />
            {fileName}
          </div>
        )}
      </div>
    </div>
  );
}
