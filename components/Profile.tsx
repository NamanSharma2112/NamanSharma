"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Signature from "./Signature";
import HoverCards from "./HoverCards";
import HighlightList from "./HighlightList";
import CopyEmail from "./CopyEmail";
import { LogosCarousel } from "./LogosCarousel";
import { SpotifyCard } from "@/registry/spell-ui/spotify-card";
import { Tweet } from "@/registry/spell-ui/tweet";
import { ShimmerText } from "./shimmer-text";
import BunnyIcon from "./BunnyIcon";
import { SiX, SiGmail, SiGithub } from "@icons-pack/react-simple-icons";

function LinkedinIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}


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
  const [selectedTweetId, setSelectedTweetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState<string>("");

  // Dynamic clock in Jalandhar timezone (IST)
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fade out loader after signature animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2600); // 2.6s (allows signature to draw completely)
    return () => clearTimeout(timer);
  }, []);

  // Fade in entire wrapper after mount (matches kosta.fyi pattern)
  useEffect(() => {
    if (wrapperRef.current) {
      wrapperRef.current.style.opacity = "1";
    }
  }, []);

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedTweetId(null);
      }
    };

    if (selectedTweetId) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTweetId]);

  let i = 0; // stagger counter

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa]"
          >
            <div className="w-[160px] sm:w-[200px]">
              <Signature className="h-auto w-full text-black overflow-visible" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={wrapperRef}
        className="transition-opacity duration-500"
        style={{ opacity: 0 }}
      >
        <main className="flex min-h-screen w-full justify-center overflow-x-clip bg-[#fafafa] px-5 pt-12 pb-0 text-black sm:pt-[100px]">
        <div className="flex w-full flex-col items-center pb-0 text-[14px] leading-[20px] font-sans font-medium">
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
                  <ShimmerText>Design Engineer</ShimmerText>
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
                {[
                  "2060428797443473817",
                  "2059578920849342776",
                  "2053411484752052536",
                  "2056804349117186363",
                ].map((id) => (
                  <div
                    key={id}
                    onClick={() => setSelectedTweetId(id)}
                    className="relative cursor-pointer select-none active:scale-[0.98] transition-all duration-200 hover:scale-[1.015] hover:shadow-sm rounded-xl"
                  >
                    <div className="pointer-events-none w-full">
                      <Tweet id={id} size="small" className="w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ═══════════════════════════════════════
                FOOTER
            ═══════════════════════════════════════ */}
            <motion.footer
              {...fadeUp(i++)}
              className="w-full max-w-[576px] mt-16 pt-10 pb-16 border-t border-zinc-200/80 flex flex-col items-center gap-8"
            >
              {/* Bunny mascot */}
              <div className="flex flex-col items-center gap-2">
                <BunnyIcon size={56} className="text-zinc-400 hover:text-black transition-colors" />
                <div className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-mono tracking-wider">SAY HI!</span>
                  <span className="text-[11px] text-zinc-500 font-mono min-h-[16px]">
                    Jalandhar, India {time ? `— ${time}` : ""}
                  </span>
                </div>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-6 text-zinc-500 font-medium flex-wrap justify-center">
                <a
                  href="https://x.com/NamanSharma2112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors text-[13px] tracking-tight group"
                >
                  <SiX size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>Twitter / X</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/namansharmans03"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors text-[13px] tracking-tight group"
                >
                  <LinkedinIcon size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href="https://github.com/NamanSharma2112"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-black transition-colors text-[13px] tracking-tight group"
                >
                  <SiGithub size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>GitHub</span>
                </a>
                <a
                  href="mailto:namansharmans03@gmail.com"
                  className="flex items-center gap-2 hover:text-black transition-colors text-[13px] tracking-tight group"
                >
                  <SiGmail size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                  <span>Gmail</span>
                </a>
              </div>

              {/* Copyright */}
              <div className="w-full flex justify-between items-center text-[11px] text-zinc-400 font-mono pt-4 border-t border-zinc-100/50">
                <span>© {new Date().getFullYear()} NAMAN SHARMA</span>
                <span className="opacity-60">DESIGN ENGINEER</span>
              </div>
            </motion.footer>

          </div>
        </div>
      </main>

      {/* dialog overlay */}
      <AnimatePresence>
        {selectedTweetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-zoom-out"
              onClick={() => setSelectedTweetId(null)}
            />

            {/* Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative z-10 w-full max-w-[500px] mx-4 overflow-hidden rounded-xl bg-[#fafafa] border border-zinc-200 shadow-2xl p-4"
            >
              {/* Full interactive tweet (pointer-events allowed) */}
              <Tweet id={selectedTweetId} size="large" className="w-full border-none bg-transparent !p-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom white gradient overlay */}
      <div className="fixed bottom-0 left-0 right-0 h-[10vh] bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none z-40" />
    </div>
    </>
  );
}
