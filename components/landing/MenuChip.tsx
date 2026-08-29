"use client";

/**
 * The way into the rest of the site from the landing, which has no nav pill.
 *
 * Small and out of the way in the corner, but it says the shortcut out loud so
 * the keyboard route is discoverable rather than a secret.
 */
export default function MenuChip() {
  const open = () =>
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true })
    );

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open menu"
      className="group inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 transition-[background-color,color,transform] duration-200 ease-[var(--ease-out)] hover:bg-black/[0.04] hover:text-zinc-800 active:scale-[0.97] motion-reduce:active:scale-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
    >
      Menu
      <kbd className="rounded border border-black/10 bg-black/[0.04] px-1.5 py-px font-mono text-[10px] leading-none text-zinc-500 dark:border-white/10 dark:bg-white/[0.06] dark:text-zinc-400">
        ⌘K
      </kbd>
    </button>
  );
}
