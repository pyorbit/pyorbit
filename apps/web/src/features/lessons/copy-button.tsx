"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      className="copy-button"
      onClick={copy}
      type="button"
      aria-label={copied ? "Code copied" : "Copy code"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
