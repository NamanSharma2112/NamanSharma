"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ALL_POSTS } from "@/lib/blog-data";
import Panel from "@/components/Panel";
import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";

/**
 * The index, on the same sheet the rest of the site writes on — one column,
 * one type scale, the date sitting out to the left of each entry.
 */
export default function BlogIndexPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-[640px] px-6 pt-8">
        <PageHeader kicker="Writing" title="Notes & essays">
          Thoughts on design engineering, micro-interactions, and building
          interfaces that feel alive.
        </PageHeader>

        <Panel>
          <div className="flex flex-col">
          {ALL_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group -mx-3 rounded-xl px-3 py-3.5 outline-none transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.04] dark:hover:bg-white/[0.05] dark:focus-visible:bg-white/[0.05]"
            >
              {/* The date is a fixed column, not shrink-to-fit: sized to the
                  widest month it can ever hold ("September 2026" measures
                  104px), every title starts on the same edge. Left to its own
                  width the second column began wherever each date happened to
                  end, so the titles sat 18px apart from each other.
                  Stacked below sm, where a 112px gutter would squeeze them. */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                <span className="shrink-0 text-[12.5px] tabular-nums text-zinc-500 dark:text-zinc-500 sm:w-28">
                  {post.date}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[13.5px] font-medium text-zinc-900 dark:text-zinc-100">
                      {post.title}
                    </span>
                    <ArrowUpRight
                      className="size-[14px] shrink-0 -translate-x-1 text-zinc-400 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 dark:text-zinc-500"
                    />
                  </span>
                  <span className="mt-1 line-clamp-1 block text-[13px] leading-[1.7] text-zinc-600 dark:text-zinc-400">
                    {post.content[0].paragraphs[0]}
                  </span>
                </span>
              </div>
            </Link>
          ))}
          </div>
        </Panel>
      </main>
      <SiteFooter />
    </>
  );
}
