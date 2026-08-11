import Image from "next/image";
import RainGlass from "@/components/RainGlass";

export const metadata = {
  title: "About | Naman Sharma",
  description: "Learn more about Naman Sharma",
};

/**
 * Swap this for any other file in `public/backdrops/`:
 * london-night, kyoto-alley, jdm-sunset, beach-blue-hour.
 *
 * A missing file falls back to the dark background below, so the page
 * degrades to bare rain rather than a broken image.
 */
const BACKGROUND = "/backdrops/shibuya-rain.jpg";

export default function AboutPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <Image
        src={BACKGROUND}
        alt=""
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover"
      />

      {/* Rain behind the glass, droplets on it, wiped clear by the cursor. */}
      <RainGlass />
    </main>
  );
}
