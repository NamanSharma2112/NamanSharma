"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ALL_POSTS } from "@/lib/blog-data";
import Panel from "@/components/Panel";

/**
 * The index, on the same sheet the rest of the site writes on — one column,
 * one type scale, the date sitting out to the left of each entry.
 */
export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pt-5 pb-28">
      <Panel>
        <h1 className="text-[13.5px] font-medium text-zinc-900 dark:text-white">
          Writing.
        </h1>

        <p className="mt-6 text-[13.5px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
          Thoughts on design engineering, micro-interactions, and building
          interfaces that feel alive.
        </p>

        <div className="mt-8 flex flex-col">
          {ALL_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group -mx-3 rounded-xl px-3 py-3.5 outline-none transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.04] dark:hover:bg-white/[0.05] dark:focus-visible:bg-white/[0.05]"
            >
              <div className="flex items-baseline gap-4">
                <span className="shrink-0 text-[12.5px] tabular-nums text-zinc-500 dark:text-zinc-500">
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
  );
}
