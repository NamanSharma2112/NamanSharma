import Profile from "@/components/Profile";
import HomeBackdrop from "@/components/HomeBackdrop";
import DesktopWindow from "@/components/DesktopWindow";
import RainGlass from "@/components/RainGlass";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Naman Sharma",
  description:
    "Naman Sharma is a Design Engineer building modern web experiences.",
};

export default function Home() {
  return (
    <>
      <HomeBackdrop />

      {/* The rain falls on the wallpaper, behind the window — anything inside
          the window stays sharp and readable. No glass pane here: this page
          animates plenty on its own, and a full-screen backdrop-filter over it
          costs more frames than the softening is worth. The wallpaper carries
          a static blur instead. */}
      <RainGlass className="z-[1]" intensity={0.85} glass={false} />

      <DesktopWindow>
        <Profile />
      </DesktopWindow>
    </>
  );
}
