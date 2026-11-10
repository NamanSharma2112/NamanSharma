import type { Metadata } from "next";
import { WorkRing } from "@/components/work/WorkRing";
import { FRAMES } from "@/lib/work-frames";
import "@/components/work/work.css";

export const metadata: Metadata = {
  title: "Work — Naman Sharma",
  description: "Everything I have made, round a ring: Isomatric, MotionKit, Easing Lab, the writing and this site.",
};

export default function Work() {
  return (
    <main className="workpage">
      <WorkRing frames={FRAMES} />
    </main>
  );
}
