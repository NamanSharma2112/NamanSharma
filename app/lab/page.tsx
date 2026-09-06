import type { Metadata } from "next";
import Panel from "@/components/Panel";
import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";
import DockArc from "@/components/lab/DockArc";
import Collage from "@/components/lab/Collage";
import {
  ConvergingLines,
  PathMarquee,
  SpotlightMark,
  TiltCard,
} from "@/components/lab/LabBits";
import "@/components/lab/lab.css";

export const metadata: Metadata = {
  title: "Lab | Naman Sharma",
  description: "Motion experiments — arcs, drags, spotlights and text on curves.",
};

/**
 * The lab: the loud experiments, kept together.
 *
 * The rest of the site is quiet on purpose, so the pieces that want to shout
 * live here instead of being scattered through the writing. Same ground, same
 * card, same header as every other page — only what is inside the cards is
 * allowed to misbehave.
 */

const PIECES = [
  {
    title: "Minimise, on an arc",
    note: "The window and the dock tile are one element sharing a layoutId, so the two states are a single move. arc() bends it into a swing instead of a straight diagonal.",
    demo: <DockArc />,
  },
  {
    title: "A pile you can throw",
    note: "Each card leans toward the cursor on a spring and can be dragged anywhere in the stage, then settles flat when you let go.",
    demo: <Collage />,
  },
  {
    title: "Lit by the cursor",
    note: "The mark is stroked with a radial gradient whose centre follows the pointer, so the light travels the edge rather than the shape changing colour.",
    demo: <SpotlightMark />,
  },
  {
    title: "Routes converging",
    note: "A faint line plus a short dash running along it — animating the dash offset moves the segment down the path instead of drawing the line on.",
    demo: <ConvergingLines />,
  },
  {
    title: "Text on a curve",
    note: "The words are attached to a path with textPath and the text element's x is animated, sliding the string along the curve.",
    demo: <PathMarquee />,
  },
  {
    title: "Tipping back",
    note: "One property and one spring: it hinges from its bottom edge, which is what sells it as a card and not an image.",
    demo: <TiltCard />,
  },
];

export default function LabPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-[640px] px-6 pt-8">
        <PageHeader kicker="Lab" title="Motion experiments">
          Things I was curious about, built to see how they feel. The rest of
          the site is deliberately quiet — this is where the loud ones live.
        </PageHeader>

        <div className="flex flex-col gap-5">
          {PIECES.map((piece) => (
            <Panel key={piece.title} className="p-5 sm:p-6">
              <h2 className="text-[15px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
                {piece.title}
              </h2>
              <p className="mt-1.5 max-w-[56ch] text-[13px] leading-[1.65] text-zinc-500 dark:text-zinc-400">
                {piece.note}
              </p>
              <div className="mt-4">{piece.demo}</div>
            </Panel>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
