"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * The photo behind the about page.
 *
 * It reaches for a 4K file first and drops back to one of the existing
 * backdrops if that file is not there, so a full-resolution image can be added
 * later by dropping it in — no code change, and nothing breaks in the meantime.
 * The rest of the backdrops are around 700px wide and stretch about 2x to cover
 * a desktop, which is why this page wants its own.
 */

const PREFERRED = "/backdrops/about-4k.jpg";
const FALLBACK = "/backdrops/shibuya-rain.jpg";

export default function AboutBackdrop() {
  const [src, setSrc] = useState(PREFERRED);

  return (
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
      {/* Holds the photo back so the panel in front keeps its contrast. */}
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
