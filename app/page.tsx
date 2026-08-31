import type { Metadata } from "next";
import CopyEmail from "@/components/CopyEmail";
import Signature from "@/components/Signature";
import CpuIcon from "@/components/CpuIcon";
import SocialLinks from "@/components/SocialLinks";
import CoordinateRail from "@/components/landing/CoordinateRail";
import MenuChip from "@/components/landing/MenuChip";
import PortholeWindow from "@/components/landing/PortholeWindow";
import FlightPlan from "@/components/landing/FlightPlan";
import StackScatter from "@/components/landing/StackScatter";
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
 * The whole page is one flight: the slug in the corner says where the seat is,
 * the cabin window decides whether it is day or night outside, and the flight
 * plan below is the route that got here.
 */
export default function Home() {
  return (
    <main className="landing relative min-h-screen">
      <div className="mx-auto flex w-full max-w-[1180px] items-start justify-between gap-6 px-6 pt-6 sm:px-10">
        <CoordinateRail />
        <MenuChip />
      </div>

      {/* The window, and what it is a window onto. */}
      <div className="landing-stagger mx-auto flex w-full max-w-[760px] flex-col items-center px-6 pt-10 text-center sm:pt-14">
        <PortholeWindow />

        <h1 className="mt-14 text-[19px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-[21px]">
          Design Engineer &amp; Creative Technologist
        </h1>

        <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.65] text-zinc-500 dark:text-zinc-400">
          Designing and building whatever I can imagine with{" "}
          <StackScatter>a stack I trust</StackScatter> — obsessing over the
          details and the why behind good products.
        </p>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white transition-[opacity,transform] duration-200 ease-[var(--ease-out)] hover:opacity-85 active:scale-[0.97] motion-reduce:active:scale-100 dark:bg-zinc-100 dark:text-zinc-900"
          >
            email me
          </a>
          <a
            href={TWITTER}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black/[0.06] px-4 py-2 text-[13px] font-medium text-zinc-900 transition-[background-color,transform] duration-200 ease-[var(--ease-out)] hover:bg-black/[0.1] active:scale-[0.97] motion-reduce:active:scale-100 dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/[0.16]"
          >
            dm me on X
          </a>
        </div>

        <SocialLinks className="mt-5 justify-center" />
      </div>

      <div className="mt-20 sm:mt-24">
        <FlightPlan />
      </div>

      {/* Landing card. */}
      <div className="mx-auto mt-20 w-full max-w-[760px] px-6 pb-24">
        <div className="flex flex-col items-start gap-6 border-t border-black/10 pt-8 dark:border-white/10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[13.5px] leading-[1.75] text-zinc-600 dark:text-zinc-400">
              Open to design engineering roles and freelance collaborations.
              <br />
              Reach me at <CopyEmail email={EMAIL} />
            </p>

            <p className="mt-4 text-[13px] text-zinc-500 dark:text-zinc-500">
              Or poke around the{" "}
              <a
                href="/desktop"
                className="group inline-flex items-center gap-1.5 align-middle text-zinc-900 dark:text-zinc-100"
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
