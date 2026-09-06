import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The sheet a page's writing sits on.
 *
 * It used to be a frosted-glass panel floating over a photo. There is no photo
 * any more — every page is on the same paper — so it is a plain, solid card
 * now: a hair off the ground in tone, a hairline border, and one soft shadow
 * to lift it. Warm white by day, a warm near-black by night, so it matches the
 * home page's paper rather than reading as a different material.
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
        "rounded-2xl border p-7 sm:p-9",
        "border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(70,60,54,0.04),0_18px_40px_-24px_rgba(70,60,54,0.28)]",
        "dark:border-white/[0.08] dark:bg-[#161513] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_18px_40px_-24px_rgba(0,0,0,0.7)]",
        className
      )}
    >
      {children}
    </div>
  );
}
