import type { Metadata } from "next";
import HoverCards from "@/components/HoverCards";
import CopyEmail from "@/components/CopyEmail";
import Signature from "@/components/Signature";
import Panel from "@/components/Panel";
import CpuIcon from "@/components/CpuIcon";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a Design Engineer building modern web experiences.",
};

const EMAIL = "namansharmans03@gmail.com";
const TWITTER = "https://x.com/NamanSharma2112";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[560px] px-6 pt-5 pb-28">
      <Panel>
        <h1 className="text-[13.5px] font-medium text-zinc-900 dark:text-white">
          I&apos;m Naman Sharma.
        </h1>

        <div className="mt-6 flex flex-col gap-4 text-[13.5px] leading-[1.75] text-zinc-700 dark:text-zinc-300">
          <p>
            I&apos;m a Design Engineer who designs and builds whatever I can
            imagine or get inspiration from. Currently exploring modern web
            experiences and shipping projects that push creative boundaries.
          </p>

          <p>
            Currently working on passion projects and refining my craft with my
            go-to stack:{" "}
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
          </p>

          <p>
            I usually sketch out any design idea in my mind and try to replicate
            its structure on{" "}
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
          </p>

          <p>
            Open to design engineering roles and freelance collaborations. Reach
            out to me at <CopyEmail email={EMAIL} />
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white dark:bg-white dark:text-black transition-opacity hover:opacity-85"
          >
            email me
          </a>
          <a
            href={TWITTER}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black/10 px-4 py-2 text-[13px] font-medium text-zinc-900 transition-colors hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            dm me on X
          </a>
        </div>

        <SocialLinks className="mt-7 -ml-2" />

        <p className="mt-7 text-[13px] text-zinc-600 dark:text-zinc-500">
          Poke around the{" "}
          <a
            href="/desktop"
            className="group inline-flex items-center gap-1.5 align-middle text-zinc-900 dark:text-white"
          >
            <CpuIcon className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5" />
            <span className="underline underline-offset-[3px] decoration-zinc-400 transition-colors group-hover:decoration-zinc-900 dark:decoration-zinc-600 dark:group-hover:decoration-white">
              desktop
            </span>
          </a>
          .
        </p>

        {/* Signed off at the bottom. It draws itself in on load. */}
        <div className="mt-9 w-[140px] text-zinc-900/75 dark:text-white/75">
          <Signature className="h-auto w-full overflow-visible" />
        </div>
      </Panel>
    </main>
  );
}
