import type { Metadata } from "next";
import Link from "next/link";
import CopyEmail from "@/components/CopyEmail";
import Signature from "@/components/Signature";
import SocialLinks from "@/components/SocialLinks";
import BlurReveal from "@/components/BlurReveal";
import SectionNav from "@/components/site/SectionNav";
import Section from "@/components/site/Section";
import { SECTIONS } from "@/components/site/sections";
import Projects from "@/components/landing/Projects";
import LaptopShowcase from "@/components/landing/LaptopShowcase";
import LaptopCat from "@/components/landing/LaptopCat";
import Letter from "@/components/landing/Letter";
import LightRays from "@/components/landing/LightRays";
import PerspectiveBook from "@/components/landing/PerspectiveBook";
import SendButton from "@/components/landing/SendButton";
import TopBar from "@/components/landing/TopBar";
import Collage from "@/components/lab/Collage";
import "@/components/landing/landing.css";
import "@/components/site/site.css";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a Design Engineer building modern web experiences.",
};

const EMAIL = "namansharmans03@gmail.com";
const TWITTER = "https://x.com/NamanSharma2112";

/**
 * The front page, as a run of numbered sections under a bar that becomes an
 * index of them.
 *
 * The hero is not numbered — it is the thing you are introduced by, not a part
 * of the page you navigate to — and the bar carries its name and links until
 * the hero leaves, at which point it has a page to index and shows it.
 */
export default function Home() {
  const [work, craft, machine, writing, about, contact] = SECTIONS;

  return (
    <main className="landing relative min-h-screen">
      <LightRays />
      <SectionNav email={EMAIL} />

      {/* ── the hero ─────────────────────────────────────────────────────── */}
      <div id="hero" className="site-hero relative z-10">
        <div>
          <BlurReveal
            as="h1"
            text="Design engineer building things that feel right."
            className="site-h1"
          />

          <p className="site-hero-blurb">
            I sit in the space between design and engineering — obsessing over
            motion, interaction, and the details that decide whether an
            interface feels considered or merely finished.
          </p>

          <div className="site-hero-actions">
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

          <SocialLinks className="mt-6" />
        </div>

        {/* The machine, as the thing the hero is a window onto. */}
        <div className="hidden lg:block">
          <LaptopShowcase
            src="/motionkit-preview.png"
            alt="MotionKit, an animation library"
            label="MotionKit"
            href="https://www.motionlib.me/"
          />
        </div>
      </div>

      {/* ── 01 work ──────────────────────────────────────────────────────── */}
      <Section def={work} index={0} wide>
        <Projects />
      </Section>

      {/* ── 02 craft ─────────────────────────────────────────────────────── */}
      <Section def={craft} index={1} wide>
        <div className="site-trio">
          {CRAFT.map((c) => (
            <div key={c.title} className="site-trio-item">
              <span className="site-trio-icon" aria-hidden>
                {c.icon}
              </span>
              <p className="site-trio-title">{c.title}</p>
              <p className="site-trio-note">{c.note}</p>
            </div>
          ))}
        </div>

        {/* Shots from the work above, in a pile you can pick up and throw. */}
        <div className="mt-16">
          <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">
            Odds and ends · drag them
          </p>
          <Collage
            className="relative mx-auto h-[300px] w-full max-w-[760px] overflow-hidden [perspective:1600px]"
            caption=""
            cardClass="shot-card"
          />
        </div>
      </Section>

      {/* ── 03 machine ───────────────────────────────────────────────────── */}
      <Section def={machine} index={2} wide>
        <div className="mx-auto max-w-[940px]">
          <LaptopShowcase
            src="/churnrate-dashboard.png"
            alt="ChurnRate, a SaaS dashboard"
            label="Open the desktop"
            href="/desktop"
          />
        </div>
      </Section>

      {/* ── 04 writing ───────────────────────────────────────────────────── */}
      <Section def={writing} index={3}>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/blog"
            className="send rounded-full bg-black/[0.06] px-4 py-2 text-[13px] font-medium text-zinc-900 hover:bg-black/[0.1] dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/[0.16]"
          >
            Read the writing
          </Link>
          <Link
            href="/inspiration"
            className="send rounded-full bg-black/[0.06] px-4 py-2 text-[13px] font-medium text-zinc-900 hover:bg-black/[0.1] dark:bg-white/10 dark:text-zinc-100 dark:hover:bg-white/[0.16]"
          >
            People I look up to
          </Link>
        </div>

        {/* Left on the desk beside the writing, not presented. */}
        <div className="mt-14">
          <PerspectiveBook className="ml-1 sm:ml-8" />
        </div>
      </Section>

      {/* ── 05 about ─────────────────────────────────────────────────────── */}
      <Section def={about} index={4}>
        <Letter />
      </Section>

      {/* ── 06 contact ───────────────────────────────────────────────────── */}
      <Section def={contact} index={5}>
        <div className="flex flex-col items-start gap-8 border-t border-[var(--line)] pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <LaptopCat className="mb-3 w-[118px]" />

            <p className="text-[13.5px] leading-[1.75] text-[var(--fg-body)]">
              Reach me at <CopyEmail email={EMAIL} />
            </p>
          </div>

          <div className="w-[140px] shrink-0 text-[var(--fg)] opacity-70">
            <Signature className="h-auto w-full overflow-visible" />
          </div>
        </div>
      </Section>

      {/* The clock and the light the page is in, out of the way at the foot. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] justify-center px-8 pb-16">
        <TopBar />
      </div>
    </main>
  );
}

/** What the craft section lists. Short enough to read in a glance each. */
const CRAFT = [
  {
    title: "Motion",
    note: "Springs for anything a pointer drives, and nothing that cannot be interrupted.",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 17c4 0 5-10 9-10s5 10 9 10" />
      </svg>
    ),
  },
  {
    title: "Interaction",
    note: "Hover, focus and touch treated as three ways in, not one with fallbacks.",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 4v9.5L5.2 12a2 2 0 0 0-2.8 2.8l4.3 5.1A4 4 0 0 0 9.8 21H15a4 4 0 0 0 4-4v-4.5a1.7 1.7 0 0 0-3.4 0" />
        <path d="M15.6 12.5V11a1.7 1.7 0 0 0-3.4 0v1.5M12.2 11V9.5a1.7 1.7 0 0 0-3.4 0" />
      </svg>
    ),
  },
  {
    title: "Detail",
    note: "The hairline, the easing curve, the one pixel — the part nobody names.",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.9-3.9M11 8v6M8 11h6" />
      </svg>
    ),
  },
];
