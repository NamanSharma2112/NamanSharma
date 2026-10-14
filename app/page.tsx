import type { Metadata } from "next";
import Link from "next/link";
import { type Track } from "@/components/home/Player";
import TopStrip from "@/components/home/TopStrip";
import Footer from "@/components/home/Footer";
import { HalftoneDots } from "@/components/ui/halftone-dots";
import ParticleName from "@/components/home/ParticleName";
import Chat from "@/components/home/Chat";
import { NeonEdgeButton } from "@/components/ui/neon-edge-button";
import { Mail } from "lucide-react";
import Work, { type Project } from "@/components/home/Work";
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

/** The contact section, as an exchange. Generic questions, his own answers. */
const TALK = [
  { from: "them", text: "Are you taking on work?" },
  { from: "me", text: "Yes — design engineering roles and freelance." },
  { from: "them", text: "What do you actually do?" },
  {
    from: "me",
    text: "Design and build the same thing. Interfaces, motion, and the details that decide whether it feels right.",
  },
  { from: "me", text: "Easiest is to email me." },
] as const;

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
      <div className="home-col">
        <TopStrip track={TRACK} />

        {/* The drawing, lifted off the card it came on — the halftone reads a
            white field as paper and would have ringed the whole picture with
            dots. Only the backdrop came out: his face and shirt are white too,
            and losing those leaves a drawing of hair and a beard the moment
            the page goes dark.

            Large, because the dot grid is a fixed cell: at thumbnail size the
            glasses are two dots and the face goes with them. */}
        <div className="home-portrait">
          <HalftoneDots
            src="/me/portrait-art.png"
            cell={3}
            // Room for the dots to burst past the edge. Wide, as the component
            // intends — the picture is only redrawn where it is being touched,
            // so the empty margin is a blit rather than ten thousand dots.
            spill={56}
            accent="#000000"
            displace
            className="home-portrait-dots"
          />
        </div>

        <ParticleName text="Naman Sharma" />

        <div className="home-prose">
          <p>
            I&rsquo;m a design engineer. I build for the web, and I care about
            how an interface <em>feels</em> — the easing curve, the hairline,
            the way a thing behaves when you interrupt it halfway.
          </p>

          <p>
            So the rest of this page is drawn rather than described. Each
            machine below is the thing it explains, and every number on one
            comes from the same model that moves its parts — the cam really is
            cut to the curve this site animates with, and the dial really is
            counting the beads on the rods.
          </p>
        </div>
      </div>

      {/* ── how the work gets made ──────────────────────────────────── */}
      <section className="home-stage" aria-label="How I work">
        <div className="home-col">
          <p className="home-section-label">How I work</p>
          <p className="home-stage-lede">
            Design and build are the same job. A piece goes down the bench and
            comes back changed at every pass — drawn, cut, pressed — and the
            last station is a gauge, because a thing is not finished when it is
            made, it is finished when it reads true.
          </p>
        </div>

        <div className="home-bench iso">
          <BenchFigure />
        </div>
      </section>

      {/* ── the three things, each as the machine it is ─────────────── */}
      <section className="home-stage" aria-label="What I have built">
        <div className="home-col">
          <p className="home-section-label">What I&rsquo;ve built</p>
          <p className="home-stage-lede">
            Three projects, each drawn as the machine it actually is. Turn the
            first one, watch the second count, boot the third.
          </p>
        </div>

        <div className="home-bento-row iso">
          <article className="home-tile">
            <h2 className="home-tile-name">MotionKit</h2>
            <p className="home-tile-role">Animation library</p>
            <CamFigure />
            <p className="home-tile-note">
              The motion code I kept rebuilding, packaged so a preset behaves
              the same way every time. The cam is cut to one of its curves.{" "}
              <a href="https://www.motionlib.me/" target="_blank" rel="noopener noreferrer">
                Open it
              </a>
            </p>
          </article>

          <article className="home-tile">
            <h2 className="home-tile-name">ChurnRate</h2>
            <p className="home-tile-role">SaaS dashboard</p>
            <ChurnFigure />
            <p className="home-tile-note">
              Churn analysis for subscription products, designed and built end
              to end. A rod is a cohort, a bead is a subscriber.{" "}
              <a href="https://www.churnrate.fun/" target="_blank" rel="noopener noreferrer">
                Open it
              </a>
            </p>
          </article>

          <article className="home-tile">
            <h2 className="home-tile-name">Desktop</h2>
            <p className="home-tile-role">A machine in the browser</p>
            <DeskFigure />
            <p className="home-tile-note">
              A whole desktop in a tab: it boots, it has a menu bar and a dock,
              and the windows drag and resize.{" "}
              <Link href="/desktop">Boot it</Link>
            </p>
          </article>
        </div>
      </section>

      <div className="home-col">

        <section className="home-section" aria-label="Selected work">
          <p className="home-section-label">Selected work</p>

          {/* Pick one up and put it where you like. */}
          <Work projects={WORK} />
        </section>

        <section className="home-section" aria-label="Getting in touch">
          <p className="home-section-label">Getting in touch</p>

          {/* The questions are the ones that actually get asked, and the
              answers are his. Nothing here is attributed to anyone — it is a
              contact section laid out as an exchange, not a testimonial. */}
          <Chat lines={TALK} />

          <div className="home-chat-foot">
            <NeonEdgeButton href={`mailto:${EMAIL}`} icon={<Mail />}>
              Email me
            </NeonEdgeButton>
            <span className="home-chat-address">{EMAIL}</span>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}

const WORK: Project[] = [
  {
    id: "motionkit",
    role: "Animation library",
    name: "MotionKit",
    note: "The motion pieces I kept rebuilding, packaged so they behave the same way every time.",
    href: "https://www.motionlib.me/",
    cta: "Open it",
  },
  {
    id: "churnrate",
    role: "SaaS dashboard",
    name: "ChurnRate",
    note: "Churn analysis and analytics for subscription products, designed and built end to end.",
    href: "https://www.churnrate.fun/",
    cta: "Open it",
  },
  {
    id: "task-management",
    role: "Productivity tool",
    name: "Task Management",
    note: "A full-stack task app — boards, state and the whole workflow, built to stay quick as the list grows.",
    href: "https://taskmangementapplication-production.up.railway.app",
    cta: "Open it",
  },
  {
    id: "desktop",
    role: "A machine in the browser",
    name: "Desktop",
    note: "Boot screen, menu bar, dock, draggable windows, and the games that came with it.",
    href: "/desktop",
    cta: "Boot it",
  },
];

