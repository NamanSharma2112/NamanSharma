import type { Metadata } from "next";
import Link from "next/link";
import { Chapters } from "@/components/chapters/Chapters";
import { ContactCta, Mark, Socials } from "@/components/chapters/Pieces";
import { WorkDeck, type Project } from "@/components/chapters/WorkDeck";
import { Signature } from "@/components/chapters/Signature";
import { CraftLazy } from "@/components/craft/CraftLazy";
import "@/components/chapters/chapters.css";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description: "Naman Sharma is a design engineer who builds for the web and cares how an interface feels.",
};

/* The work, top card first. Each card is a 3:4 screenshot in public/work. */
const WORK: Project[] = [
  {
    id: "isomatric",
    name: "Isomatric",
    href: "https://isomatric-eta.vercel.app/",
    blurb: "isometric figures for React. Eleven interactive machines, each the explanation of an idea, and every one comes apart into a labelled teardown.",
    card: "/work/card-isomatric.jpg",
  },
  {
    id: "motionkit",
    name: "MotionKit",
    href: "https://www.motionlib.me/",
    blurb: "an animation library. The curves and springs I kept rewriting slightly differently every time, packaged once.",
    card: "/work/card-motionkit.jpg",
  },
  {
    id: "easing",
    name: "Easing Lab",
    href: "https://easing-nine.vercel.app/",
    blurb: "a bench for motion. Easing curves and springs side by side on the same animation, so you can see which one feels right.",
    card: "/work/card-easing.jpg",
  },
  {
    id: "writing",
    name: "Writing",
    href: "/blog",
    blurb: "notes from building: on developing taste, and on the things I had to learn properly, like Postgres row-level security.",
    card: "/work/card-writing.jpg",
  },
];

/* Without script the chapters cannot move, so they stack into one page. */
const STILL = `.front{position:static}.front .stage{position:static}.front .ch{position:static;visibility:visible;min-height:100vh}.front .ln{opacity:1;filter:none;transform:none}.front .dots,.front .count,.front .socials{display:none}html:has(.front),html:has(.front) body{overflow:auto}`;

export default function Home() {
  return (
    <div className="front">
      <noscript>
        <style>{STILL}</style>
      </noscript>
      <Chapters
        chapters={[
          {
            label: "Intro",
            content: (
              <>
                <div className="ln mark-row" aria-hidden="true">
                  <Mark />
                </div>
                <h1 className="ln name">Naman Sharma</h1>
                <p className="ln">
                  Design engineer. I build for the web, and I care about how an interface feels — the easing curve, the
                  hairline, the way a thing behaves when you interrupt it halfway.
                </p>
                <p className="ln">Open to roles and freelance work.</p>
                <div className="ln cta-row">
                  <ContactCta />
                </div>
                <p className="ln hint">Scroll for my work.</p>
              </>
            ),
          },
          {
            label: "Work",
            content: (
              <>
                <h2 className="ln label">Work</h2>
                <WorkDeck projects={WORK} />
              </>
            ),
          },
          {
            label: "Craft",
            wide: true,
            content: (
              <>
                <h2 className="ln label">Craft</h2>
                <CraftLazy />
              </>
            ),
          },
          {
            label: "Contact",
            content: (
              <>
                <h2 className="ln name">Say hello</h2>
                <p className="ln">
                  Design and build are the same job to me, and a thing is finished when it reads true. If yours has a
                  mechanism in it, I&rsquo;d like to hear about it.
                </p>
                <p className="ln">
                  Reach out anytime on <a href="https://x.com/NamanSharma2112">X</a>,{" "}
                  <a href="https://github.com/NamanSharma2112">GitHub</a> or{" "}
                  <a href="mailto:namansharmans03@gmail.com">email</a>, or read my <Link href="/blog">writing</Link>.
                </p>
                <div className="ln cta-row">
                  <ContactCta />
                </div>
                <div className="ln sign-row">
                  <Signature />
                </div>
              </>
            ),
          },
        ]}
      />
      <div className="socials">
        <Socials />
      </div>
    </div>
  );
}
