import { BlogThemeProvider } from "@/components/BlogThemeProvider";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogThemeProvider>{children}</BlogThemeProvider>;
}
