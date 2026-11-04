import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./minimal.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://namansharma.com"),
  title: "Naman Sharma",
  description:
    "Naman Sharma is a Design Engineer building modern web experiences.",
  openGraph: {
    title: "Naman Sharma",
    description:
      "Naman Sharma is a Design Engineer building modern web experiences.",
    url: "https://namansharma.com",
    siteName: "Naman Sharma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Sharma",
    description:
      "Naman Sharma is a Design Engineer building modern web experiences.",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* One ground for the whole site, read off the tokens in globals.css
          rather than hardcoded per theme here. */}
      <body
        suppressHydrationWarning
        className="flex min-h-full flex-col bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300"
      >
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
