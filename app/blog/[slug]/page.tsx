import { ALL_POSTS } from "@/lib/blog-data";
import TableOfContents from "@/components/TableOfContents";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return ALL_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = ALL_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Extract headings for the TOC
  const tocItems = post.content.map((section) => ({
    id: section.id,
    heading: section.heading,
  }));

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Container for the layout */}
      <div className="max-w-[1000px] mx-auto px-6 pt-32 pb-32 flex items-start gap-16 relative">
        
        {/* Left Sidebar: Table of Contents */}
        <TableOfContents items={tocItems} />

        {/* Center: Main Content */}
        <article className="flex-1 max-w-[600px] mt-8">
          <header className="mb-12">
            <h1 className="text-[28px] font-semibold text-zinc-900 leading-tight tracking-tight mb-2">
              {post.title}
            </h1>
            <p className="text-zinc-500 text-[14px]">
              {post.date}
            </p>
          </header>

          <div className="flex flex-col gap-12">
            {post.content.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <h2 className="text-[20px] font-medium text-zinc-800 tracking-tight mb-4">
                  {section.heading}
                </h2>
                <div className="flex flex-col gap-6 text-[15px] leading-[1.7] text-zinc-600">
                  {section.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
