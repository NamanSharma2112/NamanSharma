import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description: "A collection of interactive and downloadable UI components.",
};

export default function ComponentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
