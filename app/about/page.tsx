import type { Metadata } from "next";
import AboutBackdrop from "@/components/AboutBackdrop";
import RainGlass from "@/components/RainGlass";
import CopyEmail from "@/components/CopyEmail";
import Signature from "@/components/Signature";

export const metadata: Metadata = {
  title: "About | Naman Sharma",
  description: "Learn more about Naman Sharma",
};

const EMAIL = "namansharmans03@gmail.com";

const ELSEWHERE = [
  { label: "twitter", href: "https://x.com/NamanSharma2112" },
  { label: "github", href: "https://github.com/NamanSharma2112" },
  { label: "linkedin", href: "https://www.linkedin.com/in/namansharma2112/" },
];

/**
 * The one page that looks unlike the rest: a photo behind glass with rain on
 * it, and the writing on a panel rather than straight on black. The type is
 * the same as everywhere else — same widths, sizes and weights — so it reads
 * as the same site in different weather.
 */
export default function AboutPage() {
  return (
    <>
      <AboutBackdrop />
      {/* Rain sits on the photo, under the panel, so the writing stays sharp.
          Hovering wipes the drops away and clears a patch of the glass. */}
      <RainGlass className="z-[1]" />

      <main className="relative z-10 mx-auto w-full max-w-[560px] px-6 pt-10 pb-28">
        <div className="rounded-2xl border border-white/10 bg-black/55 p-7 backdrop-blur-xl sm:p-9">
          <h1 className="text-[13.5px] font-medium text-white">About.</h1>

          <div className="mt-6 flex flex-col gap-4 text-[13.5px] leading-[1.75] text-zinc-300">
            <p>
              I&apos;m a Design Engineer who designs and builds whatever I can
              imagine or get inspiration from. Currently exploring modern web
              experiences and shipping projects that push creative boundaries.
            </p>

            <p>
              Currently working on passion projects and refining my craft with
              my go-to stack: React &amp; Next.js, TypeScript, Tailwind CSS,
              Motion.dev and Claude.
            </p>

            <p>
              I usually sketch out any design idea in my mind and try to
              replicate its structure on Excalidraw before I code it.
            </p>

            <p>
              Open to design engineering roles and freelance collaborations.
              Reach out to me at <CopyEmail email={EMAIL} />
            </p>
          </div>

          <div className="mt-8 flex items-baseline gap-4 text-[13px]">
            {ELSEWHERE.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="mt-9 w-[132px] text-white/70">
            <Signature className="h-auto w-full overflow-visible" />
          </div>
        </div>
      </main>
    </>
  );
}
