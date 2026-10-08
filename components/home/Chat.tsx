"use client";

import { useEffect, useRef, useState } from "react";
import {
  Conversation,
  ConversationBubble,
  ConversationContent,
} from "@/components/ui/conversation";

/**
 * The contact exchange, arriving as you reach it.
 *
 * The component itself has no entrance — it ships bubbles and their colours and
 * nothing that moves — so the reveal is here: one observer on the thread, and a
 * stagger down the list once it crosses into view.
 *
 * One-shot. A conversation that replays its arrival every time it scrolls past
 * stops reading as something being said and starts reading as a widget.
 */
export default function Chat({
  lines,
}: {
  lines: ReadonlyArray<{ from: "them" | "me"; text: string }>;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = box.current;
    if (!node) return;

    // Anything already on screen counts immediately, so a short page that never
    // scrolls does not leave the thread hidden.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box}>
      <Conversation className="home-chat" data-in={shown ? "" : undefined}>
        {lines.map((line, i) => (
          <ConversationBubble
            key={i}
            variant={line.from === "them" ? "muted" : "default"}
            align={line.from === "them" ? "start" : "end"}
            className="home-bubble"
            // The stagger is an index, not a per-element delay in JS: the CSS
            // reads it, so the whole sequence is one declarative rule.
            style={{ "--i": i } as React.CSSProperties}
          >
            <ConversationContent>{line.text}</ConversationContent>
          </ConversationBubble>
        ))}
      </Conversation>
    </div>
  );
}
