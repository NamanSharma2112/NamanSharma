import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The frosted sheet every page's writing sits on, so the text stays readable
 * over the photo behind it.
 */
export default function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/10 bg-white/70 p-7 backdrop-blur-xl sm:p-9",
        "dark:border-white/10 dark:bg-black/55",
        className
      )}
    >
      {children}
    </div>
  );
}
