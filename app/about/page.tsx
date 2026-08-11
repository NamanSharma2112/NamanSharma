import Image from "next/image";
import RainGlass from "@/components/RainGlass";

export const metadata = {
  title: "About | Naman Sharma",
  description: "Learn more about Naman Sharma",
};

/**
 * Swap this for whichever shot you want behind the rain. Anything dropped in
 * `public/` works — until the file exists the page falls back to the dark
 * background below, so it degrades to bare rain rather than a broken image.
 */
const BACKGROUND = "/about-bg.jpg";

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
