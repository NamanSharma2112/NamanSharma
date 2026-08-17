import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";

/**
 * Social links whose icons roll on hover: the mark slides up out of a window
 * while an identical one arrives from below to take its place.
 *
 * Two stacked copies inside a box the height of one, moved by exactly that
 * height — so the swap lands perfectly aligned however long the travel takes.
 */

const SIZE = 16;

function LinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4v11H3zM10 9.5h3.8v1.5h.06a4.2 4.2 0 0 1 3.77-2c4.03 0 4.77 2.65 4.77 6.1v5.4h-4v-4.8c0-1.15-.02-2.62-1.6-2.62-1.6 0-1.85 1.25-1.85 2.54v4.88H10z" />
    </svg>
  );
}

function Mail({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="m3.9 7.2 7.2 5.3a1.5 1.5 0 0 0 1.8 0l7.2-5.3" />
    </svg>
  );
}

const LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/NamanSharma2112",
    Icon: SiGithub,
  },
  { label: "X", href: "https://x.com/NamanSharma2112", Icon: SiX },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/namansharma2112/",
    Icon: LinkedIn,
  },
  { label: "Email", href: "mailto:namansharmans03@gmail.com", Icon: Mail },
];

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {LINKS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          title={label}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="group flex size-9 items-center justify-center rounded-full text-zinc-500 transition-colors duration-200 hover:bg-black/5 hover:text-zinc-900 dark:hover:bg-white/10 dark:hover:text-white"
        >
          {/* A window exactly one icon tall, so only one is ever in view. */}
          <span
            className="block overflow-hidden"
            style={{ height: SIZE, width: SIZE }}
          >
            <span className="icon-roll block">
              <Icon className="block" style={{ width: SIZE, height: SIZE }} />
              <Icon className="block" style={{ width: SIZE, height: SIZE }} />
            </span>
          </span>
        </a>
      ))}
    </div>
  );
}
