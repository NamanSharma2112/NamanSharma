"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Signature from "./Signature";
import HoverCards from "./HoverCards";
import HighlightList from "./HighlightList";
import CopyEmail from "./CopyEmail";
import { LogosCarousel } from "./LogosCarousel";
import { SpotifyCard } from "@/registry/spell-ui/spotify-card";
import { Tweet } from "@/registry/spell-ui/tweet";

/* ── Stagger animation config ── */
const STAGGER_DELAY = 0.06;
const DURATION = 0.5;
const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(i: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION, delay: i * STAGGER_DELAY, ease: EASE },
  };
}

/* ── Data ── */
const PROJECTS = [
  {
    label: "MotionKit",
    description: "Animation Library",
    href: "https://motion-kit-three.vercel.app/",
    external: true,
  },
  {
    label: "ChurnRate",
    description: "SaaS Dashboard",
    href: "https://www.churnrate.fun/",
    external: true,
  },
];



export default function Profile() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fade in entire wrapper after mount (matches kosta.fyi pattern)
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = "1";
    }
  }, []);

  let i = 0; // stagger counter

  return (
    <div
      ref={wrapperRef}
      className="transition-opacity duration-500"
      style={{ opacity: 0 }}
    >
      <main className="flex min-h-screen w-full justify-center overflow-x-clip bg-[#fafafa] px-5 pt-12 pb-24 text-black sm:pt-[100px]">
        <div className="flex w-full flex-col items-center pb-8 text-[14px] leading-[20px] font-sans font-medium">
          <div className="flex w-full flex-col items-center gap-10">
            {/* ═══════════════════════════════════════
                HEADER
            ═══════════════════════════════════════ */}
            <header className="flex w-full max-w-[576px] items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Signature />

                <motion.p {...fadeUp(i++)} className="text-black">
                  Naman Sharma
                </motion.p>

                <motion.p {...fadeUp(i++)} className="text-[#8d8d8d]">
                  Design Engineer
                </motion.p>
              </div>

              <motion.div {...fadeUp(i++)} className="hidden sm:block shrink-0 mt-2">
                <SpotifyCard
                  url="https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ"
                  className="max-w-[325px] max-h-[80px]"
                />
              </motion.div>
            </header>

            {/* Mobile Spotify Card */}
            <motion.div {...fadeUp(i++)} className="sm:hidden flex w-full max-w-[576px]">
              <SpotifyCard
                url="https://open.spotify.com/track/0DTSnA1bcVI5niJzoyBPyZ"
                className="w-full max-h-[80px]"
              />
            </motion.div>

            {/* ═══════════════════════════════════════
                BIO
            ═══════════════════════════════════════ */}
            <div className="flex w-full max-w-[576px] flex-col gap-0 break-words">
              <motion.p {...fadeUp(i++)}>
                I&apos;m a Design Engineer who designs and builds whatever I can
                imagine or get inspiration from. Currently exploring modern web
                experiences and shipping projects that push creative boundaries.
              </motion.p>

              <p aria-hidden="true">&nbsp;</p>

              <motion.p {...fadeUp(i++)}>
                Currently working on passion projects and refining my craft with
                my go-to stack:{" "}
                <HoverCards
                  label="React & Next.js"
                  cards={[
                    {
                      src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=360&fit=crop",
                      alt: "React code on screen",
                      dx: 34,
                      r: 11.9,
                    },
                    {
                      src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&h=360&fit=crop",
                      alt: "Code editor",
                      dx: -34,
                      r: -6.58,
                    },
                  ]}
                />
                , TypeScript, Tailwind CSS,{" "}
                <HoverCards
                  label="Motion.dev"
                  cards={[
                    {
                      src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=360&fit=crop",
                      alt: "Animations and motion",
                      dx: 34,
                      r: 8.5,
                    },
                    {
                      src: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=360&fit=crop",
                      alt: "Creative coding",
                      dx: -34,
                      r: -10.2,
                    },
                  ]}
                />{" "}
                and Claude.
              </motion.p>

              <p aria-hidden="true">&nbsp;</p>

              <motion.p {...fadeUp(i++)}>
                I usually sketch out any design idea in my mind and try to
                replicate its structure on{" "}
                <a
                  href="https://excalidraw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2 transition-opacity duration-150 [@media(hover:hover)]:hover:opacity-70"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  Excalidraw
                </a>{" "}
                before I code it.
              </motion.p>

              <p aria-hidden="true">&nbsp;</p>

              <motion.p {...fadeUp(i++)}>
                Open to design engineering roles and freelance collaborations.
                Reach out to me via{" "}
                <CopyEmail email="namansharma@email.com" /> or DM me on{" "}
                <a
                  href="https://x.com/NamanSharma2112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted underline-offset-2 transition-opacity duration-150 [@media(hover:hover)]:hover:opacity-70"
                  style={{
                    transitionTimingFunction:
                      "cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  Twitter
                </a>
                .
              </motion.p>
            </div>

            {/* ═══════════════════════════════════════
                TECH LOGOS
            ═══════════════════════════════════════ */}
            <motion.div {...fadeUp(i++)} className="w-full max-w-[576px] py-6">
              <LogosCarousel>
                {[
                  { src: "https://cdn.simpleicons.org/react/000000", alt: "React logo" },
                  { src: "https://cdn.simpleicons.org/typescript/000000", alt: "TypeScript logo" },
                  { src: "https://cdn.simpleicons.org/nextdotjs/000000", alt: "Next.js logo" },
                  { src: "https://cdn.simpleicons.org/tailwindcss/000000", alt: "Tailwind CSS logo" },
                  { src: "https://cdn.simpleicons.org/vercel/000000", alt: "Vercel logo" },
                  { src: "https://cdn.simpleicons.org/framer/000000", alt: "Motion (Framer) logo" },
                  { src: "https://cdn.simpleicons.org/claude/000000", alt: "Claude logo" },
                  { src: "https://cdn.simpleicons.org/excalidraw/000000", alt: "Excalidraw logo" },
                ].map((logo) => (
                  <img
                    key={logo.src}
                    src={logo.src}
                    alt={logo.alt}
                    width={96}
                    height={96}
                    className="h-9 w-9 object-contain opacity-60 hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none"
                  />
                ))}
              </LogosCarousel>
            </motion.div>

            {/* ═══════════════════════════════════════
                HIGHLIGHTS (Projects)
            ═══════════════════════════════════════ */}
            <motion.div {...fadeUp(i++)} className="w-full flex justify-center">
              <HighlightList title="Highlights" items={PROJECTS} />
            </motion.div>

            {/* ═══════════════════════════════════════
                TWEETS (Feedback)
            ═══════════════════════════════════════ */}
            <motion.div {...fadeUp(i++)} className="w-full max-w-[576px] flex flex-col gap-4">
              <p className="text-black">Tweets</p>
              <div className="h-px w-8 bg-[#e8e8e8] mb-2" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Tweet id="2060428797443473817" className="w-full" />
                <Tweet id="2059578920849342776" className="w-full" />
                <Tweet id="2053411484752052536" className="w-full" />
                <Tweet id="2056804349117186363" className="w-full" />
              </div>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
