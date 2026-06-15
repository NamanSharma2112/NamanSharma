"use client";

import { ALL_POSTS } from "@/lib/blog-data";
import TableOfContents from "@/components/TableOfContents";
import { notFound } from "next/navigation";
import { useBlogTheme } from "@/components/BlogThemeProvider";
import SelectionToolbar from "@/components/SelectionToolbar";
import TextToSpeech from "@/components/TextToSpeech";
import { use } from "react";

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const post = ALL_POSTS.find((p) => p.slug === slug);
  const { theme } = useBlogTheme();
  const isDark = theme === "dark";

  if (!post) {
    notFound();
  }

  // Extract headings for the TOC
  const tocItems = post.content.map((section) => ({
    id: section.id,
    heading: section.heading,
  }));

  return (
    <div className="pt-32 pb-32">
      {/* Container for the layout */}
      <div className="max-w-[1000px] mx-auto px-6 flex items-start gap-16 relative">
        
        {/* Left Sidebar: Table of Contents */}
        <TableOfContents items={tocItems} isDark={isDark} />

        {/* Center: Main Content */}
        <article className="flex-1 max-w-[600px] mt-8">
          <header className="mb-12">
            <h1
              className="text-[28px] font-semibold leading-tight tracking-tight mb-2 transition-colors duration-500"
              style={{ color: isDark ? "#fafafa" : "#18181b" }}
            >
              {post.title}
            </h1>
            <p
              className="text-[14px] transition-colors duration-500"
              style={{ color: isDark ? "#52525b" : "#71717a" }}
            >
              {post.date}
            </p>
            
            {/* Audio Player Button */}
            <TextToSpeech 
              title={post.title} 
              contentSections={post.content} 
              isDark={isDark} 
            />
          </header>

          <div className="flex flex-col gap-12">
            {post.content.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2
                  className="text-[20px] font-medium tracking-tight mb-4 transition-colors duration-500"
                  style={{ color: isDark ? "#e4e4e7" : "#27272a" }}
                >
                  {section.heading}
                </h2>
                <div
                  className="flex flex-col gap-6 text-[15px] leading-[1.7] transition-colors duration-500"
                  style={{ color: isDark ? "#a1a1aa" : "#52525b" }}
                >
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>

      {/* Selection Toolbar — select text to share/copy */}
      <SelectionToolbar slug={slug} />
    </div>
  );
}
