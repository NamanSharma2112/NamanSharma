import type { Metadata } from "next";
import Link from "next/link";
import { ALL_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Writing — Naman Sharma",
  description: "Notes and essays on design engineering, micro-interactions, and building interfaces that feel alive.",
};

/** The index: the same column as the front page, a title and a date to each
    post and one line of what it says. */
export default function BlogIndexPage() {
  return (
    <div className="page">
      <main className="col">
        <p className="crumb">
          <Link href="/">Naman Sharma</Link>
        </p>
        <h1 className="name">Writing</h1>
        <p>Notes and essays on design engineering, micro-interactions, and building interfaces that feel alive.</p>
        <ul className="posts">
          {ALL_POSTS.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <span className="when">{post.date}</span>
              <p className="excerpt">{post.content[0]?.paragraphs[0]}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
