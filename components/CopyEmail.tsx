"use client";

import { useState, useCallback, useRef } from "react";

type Props = {
  email: string;
};

export default function CopyEmail({ email }: Props) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: do nothing */
    }
    // Open mailto to launch Gmail / default mail client
    window.location.href = `mailto:${email}`;
  }, [email]);

  return (
    <span className="relative inline-block">
      <button type="button" onClick={handleClick} className="copy-email">
        {email}
      </button>
      <span
        aria-hidden="true"
        className={`copied-toast ${copied ? "visible" : ""}`}
      >
        Copied to clipboard
      </span>
    </span>
  );
}
