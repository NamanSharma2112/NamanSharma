"use client";

import { motion } from "motion/react";
import Panel from "@/components/Panel";
import PageHeader from "@/components/PageHeader";
import SiteFooter from "@/components/SiteFooter";

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

/** Derived from the list itself, so the two cannot drift apart. */
type Inspiration = (typeof INSPIRATIONS)[number];

export default function InspirationPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-[640px] px-6 pt-8">
        <PageHeader kicker="Inspiration" title="People I look up to">
          The people, sites and tools I admire and learn from. I keep adding to
          this as I find more.
        </PageHeader>

        <Panel>
          <ul className="flex flex-col">
            {INSPIRATIONS.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                // 30–80ms stagger, ships with the reveal.
                transition={{ delay: 0.06 + i * 0.055, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group -mx-3 block rounded-xl px-3 py-3 outline-none transition-colors hover:bg-black/[0.04] focus-visible:bg-black/[0.04] dark:hover:bg-white/[0.05] dark:focus-visible:bg-white/[0.05]"
                >
                  <motion.div
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center gap-4"
                  >
                    <Favicon item={item} />
                    <Content item={item} />
                  </motion.div>
                </a>
              </motion.li>
            ))}
          </ul>
        </Panel>
      </main>
      <SiteFooter />
    </>
  );
}

function Favicon({ item }: { item: Inspiration }) {
  return (
    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <img
        src={item.icon}
        alt=""
        className="size-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
      />
    </div>
  );
}

function Content({ item }: { item: Inspiration }) {
  return (
    <div className="flex min-w-0 flex-col justify-center">
      <span className="text-[14.5px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        {item.name}
      </span>
      <span className="line-clamp-1 text-[13.5px] text-zinc-500 dark:text-zinc-400">
        {item.desc}
      </span>
    </div>
  );
}
