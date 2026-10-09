import type { Metadata } from "next";
import Link from "next/link";
import { type Track } from "@/components/home/Player";
import TopStrip from "@/components/home/TopStrip";
import Footer from "@/components/home/Footer";
import { HalftoneDots } from "@/components/ui/halftone-dots";
import ParticleName from "@/components/home/ParticleName";
import Chat from "@/components/home/Chat";
import Work, { type Project } from "@/components/home/Work";
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
            cell={4}
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
            Most of what I make starts as a passion project.{" "}
            <a href="https://www.motionlib.me/" target="_blank" rel="noopener noreferrer">
              MotionKit
            </a>{" "}
            is the motion code I kept rebuilding, packaged so it behaves the
            same way every time.{" "}
            <a href="https://www.churnrate.fun/" target="_blank" rel="noopener noreferrer">
              ChurnRate
            </a>{" "}
            is a dashboard for subscription products, designed and built end to
            end.
          </p>

          <p>
            I also rebuilt a whole{" "}
            <Link href="/desktop">desktop</Link> in the browser — it boots, it
            has a menu bar and a dock, and the windows drag and resize.
          </p>
        </div>

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

          <p className="home-chat-foot">
            Email is the fastest way —{" "}
            <a className="home-link" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
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

