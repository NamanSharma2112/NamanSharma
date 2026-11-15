import type { Metadata } from "next";
import { preload } from "react-dom";
import { Sky } from "@/components/work/Sky";
import { WorkRing } from "@/components/work/WorkRing";
import { FRAMES } from "@/lib/work-frames";
import "@/components/work/work.css";

export const metadata: Metadata = {
  title: "Work — Naman Sharma",
  description: "Everything I have made, round a ring: Isomatric, MotionKit, Easing Lab, the writing and this site.",
};

export default function Work() {
  /* the thirty thumbnails are asked for from the head of the page, before
     the script that draws the ring has even arrived, so they are on their
     way while the page is still being read */
  for (const f of FRAMES) preload(`/work/ring/${f.id}-t.webp`, { as: "image" });
  return (
    <main className="workpage">
      <Sky />
      <WorkRing frames={FRAMES} />
    </main>
  );
}
