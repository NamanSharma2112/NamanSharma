"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { ALL_POSTS } from "@/lib/blog-data";
import TableOfContents from "@/components/TableOfContents";
import SelectionToolbar from "@/components/SelectionToolbar";
import TextToSpeech from "@/components/TextToSpeech";
import { getIllustration } from "@/components/BlogIllustrations";
import { getRlsIllustration } from "@/components/RlsIllustrations";
import { useBlogTheme } from "@/components/BlogThemeProvider";

const FONT_OPTIONS = [
  { label: "Sans", value: "var(--font-geist-sans), system-ui, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Mono", value: "var(--font-geist-mono), monospace" },
];

/** A post, in the same column as everything else: the title in the ink at
    the body's own size, its date, the read-aloud control, then the sections.
    The contents pill floats at the foot of the viewport so the column stays
    narrow enough to read. */
export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const post = ALL_POSTS.find((p) => p.slug === slug);
  const [fontIndex, setFontIndex] = useState(0);
  // These build their palettes in JS, so they take the theme as a value.
  const { isDark } = useBlogTheme();

  if (!post) notFound();

  const tocItems = post.content.map((section) => ({ id: section.id, heading: section.heading }));

  return (
    <div className="page">
      <TableOfContents items={tocItems} isDark={isDark} fontOptions={FONT_OPTIONS} fontIndex={fontIndex} onFontChange={setFontIndex} />

      <div className="col">
        <p className="crumb">
          <Link href="/">Naman Sharma</Link> / <Link href="/blog">Writing</Link>
        </p>

        <article style={{ fontFamily: FONT_OPTIONS[fontIndex]!.value }}>
          <header>
            <h1 className="name">{post.title}</h1>
            <p className="quiet">{post.date}</p>
            <TextToSpeech title={post.title} contentSections={post.content} isDark={isDark} />
          </header>

          {post.content.map((section) => {
            const Illustration = getIllustration(section.id) || getRlsIllustration(section.id);
            return (
              <section key={section.id} id={section.id}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((p, i) =>
                  p.includes("http") ? (
                    <p key={i}>
                      {p.split(/(https?:\/\/[^\s]+)/g).map((part, j) =>
                        part.startsWith("http") ? (
                          <a key={j} href={part} target="_blank" rel="noopener noreferrer">
                            {part}
                          </a>
                        ) : (
                          part
                        ),
                      )}
                    </p>
                  ) : (
                    <p key={i}>{p}</p>
                  ),
                )}
                {Illustration && <Illustration isDark={isDark} />}
              </section>
            );
          })}
        </article>

        <p className="sign-off">
          Thanks for reading. Reach out on <a href="https://x.com/NamanSharma2112">X</a>,{" "}
          <a href="https://www.linkedin.com/in/namansharma2112/">LinkedIn</a> or{" "}
          <a href="mailto:namansharmans03@gmail.com">email</a>, or go <Link href="/">home</Link>.
        </p>
      </div>

      {/* Select text to share or copy it. */}
      <SelectionToolbar slug={slug} />
    </div>
  );
}
