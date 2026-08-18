import type { Metadata } from "next";
import Win7 from "@/components/win7/Win7";

export const metadata: Metadata = {
  title: "Desktop | Naman Sharma",
  description:
    "A Windows 7 machine rebuilt in the browser — boot screen, Aero glass, and the games that came with it.",
};

/**
 * The desktop: a whole machine on its own route, from the firmware post up.
 */
export default function DesktopPage() {
  return <Win7 />;
}
