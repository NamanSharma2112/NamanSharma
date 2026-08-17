"use client";

import { motion } from "motion/react";

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

export default function InspirationPage() {
  return (
    <div className="pt-5 pb-28">
      <div className="mx-auto max-w-[620px] rounded-2xl border border-black/10 bg-white/70 p-7 backdrop-blur-xl sm:p-9 dark:border-white/10 dark:bg-black/55">
        
        {/* Header Text */}
        <div className="mb-12 text-[15px] leading-[1.6] text-zinc-600 dark:text-zinc-400 flex flex-col gap-5">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            A list of all the people that I look up to, websites that I admire, tools that I use and everything else that follows.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            I will keep on updating this list as I find more inspiration.
          </motion.p>
        </div>

        {/* Inspiration List */}
        <ul className="flex flex-col">
          {INSPIRATIONS.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              // Emil: 30-80ms stagger delay for list items
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block outline-none -mx-4 px-4 py-3 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <motion.div
                    // Emil: button scale feedback
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center gap-4"
                  >
                    <Icon item={item} />
                    <Content item={item} />
                  </motion.div>
                </a>
              ) : (
                <div className="flex items-center gap-4 py-3 px-4 -mx-4">
                  <Icon item={item} />
                  <Content item={item} />
                </div>
              )}
            </motion.li>
          ))}
        </ul>

      </div>
    </div>
  );
}

function Icon({ item }: { item: any }) {
  return (
    <div className="relative w-10 h-10 shrink-0 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm flex items-center justify-center">
      <img 
        src={item.icon} 
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
      />
    </div>
  );
}

function Content({ item }: { item: any }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-[15px] font-medium text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors duration-300">
        {item.name}
      </span>
      <span className="text-[14px] text-zinc-500 dark:text-zinc-400 line-clamp-1 transition-colors duration-300">
        {item.desc}
      </span>
    </div>
  );
}
