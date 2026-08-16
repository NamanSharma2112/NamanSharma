"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DesktopWindow from "@/components/DesktopWindow";
import DesktopDock from "@/components/DesktopDock";
import type { DockApp } from "@/components/DesktopDock";
import HomeBackdrop from "@/components/HomeBackdrop";
import RainGlass from "@/components/RainGlass";
import DeskAccents from "@/components/DeskAccents";
import Signature from "@/components/Signature";
import HoverCards from "@/components/HoverCards";
import HighlightList from "@/components/HighlightList";
import CopyEmail from "@/components/CopyEmail";
import DesktopIcon from "@/components/DesktopIcon";
import DesktopBlogPost from "@/components/DesktopBlogPost";
import { DesktopMenuBar } from "@/components/DesktopMenuBar";

import { TweetGrid } from "@/components/TweetGrid";
import { Tweet } from "@/registry/spell-ui/tweet";
import { ShimmerText } from "@/components/shimmer-text";
import BunnyIcon from "@/components/BunnyIcon";

import { SiX, SiGmail, SiGithub } from "@icons-pack/react-simple-icons";
import { playTap } from "@/lib/sounds";
import { ALL_POSTS } from "@/lib/blog-data";

function LinkedinIcon({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const PROJECTS = [
  {
    label: "MotionKit",
    description: "Animation Library",
    href: "https://www.motionlib.me/",
    external: true,
    cards: [
      { src: "/motionkit-preview.png", alt: "MotionKit Components", dx: 34, r: 11.9 },
      { src: "/isometric-studio.png", alt: "Isometric Studio", dx: -34, r: -6.58 },
    ],
  },
  {
    label: "ChurnRate",
    description: "SaaS Dashboard",
    href: "https://www.churnrate.fun/",
    external: true,
    cards: [
      { src: "/churnrate-analysis.png", alt: "ChurnRate Churn Analysis", dx: 34, r: 8.5 },
      { src: "/churnrate-dashboard.png", alt: "ChurnRate Analytics Dashboard", dx: -34, r: -10.2 },
    ],
  },
  {
    label: "Task Management App",
    description: "Productivity Tool",
    href: "https://taskmangementapplication-production.up.railway.app",
    external: true,
    cards: [
      { src: "https://api.microlink.io/?url=https://taskmangementapplication-production.up.railway.app&screenshot=true&meta=false&embed=screenshot.url", alt: "Task Management Application Preview", dx: 34, r: 9.5 },
      { src: "https://api.microlink.io/?url=https://taskmangementapplication-production.up.railway.app&screenshot=true&meta=false&embed=screenshot.url", alt: "Task Management Application", dx: -34, r: -7.2 },
    ],
  },
];

const INSPIRATIONS = [
  {
    name: "Rauno",
    desc: "God level design engineer",
    url: "https://rauno.me/",
    icon: "https://www.google.com/s2/favicons?domain=rauno.me&sz=256",
  },
  {
    name: "Emil Kowalski",
    desc: "Incredible design engineer and creator of Animations.dev",
    url: "https://emilkowal.ski/",
    icon: "https://www.google.com/s2/favicons?domain=emilkowal.ski&sz=256",
  },
  {
    name: "Animations.dev",
    desc: "The best place to learn Framer Motion",
    url: "https://animations.dev/",
    icon: "https://www.google.com/s2/favicons?domain=animations.dev&sz=256",
  },
  {
    name: "Yui540",
    desc: "Creative frontend developer with amazing interactive works",
    url: "https://yui540.com/",
    icon: "https://www.google.com/s2/favicons?domain=yui540.com&sz=256",
  },
  {
    name: "Manu Arora",
    desc: "Creator of Aceternity UI and amazing developer",
    url: "https://manuarora.in/",
    icon: "https://www.google.com/s2/favicons?domain=manuarora.in&sz=256",
  },
  {
    name: "Josh W Comeau",
    desc: "Phenomenal educator and CSS wizard",
    url: "https://www.joshwcomeau.com/",
    icon: "https://www.google.com/s2/favicons?domain=joshwcomeau.com&sz=256",
  },
];

/* ── macOS-style app tiles ── */
/**
 * A dock icon the way macOS draws one: a saturated gradient squircle with a
 * white glyph, a sheen across the top and a soft contact shadow. A translucent
 * tint over a photo wallpaper washes out instead of reading as an app.
 */
const IconWrapper = ({
  gradient,
  children,
}: {
  gradient: string;
  children: React.ReactNode;
}) => (
  <div
    className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[23%] ring-1 ring-black/15 shadow-[0_6px_14px_-4px_rgba(0,0,0,0.5)] ${gradient}`}
  >
    <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
    <span className="relative z-10 drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.28)]">
      {children}
    </span>
  </div>
);

/** Shared glyph geometry, so every icon carries the same weight. */
const glyphProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Contacts blue.
const UserIcon = () => (
  <IconWrapper gradient="bg-gradient-to-b from-[#7dd3fc] to-[#2563eb] text-white">
    <svg width="26" height="26" viewBox="0 0 24 24" {...glyphProps}>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M19 20a7 7 0 0 0-14 0" />
    </svg>
  </IconWrapper>
);

// Notes yellow — a dark glyph, since white on yellow barely reads.
const PenIcon = () => (
  <IconWrapper gradient="bg-gradient-to-b from-[#ffe27a] to-[#f0a92b] text-amber-950">
    <svg width="25" height="25" viewBox="0 0 24 24" {...glyphProps}>
      <path d="M6 3.5h12a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z" />
      <path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
    </svg>
  </IconWrapper>
);

// Inspiration — a spark rather than a heart.
const HeartIcon = () => (
  <IconWrapper gradient="bg-gradient-to-b from-[#ff9db3] to-[#e6486f] text-white">
    <svg width="26" height="26" viewBox="0 0 24 24" {...glyphProps}>
      <path d="M12 3.2l1.95 4.65L18.6 9.8l-4.65 1.95L12 16.4l-1.95-4.65L5.4 9.8l4.65-1.95z" />
      <path d="M18.2 15.4l.72 1.78 1.78.72-1.78.72-.72 1.78-.72-1.78-1.78-.72 1.78-.72z" />
    </svg>
  </IconWrapper>
);

// Messages green.
const MessageIcon = () => (
  <IconWrapper gradient="bg-gradient-to-b from-[#7ceb9f] to-[#12a150] text-white">
    <svg width="26" height="26" viewBox="0 0 24 24" {...glyphProps}>
      <path d="M20 11.4c0 3.9-3.6 7-8 7a9 9 0 0 1-2.2-.27L5 20l1.2-3.3A6.7 6.7 0 0 1 4 11.4c0-3.9 3.6-7 8-7s8 3.1 8 7z" />
    </svg>
  </IconWrapper>
);

// Mail blue.
const MailIcon = () => (
  <IconWrapper gradient="bg-gradient-to-b from-[#7fd0ff] to-[#1a72e8] text-white">
    <svg width="25" height="25" viewBox="0 0 24 24" {...glyphProps}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="m3.9 7.2 7.2 5.3a1.5 1.5 0 0 0 1.8 0l7.2-5.3" />
    </svg>
  </IconWrapper>
);

export default function DesktopHome() {
  // Window open/close state
  const [openWindows, setOpenWindows] = useState<Record<string, boolean>>({
    about: true,
    projects: false,
    tweets: false,
    blog: false,
    inspiration: false,
    contact: false,
    blogPost: false,
  });

  const [activeBlogPost, setActiveBlogPost] = useState<string | null>(null);

  // Z-index management (last focused window goes to top)
  const [zIndices, setZIndices] = useState<Record<string, number>>({
    about: 10,
    projects: 11,
    tweets: 12,
    blog: 13,
    inspiration: 14,
    contact: 15,
    blogPost: 16,
  });
  const [topZ, setTopZ] = useState(16);

  const [selectedTweetId, setSelectedTweetId] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Clock
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

  // Fade in wrapper
  useEffect(() => {
    if (wrapperRef.current) wrapperRef.current.style.opacity = "1";
  }, []);

  // Escape to close tweet modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTweetId(null);
    };
    if (selectedTweetId) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTweetId]);

  const focusWindow = (id: string) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setZIndices((zMap) => ({ ...zMap, [id]: nextZ }));
      return nextZ;
    });
  };

  const toggle = (id: string) => {
    setOpenWindows((prev) => {
      const isOpen = !prev[id];
      if (isOpen) focusWindow(id); // bring to front when opening
      return { ...prev, [id]: isOpen };
    });
  };

  // Menu-bar actions. `open` differs from `toggle`: picking something from a
  // menu should bring it forward, never dismiss it.
  const openWindow = (id: string) => {
    setOpenWindows((prev) => ({ ...prev, [id]: true }));
    focusWindow(id);
  };

  const closeAllWindows = () =>
    setOpenWindows((prev) =>
      Object.fromEntries(Object.keys(prev).map((k) => [k, false]))
    );

  const dockApps: DockApp[] = [
    { id: "about", label: "About Me", icon: <UserIcon />, isOpen: openWindows.about },
    { id: "blog", label: "Writing", icon: <PenIcon />, isOpen: openWindows.blog },
    { id: "inspiration", label: "Inspiration", icon: <HeartIcon />, isOpen: openWindows.inspiration },
    { id: "tweets", label: "Feedback", icon: <MessageIcon />, isOpen: openWindows.tweets },
    { id: "contact", label: "Contact", icon: <MailIcon />, isOpen: openWindows.contact },
  ];

  return (
    <>
      <DesktopMenuBar
        windows={openWindows}
        onToggleWindow={toggle}
        onOpenWindow={openWindow}
        onCloseAll={closeAllWindows}
      />

      {/* Wallpaper */}
      <HomeBackdrop />
      <RainGlass className="z-[1]" intensity={0.85} glass={false} />
      <DeskAccents />



      {/* Windows area */}
      <div
        ref={wrapperRef}
        className="fixed inset-0 z-10 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 overflow-hidden">
          {/* Desktop Icons */}
          {PROJECTS.map((project, i) => (
            <DesktopIcon
              key={project.label}
              id={`icon-${project.label}`}
              label={project.label}
              icon={
                <svg width="46" height="46" viewBox="0 0 24 24" fill="#8cb8ff" stroke="#3a80df" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" fillOpacity="0.8"/>
                </svg>
              }
              defaultPosition={{ x: 20, y: 40 + i * 100 }}
              constraintsRef={wrapperRef}
              onDoubleClick={() => window.open(project.href, "_blank")}
            />
          ))}

          <AnimatePresence mode="popLayout">
            {/* ═══════ ABOUT ME WINDOW ═══════ */}
            {openWindows.about && (
              <DesktopWindow
                key="about"
                id="about"
                title="About Me"
                onClose={() => toggle("about")}
                onFocus={() => focusWindow("about")}
                zIndex={zIndices.about}
                defaultPosition={{ x: 0, y: 0 }}
                constraintsRef={wrapperRef}
                className="pointer-events-auto shadow-2xl"
              >
                <div className="px-5 pt-4 pb-6 sm:px-8 text-[15px] leading-[1.6] font-sans text-zinc-600 dark:text-zinc-400">
                  <div className="flex flex-col gap-8">
                    <header className="flex w-full items-start justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <Signature />
                        <p className="text-zinc-900 dark:text-zinc-100 font-medium">Naman Sharma</p>
                        <ShimmerText>Design Engineer</ShimmerText>
                      </div>
                    </header>
                    <div className="flex flex-col gap-6 break-words">
                      <p>I&apos;m a Design Engineer who designs and builds whatever I can imagine or get inspiration from. Currently exploring modern web experiences and shipping projects that push creative boundaries.</p>
                      <p>Currently working on passion projects and refining my craft with my go-to stack: <HoverCards label="React & Next.js" cards={[{ src: "https://api.microlink.io/?url=https://nextjs.org&screenshot=true&meta=false&embed=screenshot.url", alt: "Next.js Homepage", dx: 34, r: 11.9 }, { src: "https://api.microlink.io/?url=https://react.dev&screenshot=true&meta=false&embed=screenshot.url", alt: "React Homepage", dx: -34, r: -6.58 }]} />, TypeScript, Tailwind CSS, <HoverCards label="Motion.dev" cards={[{ src: "https://api.microlink.io/?url=https://motion.dev&screenshot=true&meta=false&embed=screenshot.url", alt: "Motion.dev Homepage", dx: 34, r: 8.5 }, { src: "https://api.microlink.io/?url=https://motion.dev/docs&screenshot=true&meta=false&embed=screenshot.url", alt: "Motion.dev Docs", dx: -34, r: -10.2 }]} /> and Claude.</p>
                      <p>I usually sketch out any design idea in my mind and try to replicate its structure on <HoverCards label="Excalidraw" cards={[{ src: "https://api.microlink.io/?url=https://excalidraw.com&screenshot=true&meta=false&embed=screenshot.url", alt: "Excalidraw Homepage", dx: 34, r: 9.5 }, { src: "https://api.microlink.io/?url=https://plus.excalidraw.com&screenshot=true&meta=false&embed=screenshot.url", alt: "Excalidraw Plus", dx: -34, r: -7.2 }]} /> before I code it.</p>
                      <p>Open to design engineering roles and freelance collaborations. Reach out to me via <CopyEmail email="namansharmans03@gmail.com" /> or DM me on <a href="https://x.com/NamanSharma2112" target="_blank" rel="noopener noreferrer" className="text-zinc-900 dark:text-zinc-100 underline underline-offset-[3px] decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-100 transition-colors duration-200">Twitter</a>.</p>
                    </div>
                  </div>
                </div>
              </DesktopWindow>
            )}



            {/* ═══════ BLOG WINDOW ═══════ */}
            {openWindows.blog && (
              <DesktopWindow
                key="blog"
                id="blog"
                title="Writing"
                onClose={() => toggle("blog")}
                onFocus={() => focusWindow("blog")}
                zIndex={zIndices.blog}
                defaultPosition={{ x: 50, y: -20 }}
                constraintsRef={wrapperRef}
                className="pointer-events-auto shadow-2xl"
              >
                <div className="px-5 pt-4 pb-6 sm:px-8 text-[15px] leading-[1.6] font-sans text-zinc-600 dark:text-zinc-400">
                  <div className="mb-8">
                    <p className="text-[15px] text-zinc-500 dark:text-zinc-400">Thoughts on design engineering, micro-interactions, and building interfaces that feel alive.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {ALL_POSTS.map((post) => (
                      <button 
                        key={post.slug} 
                        onClick={() => {
                          setActiveBlogPost(post.slug);
                          setOpenWindows(prev => ({ ...prev, blogPost: true }));
                          focusWindow("blogPost");
                        }}
                        className="block w-full text-left outline-none group"
                      >
                        <motion.article
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                          className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 p-4 -mx-4 rounded-xl transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <p className="text-[13px] font-medium shrink-0 sm:w-24 text-zinc-500 dark:text-zinc-400">{post.date}</p>
                          <div className="flex-1 flex items-center justify-between gap-4">
                            <div>
                              <h2 className="text-[16px] font-medium tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">{post.title}</h2>
                              <p className="text-[14px] leading-relaxed line-clamp-1 text-zinc-500 dark:text-zinc-400">{post.content[0].paragraphs[0]}</p>
                            </div>
                            <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 ease-out text-zinc-900 dark:text-zinc-100">
                              <ArrowRight size={16} />
                            </div>
                          </div>
                        </motion.article>
                      </button>
                    ))}
                  </div>
                </div>
              </DesktopWindow>
            )}

            {/* ═══════ BLOG POST WINDOW (Dynamic) ═══════ */}
            {openWindows.blogPost && activeBlogPost && (
              <DesktopWindow
                key={`blog-post-${activeBlogPost}`}
                id="blog-post"
                title="Reader"
                onClose={() => toggle("blogPost")}
                onFocus={() => focusWindow("blogPost")}
                zIndex={zIndices.blogPost}
                defaultPosition={{ x: 100, y: 40 }}
                constraintsRef={wrapperRef}
                className="pointer-events-auto shadow-2xl"
              >
                <div className="h-full overflow-y-auto px-5 pt-4 pb-12 sm:px-8 text-[15px] leading-[1.6] font-sans text-zinc-600 dark:text-zinc-400">
                  <DesktopBlogPost slug={activeBlogPost} />
                </div>
              </DesktopWindow>
            )}

            {/* ═══════ INSPIRATION WINDOW ═══════ */}
            {openWindows.inspiration && (
              <DesktopWindow
                key="inspiration"
                id="inspiration"
                title="Inspiration"
                onClose={() => toggle("inspiration")}
                onFocus={() => focusWindow("inspiration")}
                zIndex={zIndices.inspiration}
                defaultPosition={{ x: -50, y: 30 }}
                constraintsRef={wrapperRef}
                className="pointer-events-auto shadow-2xl"
              >
                <div className="px-5 pt-4 pb-6 sm:px-8 text-[15px] leading-[1.6] font-sans text-zinc-600 dark:text-zinc-400">
                  <div className="mb-8 flex flex-col gap-3">
                    <p>A list of all the people that I look up to, websites that I admire, tools that I use and everything else that follows.</p>
                  </div>
                  <ul className="flex flex-col">
                    {INSPIRATIONS.map((item, i) => (
                      <li key={i}>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block outline-none -mx-4 px-4 py-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                            <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }} className="flex items-center gap-4">
                              <div className="relative w-10 h-10 shrink-0 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm flex items-center justify-center">
                                <img src={item.icon} alt={item.name} className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-110" />
                              </div>
                              <div className="flex flex-col justify-center">
                                <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight">{item.name}</span>
                                <span className="text-[14px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{item.desc}</span>
                              </div>
                            </motion.div>
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </DesktopWindow>
            )}

            {/* ═══════ TWEETS WINDOW ═══════ */}
            {openWindows.tweets && (
              <DesktopWindow
                key="tweets"
                id="tweets"
                title="Feedback"
                onClose={() => toggle("tweets")}
                onFocus={() => focusWindow("tweets")}
                zIndex={zIndices.tweets}
                defaultPosition={{ x: 200, y: -80 }}
                constraintsRef={wrapperRef}
                className="pointer-events-auto shadow-2xl"
              >
                <div className="px-5 pt-4 pb-6 sm:px-8 text-[15px] leading-[1.6] font-sans text-zinc-600 dark:text-zinc-400">
                  <div className="w-full flex justify-center mt-2">
                    <TweetGrid
                      tweets={["2060428797443473817", "2059578920849342776", "2053411484752052536", "2056804349117186363"]}
                      onSelect={(id) => { setSelectedTweetId(id); playTap(); }}
                    />
                  </div>
                </div>
              </DesktopWindow>
            )}

            {/* ═══════ CONTACT WINDOW ═══════ */}
            {openWindows.contact && (
              <DesktopWindow
                key="contact"
                id="contact"
                title="Contact"
                onClose={() => toggle("contact")}
                onFocus={() => focusWindow("contact")}
                zIndex={zIndices.contact}
                defaultPosition={{ x: 0, y: 150 }}
                constraintsRef={wrapperRef}
                className="pointer-events-auto shadow-2xl"
              >
                <div className="px-5 pt-6 pb-8 sm:px-8 text-[15px] leading-[1.6] font-sans text-zinc-600 dark:text-zinc-400">
                  <div className="flex flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <BunnyIcon size={56} className="text-zinc-300 dark:text-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-300" />
                      <div className="flex flex-col items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-zinc-400 font-mono tracking-wider">SAY HI!</span>
                        <span className="text-[11px] text-zinc-500 font-mono min-h-[16px]">Jalandhar, India {time ? `— ${time}` : ""}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-zinc-500 font-medium flex-wrap justify-center">
                      <motion.a whileTap={{ scale: 0.97 }} transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.16 }} href="https://x.com/NamanSharma2112" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[13.5px] tracking-tight group"><SiX size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" /><span>Twitter / X</span></motion.a>
                      <motion.a whileTap={{ scale: 0.97 }} transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.16 }} href="https://www.linkedin.com/in/namansharmans03" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[13.5px] tracking-tight group"><LinkedinIcon size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" /><span>LinkedIn</span></motion.a>
                      <motion.a whileTap={{ scale: 0.97 }} transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.16 }} href="https://github.com/NamanSharma2112" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[13.5px] tracking-tight group"><SiGithub size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" /><span>GitHub</span></motion.a>
                      <motion.a whileTap={{ scale: 0.97 }} transition={{ ease: [0.23, 1, 0.32, 1], duration: 0.16 }} href="mailto:namansharmans03@gmail.com" className="flex items-center gap-2 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-[13.5px] tracking-tight group"><SiGmail size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" /><span>Gmail</span></motion.a>
                    </div>
                    <div className="w-full flex justify-between items-center text-[11px] text-zinc-400 dark:text-zinc-600 font-mono pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                      <span>© {new Date().getFullYear()} NAMAN SHARMA</span>
                      <span className="opacity-60">DESIGN ENGINEER</span>
                    </div>
                  </div>
                </div>
              </DesktopWindow>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dock */}
      <DesktopDock apps={dockApps} onToggle={toggle} />

      {/* Tweet dialog overlay */}
      <AnimatePresence>
        {selectedTweetId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-zoom-out"
              onClick={() => { setSelectedTweetId(null); playTap(); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
              className="relative w-full max-w-[500px] mx-4 overflow-hidden rounded-xl bg-[#fafafa] border border-zinc-200 shadow-2xl p-4"
            >
              <Tweet id={selectedTweetId} size="large" className="w-full border-none bg-transparent !p-0" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
