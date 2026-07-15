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
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Naman Sharma - Design Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Sharma",
    description:
      "Naman Sharma is a Design Engineer building modern web experiences.",
    images: ["/banner.jpg"],
  },
};

import FloatingContactWidget from "@/components/FloatingContactWidget";
import PillNav from "@/components/PillNav";
import { CommandMenu } from "@/components/CommandMenu";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f5f5f5] dark:bg-[#111110] text-black dark:text-white transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PillNav />
          <div className="flex-1">
            {children}
          </div>
          <FloatingContactWidget />
          <CommandMenu />
        </ThemeProvider>
      </body>
    </html>
  );
}
