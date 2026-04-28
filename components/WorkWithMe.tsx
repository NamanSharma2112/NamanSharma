"use client";

interface WorkItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

function WorkCard({ icon, title, description, href }: WorkItem) {
  const Tag = href ? "a" : "div";
  const linkProps = href
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Tag
      {...linkProps}
      className="flex items-center gap-4 py-4 group cursor-pointer transition-opacity duration-200 no-underline"
    >
      {/* Icon container */}
      <div className="shrink-0">{icon}</div>

      {/* Text */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[15px] font-medium text-zinc-800 group-hover:text-black transition-colors duration-200">
          {title}
        </span>
        <span className="text-zinc-300 text-sm">·</span>
        <span className="text-[14px] text-zinc-500">{description}</span>
      </div>
    </Tag>
  );
}

// Rounded gradient icon boxes
function ConsultIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    </div>
  );
}

function HireIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    </div>
  );
}

const ITEMS: WorkItem[] = [
  {
    icon: <ConsultIcon />,
    title: "Consultation",
    description: "Get on a paid call with me to discuss your things.",
  },
  {
    icon: <HireIcon />,
    title: "Hire me",
    description: "Let's build a world class website for your business.",
  },
];

export default function WorkWithMe() {
  return (
    <section className="mb-14 animate-[fadeUp_0.7s_cubic-bezier(0.22,1,0.36,1)_backwards]">
      <h2 className="mb-5 pb-4 border-b border-zinc-200 text-[13px] font-normal text-zinc-400 tracking-widest uppercase">
        Work with me
      </h2>
      <div className="divide-y divide-zinc-100">
        {ITEMS.map((item) => (
          <WorkCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
