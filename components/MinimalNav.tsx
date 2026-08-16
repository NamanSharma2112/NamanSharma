"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * The whole navigation: a wordmark on the left, a few quiet links on the right.
 *
 * Same weight and colour as the body text, so it sits in the page rather than
 * on top of it.
 */

const LINKS = [
  { label: "work", href: "/work" },
  { label: "writing", href: "/blog" },
  { label: "inspiration", href: "/inspiration" },
];

const TWITTER = "https://x.com/NamanSharma2112";

export default function MinimalNav() {
  const pathname = usePathname();

  // The desktop is its own world and brings its own menu bar and dock.
  if (pathname.startsWith("/desktop")) return null;

  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto flex w-full max-w-[560px] items-baseline justify-between px-6 pt-14 text-[13px] sm:pt-20"
    >
      <Link
        href="/"
        className="font-medium text-white transition-opacity hover:opacity-70"
      >
        naman.
      </Link>

      <div className="flex items-baseline gap-4">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "transition-colors",
              pathname.startsWith(link.href)
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {link.label}
          </Link>
        ))}
        <a
          href={TWITTER}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 transition-colors hover:text-zinc-300"
        >
          twitter
        </a>
      </div>
    </nav>
  );
}
