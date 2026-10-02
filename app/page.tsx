import type { Metadata } from "next";
import Link from "next/link";
import Monogram from "@/components/home/Monogram";
import Status from "@/components/home/Status";
import "@/components/home/home.css";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a design engineer building modern web experiences.",
};

const EMAIL = "namansharmans03@gmail.com";

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
          <span className="home-mark">
            <Monogram />
          </span>
          <Status />
        </div>

        <h1 className="home-name">Naman Sharma</h1>

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

        <nav className="home-jump" aria-label="Elsewhere">
          <Link className="home-link" href="/work">
            Work
          </Link>
          <Link className="home-link" href="/blog">
            Writing
          </Link>
          <Link className="home-link" href="/inspiration">
            Inspiration
          </Link>
          <Link className="home-link" href="/lab">
            Lab
          </Link>
          <a className="home-link" href={`mailto:${EMAIL}`}>
            Connect
          </a>
        </nav>

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

        <footer className="home-foot">
          <p>
            Open to design engineering roles and freelance work —{" "}
            <a className="home-link" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </footer>
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
