"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useIntroDone } from "@/components/Boot";
import { cn } from "@/lib/utils";

/**
 * Holds its children just under where they belong, slightly blurred, until the
 * intro lifts — then lets them settle into place.
 *
 * The movement is a CSS animation rather than an animated inline style, and
 * deliberately does not fill forwards: a lingering `transform` or `filter`
 * would make this element the containing block for any `position: fixed`
 * descendant, which quietly breaks anything pinned to the viewport inside a
 * page. Running without a fill leaves the element back on its plain base style
 * the moment it finishes, holding nothing.
 */

export default function Landing({
  children,
  /** Seconds after the intro lifts before this piece starts arriving. */
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const done = useIntroDone();
  const pathname = usePathname();
  // Anything mounted once the intro is over skips this, so moving between
  // pages later does not replay it.
  const [missedIntro] = useState(done);

  // The desktop is its own machine and runs its own start-up.
  if (missedIntro || pathname.startsWith("/desktop")) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn(className, done ? "landing-in" : "opacity-0")}
      style={done ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
