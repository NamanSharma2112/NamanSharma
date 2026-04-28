import type { Metadata, ResolvingMetadata } from "next";
import { POSTS } from "../data";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content[0],
    openGraph: {
      title: post.title,
      description: post.content[0],
      type: "article",
      publishedTime: post.date,
      tags: [post.tag],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content[0],
    },
  };
}

export default function BlogPostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
