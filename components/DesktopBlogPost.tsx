"use client";

import { ALL_POSTS } from "@/lib/blog-data";
import TextToSpeech from "@/components/TextToSpeech";
import { getIllustration } from "@/components/BlogIllustrations";

export default function DesktopBlogPost({ slug }: { slug: string }) {
  const post = ALL_POSTS.find((p) => p.slug === slug);
  const isDark = true; // Desktop is strictly dark mode

  if (!post) return null;

  return (
    <article className="flex-1 max-w-[680px] mx-auto py-6 px-2 sm:px-6 text-zinc-300">
      <header className="mb-12">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight mb-2 text-zinc-100">
          {post.title}
        </h1>
        <p className="text-[14px] text-zinc-500 mb-6">
          {post.date}
        </p>
        <TextToSpeech 
          title={post.title} 
          contentSections={post.content} 
          isDark={isDark} 
        />
      </header>

      <div className="flex flex-col gap-8">
        {post.content.map((section) => {
          const Illustration = getIllustration(section.id);
          return (
            <section key={section.id} id={section.id} className="scroll-mt-32">
              <h2 className="text-[20px] font-medium tracking-tight mb-3 text-zinc-200">
                {section.heading}
              </h2>
              <div className="flex flex-col gap-3 text-[15px] leading-[1.7] text-zinc-400">
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
                              className="underline underline-offset-[3px] decoration-zinc-600 hover:decoration-zinc-100 hover:text-zinc-100 transition-colors duration-200"
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

              {/* Inline illustration block */}
              {Illustration && (
                <div className="mt-8 mb-4">
                  <Illustration isDark={isDark} />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </article>
  );
}
