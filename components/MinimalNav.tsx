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
      // z-20 keeps it above pages that lay a fixed backdrop behind themselves.
      className="relative z-20 mx-auto flex w-full max-w-[560px] items-baseline justify-between px-6 pt-14 text-[13px] sm:pt-20"
    >
      {/* The mark: lowercase, tight, with the stop carrying the only colour
          shift so it reads as drawn rather than typed. */}
      <Link
        href="/"
        aria-label="Naman Sharma — home"
        className="group inline-flex items-baseline font-medium tracking-tight text-white"
      >
        <span className="relative">
          naman
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </span>
        <span className="text-zinc-500 transition-colors duration-300 group-hover:text-white">
          .
        </span>
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
