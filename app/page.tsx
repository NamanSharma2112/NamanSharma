import HeroName from "@/components/HeroName";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import BlogSection from "@/components/BlogSection";
import ContactFloating from "@/components/ContactFloating";
import ScrollIndicator from "@/components/ScrollIndicator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naman Sharma — Design Engineer",
  description:
    "I'm Naman, a Design Engineer. I design and build whatever I can imagine — React, Next.js, TypeScript, Tailwind CSS, Motion.dev.",
};

export default function Home() {
  return (
    <main className="bg-zinc-950 overflow-hidden relative">
      <HeroName />
      <TechStack />
      <Projects />
      <BlogSection />
      <ScrollIndicator />
      <ContactFloating />
    </main>
  );
}
