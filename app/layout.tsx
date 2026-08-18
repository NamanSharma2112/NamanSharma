import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

import FloatingContactWidget from "@/components/FloatingContactWidget";
import MinimalNav from "@/components/MinimalNav";
import SiteAtmosphere from "@/components/SiteAtmosphere";
import Boot from "@/components/Boot";
import Landing from "@/components/Landing";
import { CommandMenu } from "@/components/CommandMenu";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DesktopProvider } from "@/components/DesktopState";

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
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#f5f5f5] dark:bg-[#111110] text-black dark:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <DesktopProvider>
            {/* Photo, rain and the neon cat, behind every page. Both of these
                hide themselves on /desktop, which brings its own. */}
            {/* At the layout level so the intro plays once on entry rather
                than on every client-side navigation. */}
            <Boot>
              <SiteAtmosphere />
              <Landing delay={0.05}>
                <MinimalNav />
              </Landing>
              <Landing delay={0.16} className="relative z-10 flex-1">
                {children}
              </Landing>
            </Boot>
          </DesktopProvider>
          <FloatingContactWidget />
          <CommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
