"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import RainGlass from "@/components/RainGlass";
import NeonCat from "@/components/NeonCat";

/**
 * The weather every page sits in: a photo behind glass with rain running on it.
 *
 * It reaches for a 4K file first and drops back to one of the existing
 * backdrops if that file is not there, so a full-resolution image can be added
 * later by dropping it in — no code change, and nothing breaks meanwhile.
 */

const PREFERRED = "/backdrops/about-4k.jpg";
const FALLBACK = "/backdrops/shibuya-rain.jpg";

export default function SiteAtmosphere() {
  const pathname = usePathname();
  const [src, setSrc] = useState(PREFERRED);

  // The photo stays dark whichever theme is on — only the sheets in front of
  // it change tone — so anything sitting directly on it stays light.

  // The desktop brings its own wallpaper and rain, and the blog stays a
  // plain black page to read on.
  if (pathname.startsWith("/desktop") || pathname.startsWith("/blog")) return null;

  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
        <Image
          src={src}
          alt=""
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
          onError={() => setSrc(FALLBACK)}
        />
        {/* Holds the photo back so the panels in front keep their contrast. */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Rain sits on the photo, under the content, so writing stays sharp. */}
      <RainGlass className="z-[1]" />

      <NeonCat
        size={150}
        className="pointer-events-none fixed bottom-8 left-8 z-[2] hidden lg:block"
      />
    </>
  );
}
