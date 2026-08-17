"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { ALL_POSTS } from "@/lib/blog-data";
import TableOfContents from "@/components/TableOfContents";
import SelectionToolbar from "@/components/SelectionToolbar";
import TextToSpeech from "@/components/TextToSpeech";
import { getIllustration } from "@/components/BlogIllustrations";
import Panel from "@/components/Panel";

const FONT_OPTIONS = [
  { label: "Sans", value: "var(--font-geist-sans), system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "var(--font-geist-mono), monospace" },
];

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = ALL_POSTS.find((p) => p.slug === slug);
  const [fontIndex, setFontIndex] = useState(0);

  if (!post) {
    notFound();
  }

  const tocItems = post.content.map((section) => ({
    id: section.id,
    heading: section.heading,
  }));

  return (
    <div className="pt-5 pb-28">
      {/* The contents list floats at the bottom of the viewport rather than
          sitting beside the article, so the column is free to stay narrow
          enough to read comfortably. */}
      <TableOfContents
        items={tocItems}
        isDark
        fontOptions={FONT_OPTIONS}
        fontIndex={fontIndex}
        onFontChange={setFontIndex}
      />

      <div className="mx-auto w-full max-w-[640px] px-6">
        <Panel>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-[13px] text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-200"
          >
            <ArrowLeft className="size-[14px] transition-transform duration-200 group-hover:-translate-x-0.5" />
            Writing
          </Link>

          <article
            className="mt-7"
            style={{ fontFamily: FONT_OPTIONS[fontIndex].value }}
          >
            <header>
              <h1 className="text-[19px] font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white">
                {post.title}
              </h1>
              <p className="mt-1.5 text-[12.5px] text-zinc-500 dark:text-zinc-500">
                {post.date}
              </p>

              <TextToSpeech
                title={post.title}
                contentSections={post.content}
                isDark
              />
            </header>

            <div className="mt-9 flex flex-col gap-8">
              {post.content.map((section) => {
                const Illustration = getIllustration(section.id);
                return (
                  <section key={section.id} id={section.id} className="scroll-mt-24">
                    <h2 className="mb-2.5 text-[15px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                      {section.heading}
                    </h2>
                    <div className="flex flex-col gap-3 text-[13.5px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
                      {section.paragraphs.map((p, i) => {
                        if (p.includes("http")) {
                          const parts = p.split(/(https?:\/\/[^\s]+)/g);
                          return (
                            <p key={i}>
                              {parts.map((part, j) =>
                                part.startsWith("http") ? (
                                  <a
                                    key={j}
                                    href={part}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-[3px] decoration-zinc-400 transition-colors duration-200 hover:text-zinc-900 hover:decoration-zinc-900 dark:decoration-zinc-600 dark:hover:text-zinc-100 dark:hover:decoration-zinc-100"
                                  >
                                    {part}
                                  </a>
                                ) : (
                                  part
                                )
                              )}
                            </p>
                          );
                        }
                        return <p key={i}>{p}</p>;
                      })}
                    </div>

                    {Illustration && <Illustration isDark />}
                  </section>
                );
              })}
            </div>
          </article>
        </Panel>
      </div>

      {/* Select text to share or copy it. */}
      <SelectionToolbar slug={slug} />
    </div>
  );
}
