"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type TOCItem = {
  id: string;
  heading: string;
};

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -80% 0px", // Trigger when heading is near the top
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-32 flex flex-col gap-8 w-48 shrink-0 hidden md:flex">
      <Link 
        href="/blog" 
        className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </Link>

      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`text-[13px] transition-colors duration-200 block ${
                activeId === item.id
                  ? "text-zinc-900 font-medium translate-x-1"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              style={{
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {item.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
