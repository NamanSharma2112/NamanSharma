import { BlogThemeProvider } from "@/components/BlogThemeProvider";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogThemeProvider>
      <div className="min-h-screen bg-black">{children}</div>
    </BlogThemeProvider>
  );
}
