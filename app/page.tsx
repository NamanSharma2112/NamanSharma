import type { Metadata } from "next";
import Link from "next/link";
import { type Track } from "@/components/home/Player";
import TopStrip from "@/components/home/TopStrip";
import { EyeTracker } from "@/components/EyeTracker";
import Reveal from "@/components/home/Reveal";
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

        {/* ── who, and what ───────────────────────────────────────────
            The name at display size is the first screen's one dominant
            thing; the line under it says in plain words what this is, and
            the one action sits with it rather than at the bottom of the
            page. */}
        <header className="home-hero">
          <div className="home-arrive">
            <h1 className="home-name">Naman Sharma</h1>
            <p className="home-hero-lede">
              I&rsquo;m a design engineer in Jalandhar, India. I build for the
              web, and I care about how an interface <em>feels</em> — the
              easing curve, the hairline, the way a thing behaves when you
              interrupt it halfway.
            </p>
            <div className="home-hero-act">
              <a className="home-button" href={`mailto:${EMAIL}`}>
                <Mail aria-hidden />
                Email me
              </a>
              <span className="home-status">Open to roles and freelance work</span>
            </div>
          </div>

          {/* What is on the page, on the first screen — the far side of the
              name was half a screen of nothing, and this is the thing a
              visitor wants next anyway. Plain links to the sections below. */}
          <nav className="home-index" aria-label="On this page">
            <a href="#motionkit">
              <span className="home-index-name">MotionKit</span>
              <span className="home-index-role">Animation library</span>
            </a>
            <a href="#churnrate">
              <span className="home-index-name">ChurnRate</span>
              <span className="home-index-role">SaaS dashboard</span>
            </a>
            <a href="#desktop">
              <span className="home-index-name">Desktop</span>
              <span className="home-index-role">A machine in the browser</span>
            </a>
            <a href="#how">
              <span className="home-index-name">How I work</span>
              <span className="home-index-role">Design and build, one job</span>
            </a>
          </nav>
        </header>

        {/* ── the three machines, and what each one is ────────────────
            One grid: the section's heading across the top, then a row per
            project — the drawing, and the passage that drawing explains,
            level with each other. */}
        <section className="home-split home-section-gap iso" aria-labelledby="built">
          <div className="home-split-intro">
            <h2 className="home-h2" id="built">
              What I&rsquo;ve built
            </h2>
            <p className="home-lede">
              Drawn rather than described. Each figure is the machine the
              project actually is, and every number on it comes from the same
              model that moves its parts.
            </p>
          </div>

          <Reveal className="home-bento" id="motionkit">
            <CamFigure />
          </Reveal>
          <Reveal className="home-chapter" delay={80}>
            <h3 className="home-chapter-name">MotionKit</h3>
            <p className="home-chapter-role">An animation library</p>
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
            <dl className="home-chapter-spec">
              <div>
                <dt>Try</dt>
                <dd>Move across the plate to turn the crank</dd>
              </div>
              <div>
                <dt>Curve</dt>
                <dd>cubic-bezier(0.23, 1, 0.32, 1)</dd>
              </div>
              <div>
                <dt>Travel</dt>
                <dd>26 px, one turn, every time</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="home-bento" id="churnrate">
            <ChurnFigure />
          </Reveal>
          <Reveal className="home-chapter" delay={80}>
            <h3 className="home-chapter-name">ChurnRate</h3>
            <p className="home-chapter-role">A SaaS dashboard</p>
            <p>
              Churn is a number that hides what it means. A rod is a monthly
              cohort and a bead is a subscriber, so the beads that cross the
              bar are the people who left — the thing a dashboard exists to
              make you feel, not just read.{" "}
              <a href="https://www.churnrate.fun/" target="_blank" rel="noopener noreferrer">
                Open it
              </a>
            </p>
            <dl className="home-chapter-spec">
              <div>
                <dt>Try</dt>
                <dd>It runs on its own, month by month</dd>
              </div>
              <div>
                <dt>Cohorts</dt>
                <dd>6 rods, 10 beads to a rod</dd>
              </div>
              <div>
                <dt>Kept</dt>
                <dd>88% a month — a worked example, not anyone&rsquo;s account</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal className="home-bento" id="desktop">
            <DeskFigure />
          </Reveal>
          <Reveal className="home-chapter" delay={80}>
            <h3 className="home-chapter-name">Desktop</h3>
            <p className="home-chapter-role">A machine in the browser</p>
            <p>
              Then I rebuilt a whole desktop in a tab, because the only way to
              learn how an interface should behave is to build one that has to
              do everything — and none of it is a mockup.{" "}
              <Link href="/desktop">Boot it</Link>
            </p>
            <dl className="home-chapter-spec">
              <div>
                <dt>Try</dt>
                <dd>Hover the figure to boot it again</dd>
              </div>
              <div>
                <dt>Shell</dt>
                <dd>Menu bar, and a dock of 6 apps</dd>
              </div>
              <div>
                <dt>Windows</dt>
                <dd>3, drag and resize</dd>
              </div>
            </dl>
          </Reveal>
        </section>

        {/* ── how it gets made ────────────────────────────────────────
            The passage and the bench it describes, together: the words
            were at the foot of the page, a screen away from the drawing
            they were about. */}
        <section className="home-section-gap iso" aria-labelledby="how">
          <h2 className="home-h2" id="how">
            How I work
          </h2>
          <p className="home-lede">
            Design and build are the same job. A piece goes down the bench and
            comes back changed at every pass, and the last station is a gauge:
            a thing is not finished when it is made, it is finished when it
            reads true.
          </p>
          <Reveal className="home-bench-band">
            <BenchFigure />
          </Reveal>
        </section>

        {/* ── the close ───────────────────────────────────────────── */}
        <section className="home-close home-section-gap" aria-labelledby="touch">
          <h2 className="home-h2" id="touch">
            Get in touch
          </h2>
          <p className="home-lede">
            Open to design engineering roles and freelance work. If it has a
            mechanism in it, I would like to hear about it.
          </p>
          <div className="home-close-act">
            <a className="home-button" href={`mailto:${EMAIL}`}>
              <Mail aria-hidden />
              Email me
            </a>
            <span className="home-addr">{EMAIL}</span>
          </div>
        </section>

        <Footer />
      </div>

      {/* ── the mark that watches you ─────────────────────────────────
          Off in the corner rather than beside the name: at the top it sat
          on the same line as the heading and read as punctuation, and the
          whole point of it is that it follows you around the page. Poke it
          and it talks back. */}
      <div className="home-watch">
        <EyeTracker size={54} shape="Ball" eyes="Slant" eyeScale={1.25} follow={70} bounce={34} />
      </div>
    </main>
  );
}
