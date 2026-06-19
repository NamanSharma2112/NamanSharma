"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Signature from "./Signature";
import HoverCards from "./HoverCards";
import HighlightList from "./HighlightList";
import CopyEmail from "./CopyEmail";
import { LogosCarousel } from "./LogosCarousel";
import AnimatedCardDemo from "./AnimatedCardDemo";
import { TweetGrid } from "./TweetGrid";
import { SpotifyCard } from "@/registry/spell-ui/spotify-card";
import { Tweet } from "@/registry/spell-ui/tweet";
import { ShimmerText } from "./shimmer-text";
import BunnyIcon from "./BunnyIcon";
import { ThemeToggle } from "./ThemeToggle";
import { SiX, SiGmail, SiGithub } from "@icons-pack/react-simple-icons";
import { playTap, playToggle } from "@/lib/sounds";

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
    href: "https://www.motionlib.me/",
    external: true,
    cards: [
      {
        src: "/motionkit-preview.png",
        alt: "MotionKit Components",
        dx: 34,
        r: 11.9,
      },
      {
        src: "/isometric-studio.png",
        alt: "Isometric Studio",
        dx: -34,
        r: -6.58,
      },
    ],
  },
  {
    label: "ChurnRate",
    description: "SaaS Dashboard",
    href: "https://www.churnrate.fun/",
    external: true,
    cards: [
      {
        src: "/churnrate-analysis.png",
        alt: "ChurnRate Churn Analysis",
        dx: 34,
        r: 8.5,
      },
      {
        src: "/churnrate-dashboard.png",
        alt: "ChurnRate Analytics Dashboard",
        dx: -34,
        r: -10.2,
      },
    ],
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

  // Intro loading state (run only once per session)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited === "true") {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasVisited", "true");
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-[#1f1f23]"
          >
            <div className="w-[160px] sm:w-[200px]">
              <Signature className="h-auto w-full text-black dark:text-white overflow-visible" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed top-24 right-4 md:top-6 md:right-6 z-[60]">
        <ThemeToggle />
      </div>

      <div
        ref={wrapperRef}
        className="transition-opacity duration-500"
        style={{ opacity: 0 }}
      >
        <div className="fixed top-0 inset-x-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none z-[50] transition-colors duration-[800ms] dark:hidden" />
        <main className="flex min-h-screen w-full justify-center overflow-x-clip transition-colors duration-[800ms] ease-in-out">
        <div className="flex w-full max-w-3xl flex-col items-center border-x-[0.5px] px-5 pt-12 pb-6 sm:px-12 sm:pt-[100px] text-[14px] leading-[20px] font-sans font-medium shadow-sm transition-colors duration-[800ms] ease-in-out border-zinc-200/10 dark:border-zinc-800/10 bg-white/20 dark:bg-[#111110]/20 backdrop-blur-xl">
          <div className="flex w-full flex-col items-center gap-12 flex-1 justify-between">
            {/* ═══════════════════════════════════════
                HEADER
            ═══════════════════════════════════════ */}
            <header className="flex w-full max-w-[576px] items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <Signature />

                <motion.p {...fadeUp(i++)} className="text-black dark:text-white">
                  Naman Sharma
                </motion.p>

                <motion.div {...fadeUp(i++)} className="text-[#8d8d8d]">
                  <ShimmerText>Design Engineer</ShimmerText>
                </motion.div>
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
                      src: "https://api.microlink.io/?url=https://nextjs.org&screenshot=true&meta=false&embed=screenshot.url",
                      alt: "Next.js Homepage",
                      dx: 34,
                      r: 11.9,
                    },
                    {
                      src: "https://api.microlink.io/?url=https://react.dev&screenshot=true&meta=false&embed=screenshot.url",
                      alt: "React Homepage",
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
                      src: "https://api.microlink.io/?url=https://motion.dev&screenshot=true&meta=false&embed=screenshot.url",
                      alt: "Motion.dev Homepage",
                      dx: 34,
                      r: 8.5,
                    },
                    {
                      src: "https://api.microlink.io/?url=https://motion.dev/docs&screenshot=true&meta=false&embed=screenshot.url",
                      alt: "Motion.dev Docs",
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
                <HoverCards
                  label="Excalidraw"
                  cards={[
                    {
                      src: "https://api.microlink.io/?url=https://excalidraw.com&screenshot=true&meta=false&embed=screenshot.url",
                      alt: "Excalidraw Homepage",
                      dx: 34,
                      r: 9.5,
                    },
                    {
                      src: "https://api.microlink.io/?url=https://plus.excalidraw.com&screenshot=true&meta=false&embed=screenshot.url",
                      alt: "Excalidraw Plus",
                      dx: -34,
                      r: -7.2,
                    },
                  ]}
                />{" "}
                before I code it.
              </motion.p>

              <p aria-hidden="true">&nbsp;</p>

              <motion.p {...fadeUp(i++)}>
                Open to design engineering roles and freelance collaborations.
                Reach out to me via{" "}
                <CopyEmail email="namansharmans03@gmail.com" /> or DM me on{" "}
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
            <motion.div {...fadeUp(i++)} className="w-full max-w-[576px] py-6 flex justify-center">
              <AnimatedCardDemo />
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
              <p className="font-medium text-zinc-900 dark:text-zinc-100">Tweets</p>
              <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800 mb-2" />
              <div className="w-full flex justify-center mt-2">
                <TweetGrid
                  tweets={[
                    "2060428797443473817",
                    "2059578920849342776",
                    "2053411484752052536",
                    "2056804349117186363",
                  ]}
                  onSelect={(id) => { 
                    setSelectedTweetId(id); 
                    playTap(); 
                  }} 
                />
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
              <div className="w-full flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-500 font-mono pt-4 border-t border-zinc-100/50 dark:border-zinc-800 mt-auto">
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
              onClick={() => { setSelectedTweetId(null); playTap(); }}
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

      {/* Dynamic styles & animations */}
      <style>{`
        /* ── Image hover spring effect (all images) ── */
        img {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
        }
        img:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.08);
        }
        /* Keep profile avatars subtle — no scale jump on tiny rounded pics */
        img.rounded-full:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
    </>
  );
}
