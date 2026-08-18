"use client";

import Link from "next/link";
import { ComputerIcon, FolderIcon } from "../icons";

/**
 * "Computer" — the properties panel, standing in as the about box, with the
 * way back out to the actual site.
 */

const SPECS: [string, string][] = [
  ["Edition", "Naman Sharma · Portfolio Edition"],
  ["Processor", "Design Engineer @ 3.40GHz"],
  ["Installed memory", "4.00 GB (3.87 GB usable)"],
  ["System type", "64-bit Operating System"],
  ["Stack", "React · Next.js · TypeScript · Tailwind · Motion"],
];

const DRIVES = [
  { name: "Local Disk (C:)", used: 0.62, size: "512 GB" },
  { name: "Projects (D:)", used: 0.34, size: "1 TB" },
];

const LINKS = [
  { label: "Back to the site", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/blog" },
  { label: "GitHub", href: "https://github.com/NamanSharma2112", external: true },
];

export default function Computer() {
  return (
    <div className="h-full overflow-auto bg-white">
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{ background: "linear-gradient(to bottom, #eaf3fb, #dbe9f6)" }}
      >
        <ComputerIcon size={38} />
        <div>
          <p className="text-[13px] font-semibold text-[#123a5e]">
            View basic information about your computer
          </p>
          <p className="text-[11px] text-[#4a6076]">Windows 7 · Portfolio Edition</p>
        </div>
      </div>

      <div className="px-4 py-3">
        <h3 className="mb-2 text-[12px] font-semibold text-[#15507f]">System</h3>
        <dl className="grid grid-cols-[130px_1fr] gap-y-1.5 text-[11.5px]">
          {SPECS.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-[#5a6b7a]">{label}:</dt>
              <dd className="text-[#16202b]">{value}</dd>
            </div>
          ))}
        </dl>

        <h3 className="mb-2 mt-5 text-[12px] font-semibold text-[#15507f]">
          Hard disk drives
        </h3>
        <div className="flex flex-col gap-2.5">
          {DRIVES.map((drive) => (
            <div key={drive.name} className="flex items-center gap-3">
              <FolderIcon size={26} />
              <div className="min-w-0 flex-1">
                <p className="text-[11.5px] text-[#16202b]">{drive.name}</p>
                <div
                  className="mt-1 h-3 w-full overflow-hidden rounded-[2px]"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3)", background: "#eef2f6" }}
                >
                  <span
                    className="block h-full"
                    style={{
                      width: `${drive.used * 100}%`,
                      background:
                        drive.used > 0.85
                          ? "linear-gradient(to bottom,#ff8a80,#d32f2f)"
                          : "linear-gradient(to bottom,#8fd6ff,#2f8fd0)",
                    }}
                  />
                </div>
              </div>
              <span className="shrink-0 text-[11px] text-[#5a6b7a]">{drive.size}</span>
            </div>
          ))}
        </div>

        <h3 className="mb-2 mt-5 text-[12px] font-semibold text-[#15507f]">
          Network locations
        </h3>
        <div className="flex flex-wrap gap-2">
          {LINKS.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w7-btn px-3 py-1.5 text-[11.5px] text-[#16202b]"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="w7-btn px-3 py-1.5 text-[11.5px] text-[#16202b]"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
