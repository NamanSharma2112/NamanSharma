import type { Metadata } from "next";
import CopyEmail from "@/components/CopyEmail";
import Signature from "@/components/Signature";
import CpuIcon from "@/components/CpuIcon";
import SocialLinks from "@/components/SocialLinks";
import MenuChip from "@/components/landing/MenuChip";
import TopBar from "@/components/landing/TopBar";
import FlightPlan from "@/components/landing/FlightPlan";
import LightRays from "@/components/landing/LightRays";
import LaptopShowcase from "@/components/landing/LaptopShowcase";
import Letter from "@/components/landing/Letter";
import PerspectiveBook from "@/components/landing/PerspectiveBook";
import LaptopCat from "@/components/landing/LaptopCat";
import SendButton from "@/components/landing/SendButton";
import Collage from "@/components/lab/Collage";
import "@/components/landing/landing.css";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a Design Engineer building modern web experiences.",
};

const EMAIL = "namansharmans03@gmail.com";
const TWITTER = "https://x.com/NamanSharma2112";

/**
 * A window seat.
 *
 * The whole page is one flight: the slug in the corner says where the seat is
 * and the flight plan below is the route that got here. Day or night is set
 * from the command menu now that the cabin window has gone.
 */
export default function Home() {
  return (
    <main className="landing relative min-h-screen">
      {/* Behind everything. The bands below carry z-10 because the rays are a
          positioned layer at z-0, and in-flow content paints under one. */}
      <LightRays />

      {/* The date and the light the page is in, both as panels hanging off a
          word. The coordinate rail used to carry the time here; the clock says
          it better, so the rail went with it. */}
      {/* z-50, not z-10: `position: relative` with a z-index makes this a
          stacking context, so the panels inside it can never out-paint a later
          sibling however high their own z-index is. The letter was covering the
          appearance menu and eating its clicks. */}
      <div className="relative z-50 mx-auto grid w-full max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-6 pt-6 sm:px-10">
        <span aria-hidden />
        <TopBar />
        <div className="flex justify-end">
          <MenuChip />
        </div>
      </div>

      {/* Opens as a note rather than a hero: a short measure, left aligned,
          with the handful of marked words carrying what used to be spread
          across a heading, a strapline and a stack list. */}
      <div className="landing-stagger relative z-10 mx-auto flex w-full max-w-[760px] flex-col px-6 pt-24 sm:pt-32">
        <Letter />

        <div className="mt-10 flex flex-wrap items-center gap-2">
          {/* Every hover launches the plane it is showing and settles a fresh
              one in behind it. */}
          <SendButton email={EMAIL}>email me</SendButton>
          <a
            href={TWITTER}
            target="_blank"
            rel="noopener noreferrer"
            className="send rounded-full bg-black/[0.06] px-4 py-2 text-[13px] font-medium text-zinc-900 hover:bg-black/[0.1] dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/[0.16]"
          >
            dm me on X
          </a>
        </div>

        <SocialLinks className="mt-5" />
      </div>

      {/* The hero runs straight into the route. There used to be a marquee of
          type on an arc bridging them, which was the busiest thing on a page
          that is meant to be quiet — and it was bridging a gap the hero no
          longer leaves. */}
      <div className="relative z-10 mt-20 sm:mt-24">
        <FlightPlan />
      </div>

      {/* Shots from the projects above, in a pile you can pick up and throw.
          No framed stage — they sit straight on the page's paper, so it reads
          as things left on a desk rather than a widget embedded in the page. */}
      <section className="relative z-10 mx-auto mt-16 w-full max-w-[760px] px-6 sm:mt-20" aria-label="Project shots">
        {/* Says it is draggable in the heading rather than adding a second
            line of caption under the pile to say the same thing. */}
        <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
          Odds and ends · drag them
        </p>
        <Collage
          className="relative h-[300px] w-full [perspective:1600px]"
          caption=""
          cardClass="shot-card"
        />
      </section>

      {/* Left on the desk next to the pile, not presented: offset to one side
          rather than centred, and it does nothing until you touch it. */}
      <section
        className="relative z-10 mx-auto mt-10 w-full max-w-[760px] px-6"
        aria-label="Notebook"
      >
        <PerspectiveBook className="ml-1 sm:ml-8" />
      </section>

      {/* A project on a machine, straightening up as you scroll to it. */}
      <section
        className="relative z-10 mx-auto mt-24 w-full max-w-[940px] px-6 sm:mt-32"
        aria-label="MotionKit"
      >
        <LaptopShowcase
          src="/motionkit-preview.png"
          alt="MotionKit, an animation library"
          label="MotionKit"
          href="https://www.motionlib.me/"
        />
      </section>

      {/* Landing card. */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-[760px] px-6 pb-24">
        <div className="desk-col flex flex-col items-start gap-6 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* The machine's mascot, sitting on the link down to it: hover the
                link and it looks up from its screen. */}
            <LaptopCat className="mb-3 w-[118px]" />

            <p className="text-[13.5px] leading-[1.75] text-zinc-600 dark:text-zinc-400">
              Open to design engineering roles and freelance collaborations.
              <br />
              Reach me at <CopyEmail email={EMAIL} />
            </p>

            <p className="mt-4 text-[13px] text-zinc-500 dark:text-zinc-500">
              Or poke around the{" "}
              <a
                href="/desktop"
                className="desk-link group inline-flex items-center gap-1.5 align-middle text-zinc-900 dark:text-zinc-100"
              >
                <CpuIcon className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5" />
                <span className="underline decoration-zinc-400 underline-offset-[3px] transition-colors group-hover:decoration-zinc-900 dark:decoration-zinc-600 dark:group-hover:decoration-zinc-100">
                  desktop
                </span>
              </a>
              .
            </p>
          </div>

          <div className="w-[140px] shrink-0 text-zinc-900/70 dark:text-zinc-100/70">
            <Signature className="h-auto w-full overflow-visible" />
          </div>
        </div>
      </div>
    </main>
  );
}
