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

const DESCRIPTION =
  "Design engineer. I build for the web, and I care about how an interface feels — the easing curve, the hairline, the way a thing behaves when you interrupt it halfway.";

/* The share card itself is app/opengraph-image.png (and twitter-image.png),
   rendered from the front page's intro so a shared link looks like the
   site. The base is the www host the site answers on, so crawlers fetch the
   image without a redirect. */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.namansharma.com"),
  title: "Naman Sharma",
  description: DESCRIPTION,
  openGraph: {
    title: "Naman Sharma",
    description: DESCRIPTION,
    url: "https://www.namansharma.com",
    siteName: "Naman Sharma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Sharma",
    description: DESCRIPTION,
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { Island } from "@/components/Island";
import "@/components/island.css";

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
          {/* the one way round the site, on every page */}
          <Island />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
