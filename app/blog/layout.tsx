import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on design engineering, systems, and building things.",
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
