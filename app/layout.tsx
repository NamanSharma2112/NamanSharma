import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import FloatingContactWidget from "@/components/FloatingContactWidget";
import MeteorShower from "@/components/MeteorShower";
import FooterScene from "@/components/FooterScene";
import Snowfall from "@/components/Snowfall";
import { SnowProvider } from "@/lib/snow-context";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

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
    default: "Naman Sharma — Portfolio",
  },
  description: "Developer, builder, and generalist. Building modern web experiences, ML pipelines, and IoT prototypes.",
  openGraph: {
    title: "Naman Sharma — Portfolio",
    description: "Developer, builder, and generalist. Building modern web experiences, ML pipelines, and IoT prototypes.",
    url: "https://namansharma.com",
    siteName: "Naman Sharma",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naman Sharma — Portfolio",
    description: "Developer, builder, and generalist. Building modern web experiences, ML pipelines, and IoT prototypes.",
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
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={['light', 'dark', 'reading']}
        >
          <SnowProvider>
            <MeteorShower />
            <Snowfall />
            {children}
            <FloatingContactWidget />
            <FooterScene />
          </SnowProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
