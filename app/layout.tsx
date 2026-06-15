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
import PillNav from "@/components/PillNav";
import { CommandMenu } from "@/components/CommandMenu";

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
      <body className="min-h-full flex flex-col">
        <PillNav />
        {children}
        <FloatingContactWidget />
        <CommandMenu />
      </body>
    </html>
  );
}
