"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  minimal?: boolean;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder,
  className,
  minimal = false,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-invert max-w-none focus:outline-none min-h-[120px] text-sm leading-relaxed",
          "[&_p]:my-0 [&_p]:leading-relaxed [&_ul]:my-2 [&_li]:my-0",
          minimal && "text-[#E4E4E7]/55",
          className
        ),
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getText());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getText()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="relative">
      {placeholder && !content && (
        <p className="pointer-events-none absolute left-0 top-0 text-sm text-[#E4E4E7]/30">
          {placeholder}
        </p>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
