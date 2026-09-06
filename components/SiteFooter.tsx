import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

/**
 * One footer under every content page, so they end the same way: a rule, the
 * name linking home, and the same social row the home page uses. The mono seat
 * tag keeps a thread of the flight running through the quiet pages without
 * dressing them up.
 */
export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[640px] px-6 pb-20 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6 dark:border-white/10">
        <div>
          <Link
            href="/"
            className="text-[13px] font-medium text-zinc-800 transition-colors hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white"
          >
            Naman Sharma
          </Link>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
            Seat 18A · Design Engineer
          </p>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
