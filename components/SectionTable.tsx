import Link from "next/link";

export interface TableEntry {
  year: number;
  title: string;
  href?: string;
  date: string;
  badge?: string;
}

export default function SectionTable({
  title,
  entries,
}: {
  title: string;
  entries: TableEntry[];
}) {
  let lastYear: number | null = null;

  return (
    <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_backwards]">
      <h2 className="mb-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-normal text-zinc-400 dark:text-zinc-500 tracking-wide">
        {title}
      </h2>
      <div className="group/table">
        {entries.map((entry, i) => {
          const showYear = entry.year !== lastYear;
          lastYear = entry.year;
          const isExternal = entry.href?.startsWith("http");
          return (
            <div
              className="grid grid-cols-[56px_1fr_auto] items-baseline gap-x-6 py-2.5 text-[15px] transition-opacity duration-200 group-hover/table:opacity-40 hover:!opacity-100"
              key={`${entry.title}-${i}`}
            >
              <span className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums">
                {showYear ? entry.year : ""}
              </span>
              <span className="flex items-center gap-2">
                {entry.href ? (
                  isExternal ? (
                    <a
                      className="text-zinc-800 dark:text-zinc-200 no-underline transition-colors duration-200 hover:text-black dark:hover:text-white"
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    <Link
                      className="text-zinc-800 dark:text-zinc-200 no-underline transition-colors duration-200 hover:text-black dark:hover:text-white"
                      href={entry.href}
                    >
                      {entry.title}
                    </Link>
                  )
                ) : (
                  <span className="text-zinc-800 dark:text-zinc-200">{entry.title}</span>
                )}
                {entry.badge && (
                  <span className="inline-flex items-center justify-center text-[11px] font-medium px-2 py-px rounded-full border border-pink-200 dark:border-pink-500/30 text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 tracking-wide leading-relaxed">
                    {entry.badge}
                  </span>
                )}
              </span>
              <span className="text-sm text-zinc-400 dark:text-zinc-500 tabular-nums text-right">
                {entry.date}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

