import type { Metadata } from "next";
import Link from "next/link";
import Player, { type Track } from "@/components/home/Player";
import { HalftoneDots } from "@/components/ui/halftone-dots";
import Nav from "@/components/home/Nav";
import ParticleName from "@/components/home/ParticleName";
import Chat from "@/components/home/Chat";
import Status from "@/components/home/Status";
import { SIGNATURE_PATHS, SIGNATURE_VIEWBOX } from "@/components/signature-paths";
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
        <div className="home-strip">
          {/* Left: the signature, and the player beside it. The player used to
              be centred on the bar, which is where the nav now is — two things
              absolutely centred on the same strip would sit on top of each
              other the moment a track was configured. */}
          <span className="home-strip-left">
            <svg
              className="home-sig"
              viewBox={SIGNATURE_VIEWBOX}
              role="img"
              aria-label="Naman Sharma"
            >
              {SIGNATURE_PATHS.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
            <Player track={TRACK} />
          </span>

          {/* The nav, at the top. */}
          <span className="home-strip-centre">
            <Nav />
          </span>

          <Status />
        </div>

        {/* The cut-out, not the original: the source is a circle on a black
            field, and the halftone drew that field as a solid ring of dots
            around the face. Masked to the circle, there is nothing outside it
            to draw.

            Large, because the dot grid is a fixed 6px cell — at thumbnail size
            a face does not survive the sampling. */}
        <div className="home-portrait">
          <HalftoneDots
            src="/me/portrait-cut.png"
            cell={4}
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

          <div className="home-list">
            {WORK.map((w) => (
              <a
                key={w.name}
                className="home-item"
                href={w.href}
                target={w.href.startsWith("http") ? "_blank" : undefined}
                rel={w.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                <p className="home-item-role">{w.role}</p>
                <p className="home-item-name">{w.name}</p>
                <p className="home-item-note">{w.note}</p>
                <span className="home-item-go">
                  {w.cta}
                  <Arrow />
                </span>
              </a>
            ))}
          </div>
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
      </div>
    </main>
  );
}

const WORK = [
  {
    role: "Animation library",
    name: "MotionKit",
    note: "The motion pieces I kept rebuilding, packaged so they behave the same way every time.",
    href: "https://www.motionlib.me/",
    cta: "Open it",
  },
  {
    role: "SaaS dashboard",
    name: "ChurnRate",
    note: "Churn analysis and analytics for subscription products, designed and built end to end.",
    href: "https://www.churnrate.fun/",
    cta: "Open it",
  },
  {
    role: "Productivity tool",
    name: "Task Management",
    note: "A full-stack task app — boards, state and the whole workflow, built to stay quick as the list grows.",
    href: "https://taskmangementapplication-production.up.railway.app",
    cta: "Open it",
  },
  {
    role: "A machine in the browser",
    name: "Desktop",
    note: "Boot screen, menu bar, dock, draggable windows, and the games that came with it.",
    href: "/desktop",
    cta: "Boot it",
  },
];

function Arrow() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" />
    </svg>
  );
}
