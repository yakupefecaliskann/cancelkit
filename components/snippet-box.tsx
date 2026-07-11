"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function SnippetBox({ publishableKey }: { publishableKey: string }) {
  const [copied, setCopied] = useState(false);

  const snippet = `<script src="https://cdn.cancelkit.io/v1.js" data-key="${publishableKey}" defer></script>`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success("Snippet copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — select the text manually");
    }
  }

  return (
    <div className="relative rounded-lg border border-border bg-foreground">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs font-medium text-white/60">HTML</span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-6 gap-1.5 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={handleCopy}
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-x-auto px-4 py-3">
        <code className="font-mono text-[13px] leading-relaxed text-white">{snippet}</code>
      </pre>
    </div>
  );
}
