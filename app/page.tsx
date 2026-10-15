import type { Metadata } from "next";
import Link from "next/link";
import { type Track } from "@/components/home/Player";
import TopStrip from "@/components/home/TopStrip";
import { EyeTracker } from "@/components/EyeTracker";
import Footer from "@/components/home/Footer";
import { Mail } from "lucide-react";
import { CamFigure } from "@/components/figures/cam/figure";
import { DeskFigure } from "@/components/figures/desk/figure";
import { ChurnFigure } from "@/components/figures/churn/figure";
import { BenchFigure } from "@/components/figures/bench/figure";
import "@/components/iso/iso.css";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a design engineer building modern web experiences.",
};

const EMAIL = "namansharmans03@gmail.com";

/**
 * The track in the topbar's pill, or null for no pill at all.
 *
 * To turn it on: drop the file in public/music/ and fill this in. It plays a
 * real file rather than reporting what a service claims is playing, so what it
 * shows is always true and it needs no key, no server route and nothing that
 * can go down.
 *
 *   const TRACK: Track | null = {
 *     src: "/music/your-track.mp3",
 *     title: "Track name",
 *     artist: "Artist",
 *     art: "/music/cover.jpg",   // optional; a record is drawn without it
 *   };
 */
const TRACK: Track | null = null;

/**
 * The front page.
 *
 * One column, one screen of prose, and a list under it — the whole page is
 * shorter than a single section of what it replaces. The links live in the
 * sentences rather than in a nav, because on a page this size a nav is a second
 * list of the same things.
 *
 * Everything on it is written for it. Nothing here is a reused block from the
 * version before.
 */
export default function Home() {
  return (
    <main className="home">
      <div className="home-frame">
        {/* ── the bar ─────────────────────────────────────────────── */}
        <TopStrip track={TRACK} />

        {/* ── who ──────────────────────────────────────────────────── */}
        <header className="home-hero home-col">
          <h1 className="home-name">Naman Sharma</h1>
          <p className="home-hero-lede">
            I&rsquo;m a design engineer. I build for the web, and I care about
            how an interface <em>feels</em> — the easing curve, the hairline,
            the way a thing behaves when you interrupt it halfway.
          </p>
          <ul className="home-hero-meta">
            <li>Design engineer</li>
            <li>Jalandhar, India</li>
            <li>Open to work</li>
          </ul>
        </header>

        {/* ── the three machines, and the story they tell ───────────
            Each figure sits beside the passage that explains it, so the
            column reads down as one account: the thing I kept rebuilding,
            the thing I measured, the thing I rebuilt from nothing. */}
        <section className="home-split iso" aria-label="What I have built">
          {/* The one passage that introduces all three, across the frame —
              so the rows under it can be a drawing and the words for that
              drawing, with nothing left over to put anywhere. */}
          <div className="home-split-intro">
            <p className="home-section-label">The short version</p>
            <p className="home-story-lede">
              Drawn rather than described. Each figure is the machine the
              project actually is, and every number on it comes from the same
              model that moves its parts.
            </p>
          </div>

          {/* Each row: the machine, and the paragraph that machine is. They
              share a row, so the text sits level with its own figure instead
              of running down a column of its own. */}
          <article className="home-bento">
            <CamFigure />
          </article>
          <div className="home-chapter">
            <h2 className="home-chapter-name">
              MotionKit <span>Animation library</span>
            </h2>
            <p>
              I kept writing the same motion code and kept getting it slightly
              different each time, so I packaged it. The cam beside this is cut
              to one of its curves: one turn of the crank plays the curve once
              and the slide travels the same distance every time.{" "}
              <a href="https://www.motionlib.me/" target="_blank" rel="noopener noreferrer">
                Open it
              </a>
            </p>
            {/* Read off the figure beside it, not written separately: these
                are the numbers its own model is cut to. */}
            <ul className="home-chapter-spec">
              <li>
                <span>Try</span>Move across the plate to turn the crank
              </li>
              <li>
                <span>Curve</span>cubic-bezier(0.23, 1, 0.32, 1)
              </li>
              <li>
                <span>Travel</span>26 px, one turn, every time
              </li>
            </ul>
          </div>

          <article className="home-bento">
            <ChurnFigure />
          </article>
          <div className="home-chapter">
            <h2 className="home-chapter-name">
              ChurnRate <span>SaaS dashboard</span>
            </h2>
            <p>
              Churn is a number that hides what it means. A rod is a monthly
              cohort and a bead is a subscriber, so the beads that cross the
              bar are the people who left — the thing a dashboard exists to
              make you feel, not just read.{" "}
              <a href="https://www.churnrate.fun/" target="_blank" rel="noopener noreferrer">
                Open it
              </a>
            </p>
            <ul className="home-chapter-spec">
              <li>
                <span>Try</span>It runs on its own, month by month
              </li>
              <li>
                <span>Cohorts</span>6 rods, 10 beads to a rod
              </li>
              <li>
                <span>Kept</span>88% a month — a worked example, not
                anyone&rsquo;s account
              </li>
            </ul>
          </div>

          <article className="home-bento">
            <DeskFigure />
          </article>
          <div className="home-chapter">
            <h2 className="home-chapter-name">
              Desktop <span>A machine in the browser</span>
            </h2>
            <p>
              Then I rebuilt a whole desktop in a tab, because the only way to
              learn how an interface should behave is to build one that has to
              do everything — and none of it is a mockup.{" "}
              <Link href="/desktop">Boot it</Link>
            </p>
            <ul className="home-chapter-spec">
              <li>
                <span>Try</span>Hover the figure to boot it again
              </li>
              <li>
                <span>Shell</span>Menu bar, and a dock of 6 apps
              </li>
              <li>
                <span>Windows</span>3, drag and resize
              </li>
            </ul>
          </div>
        </section>

        {/* ── and the bench the three of them came off ──────────────── */}
        <section className="home-bench-band iso" aria-label="How I work">
          <BenchFigure />
        </section>

        {/* ── the story under it ───────────────────────────────────── */}
        <section className="home-story" aria-label="How I work, in words">
          <div className="home-col">
            <p className="home-section-label">How I work</p>
            <p className="home-story-lede">
              Design and build are the same job. A piece goes down the bench
              and comes back changed at every pass, and the last station is a
              gauge: a thing is not finished when it is made, it is finished
              when it reads true.
            </p>
          </div>

          <div className="home-col">
            <section className="home-section" aria-label="Getting in touch">
              <p className="home-section-label">Getting in touch</p>
              <p className="home-story-lede">
                Open to design engineering roles and freelance work. If it has
                a mechanism in it, I would like to hear about it.
              </p>

              {/* Set like the corner of a figure card: a hairline, a mono
                  label, no glow. */}
              <a className="home-plate-link" href={`mailto:${EMAIL}`}>
                <Mail aria-hidden />
                <span>Email me</span>
                <span className="home-plate-addr">{EMAIL}</span>
              </a>
            </section>

            <Footer />
          </div>
        </section>
      </div>

      {/* ── the mark that watches you ─────────────────────────────────
          Off in the corner rather than beside the name: at the top it sat
          on the same line as the heading and read as punctuation, and the
          whole point of it is that it follows you around the page. */}
      <div className="home-watch" aria-hidden>
        <EyeTracker size={54} shape="Ball" eyes="Slant" eyeScale={1.25} follow={70} bounce={34} />
      </div>
    </main>
  );
}
