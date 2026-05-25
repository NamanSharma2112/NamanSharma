import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingNav from "@/components/FloatingNav";


const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Naman Sharma",
    default: "Naman Sharma — Design Engineer",
  },
  description:
    "Design Engineer. I design and build whatever I can imagine — React, Next.js, TypeScript, Tailwind CSS, Motion.dev.",
  openGraph: {
    title: "Naman Sharma — Design Engineer",
    description:
      "Design Engineer. Building modern web experiences, UI libraries, and whatever pops into my head.",
    url: "https://namansharma.com",
    siteName: "Naman Sharma",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Sharma — Design Engineer",
    description:
      "Design Engineer. Building modern web experiences, UI libraries, and whatever pops into my head.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <FloatingNav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
