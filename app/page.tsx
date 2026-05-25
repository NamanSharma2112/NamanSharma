import HeroName from "@/components/HeroName";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naman Sharma — Design Engineer",
  description:
    "I'm Naman, a Design Engineer. I design and build whatever I can imagine — React, Next.js, TypeScript, Tailwind CSS, Motion.dev.",
};

export default function Home() {
  return <HeroName />;
}
