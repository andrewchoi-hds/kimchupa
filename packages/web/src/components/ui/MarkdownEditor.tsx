"use client";

import { useState, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading2,
  Code,
  Link as LinkIcon,
  List,
} from "lucide-react";
import { renderMarkdown } from "@/lib/renderMarkdown";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

type MarkdownAction = "bold" | "italic" | "heading" | "code" | "link" | "list";

const TOOLBAR_BUTTONS: {
  action: MarkdownAction;
  icon: typeof Bold;
  label: string;
}[] = [
  { action: "bold", icon: Bold, label: "Bold" },
  { action: "italic", icon: Italic, label: "Italic" },
  { action: "heading", icon: Heading2, label: "Heading" },
  { action: "code", icon: Code, label: "Code" },
  { action: "link", icon: LinkIcon, label: "Link" },
  { action: "list", icon: List, label: "List" },
];

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = useCallback(
    (action: MarkdownAction) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end);
      let before = value.slice(0, start);
      const after = value.slice(end);
      let insertion = "";
      let cursorOffset = 0;

      switch (action) {
        case "bold":
          insertion = `**${selected || "굵은 텍스트"}**`;
          cursorOffset = selected ? insertion.length : 2;
          break;
        case "italic":
          insertion = `*${selected || "기울임 텍스트"}*`;
          cursorOffset = selected ? insertion.length : 1;
          break;
        case "heading":
          // If cursor is not at line start, add a newline
          if (before.length > 0 && !before.endsWith("\n")) {
            before += "\n";
          }
          insertion = `## ${selected || "제목"}`;
          cursorOffset = insertion.length;
          break;
        case "code":
          if (selected.includes("\n")) {
            // Multi-line: wrap in code block
            insertion = `\`\`\`\n${selected}\n\`\`\``;
          } else {
            insertion = `\`${selected || "코드"}\``;
          }
          cursorOffset = selected ? insertion.length : (selected.includes("\n") ? 4 : 1);
          break;
        case "link":
          if (selected) {
            insertion = `[${selected}](url)`;
            cursorOffset = insertion.length - 1; // place cursor before )
          } else {
            insertion = "[링크 텍스트](url)";
            cursorOffset = 1; // after [
          }
          break;
        case "list":
          if (before.length > 0 && !before.endsWith("\n")) {
            before += "\n";
          }
          if (selected) {
            insertion = selected
              .split("\n")
              .map((line) => `- ${line}`)
              .join("\n");
          } else {
            insertion = "- ";
          }
          cursorOffset = insertion.length;
          break;
      }

      const newValue = before + insertion + after;
      onChange(newValue);

      // Restore focus and cursor position
      requestAnimationFrame(() => {
        textarea.focus();
        const pos = before.length + cursorOffset;
        textarea.setSelectionRange(pos, pos);
      });
    },
    [value, onChange]
  );

  return (
    <div className="border border-border rounded-[var(--radius)] overflow-hidden">
      {/* Tabs + Toolbar */}
      <div className="flex items-center justify-between bg-muted/50 border-b border-border px-2">
        {/* Tabs */}
        <div className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "write"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            작성
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "preview"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            미리보기
          </button>
        </div>

        {/* Toolbar (visible only in write mode) */}
        {activeTab === "write" && (
          <div className="flex items-center gap-0.5">
            {TOOLBAR_BUTTONS.map(({ action, icon: Icon, label }) => (
              <button
                key={action}
                type="button"
                onClick={() => insertMarkdown(action)}
                title={label}
                className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content area */}
      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-background focus:outline-none resize-none text-foreground placeholder:text-muted-foreground"
          rows={15}
        />
      ) : (
        <div className="px-4 py-3 min-h-[360px] bg-background">
          {value.trim() ? (
            <div
              className="prose max-w-none text-foreground/80"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
            />
          ) : (
            <p className="text-muted-foreground italic">
              미리볼 내용이 없습니다.
            </p>
          )}
        </div>
      )}

      {/* Character count */}
      <div className="flex items-center justify-end px-4 py-1.5 bg-muted/30 border-t border-border">
        <p className="text-xs text-muted-foreground">{value.length}/5000</p>
      </div>
    </div>
  );
}
