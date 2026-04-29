import { ReactNode } from "react";

const linkClass =
  "text-zinc-700 dark:text-zinc-300 underline decoration-zinc-300 dark:decoration-zinc-600 underline-offset-[3px] transition-colors duration-200 hover:text-black dark:hover:text-white hover:decoration-zinc-500 dark:hover:decoration-zinc-400";

export default function PortfolioBio({ paragraphs }: { paragraphs: ReactNode[] }) {
  return (
    <div className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_0.15s_backwards]">
      {paragraphs.map((paragraph, i) => (
        <p
          key={i}
          className="text-[15px] text-zinc-600 dark:text-zinc-400 mb-5 last:mb-0 leading-[1.75]"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export { linkClass };
