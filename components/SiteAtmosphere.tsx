"use client";

import { usePathname } from "next/navigation";
import HomeBackdrop from "@/components/HomeBackdrop";
import RainGlass from "@/components/RainGlass";
import NeonCat from "@/components/NeonCat";
import NeonTorii from "@/components/NeonTorii";

/**
 * The weather every page sits in: photos behind glass with rain running on it.
 *
 * The list leads with a 4K file that is not in the repo yet — if it is dropped
 * in it becomes the opening frame, and until then it simply falls out of the
 * rotation, so the backdrop still cycles either way.
 */

const BACKDROPS = [
  "/backdrops/about-4k.jpg",
  "/backdrops/shibuya-rain.jpg",
  "/backdrops/kyoto-alley.jpg",
  "/backdrops/london-night.jpg",
  "/backdrops/jdm-sunset.jpg",
  "/backdrops/beach-blue-hour.jpg",
];

export default function SiteAtmosphere() {
  const pathname = usePathname();

  // The photo stays dark whichever theme is on — only the sheets in front of
  // it change tone — so anything sitting directly on it stays light.

  // The desktop brings its own wallpaper and rain, and the blog stays a
  // plain black page to read on.
  if (pathname.startsWith("/desktop") || pathname.startsWith("/blog")) return null;

  return (
    <>
      <HomeBackdrop
        sources={BACKDROPS}
        scrimClassName="bg-black/60"
        className="bg-[#0a0a0a]"
      />

      {/* Rain sits on the photo, under the content, so writing stays sharp. */}
      <RainGlass className="z-[1]" />

      <NeonCat
        size={150}
        className="pointer-events-none fixed bottom-8 left-8 z-[2] hidden lg:block"
      />

      <NeonTorii
        size={140}
        className="pointer-events-none fixed right-10 top-[30%] z-[2] hidden lg:block"
      />
    </>
  );
}
