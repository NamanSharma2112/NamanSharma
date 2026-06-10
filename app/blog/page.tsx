import Link from "next/link";
import { ALL_POSTS } from "@/lib/blog-data";

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-32 pb-32">
      <div className="max-w-[600px] mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">
            Writing
          </h1>
          <p className="text-zinc-500 text-[15px]">
            Thoughts on design engineering, micro-interactions, and building interfaces that feel alive.
          </p>
        </header>

        <div className="flex flex-col gap-10">
          {ALL_POSTS.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article>
                <p className="text-zinc-400 text-[13px] mb-2">{post.date}</p>
                <h2 className="text-[18px] font-medium text-zinc-800 tracking-tight group-hover:text-black transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-zinc-500 text-[14px] leading-relaxed line-clamp-2">
                  {post.content[0].paragraphs[0]}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
