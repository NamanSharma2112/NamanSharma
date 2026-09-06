import type { ReactNode } from "react";

/**
 * The head of every content page, so /work, /writing and /inspiration open the
 * same way: a mono kicker the way the home page labels things, a medium title,
 * and an optional line under it. Sits on the paper, above the card, so the
 * page reads as titled writing rather than one floating box.
 */
export default function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400 dark:text-zinc-500">
        {kicker}
      </p>
      <h1 className="mt-2 text-[23px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h1>
      {children && (
        <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.7] text-zinc-500 dark:text-zinc-400">
          {children}
        </p>
      )}
    </header>
  );
}
