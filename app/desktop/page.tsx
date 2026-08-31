import type { Metadata } from "next";
import SeatScreen from "@/components/win7/SeatScreen";
import Win7 from "@/components/win7/Win7";

export const metadata: Metadata = {
  title: "Desktop | Naman Sharma",
  description:
    "A Windows 7 machine rebuilt in the browser, on the seat-back screen in front of you — boot screen, Aero glass, and the games that came with it.",
};

/**
 * The desktop: a whole machine on its own route, from the firmware post up —
 * running on the screen set into the back of the seat in front of yours.
 *
 * The seat is furniture and nothing more. The machine does not know it is in
 * one; it measures whatever box it is handed and fills it.
 */
export default function DesktopPage() {
  return (
    <SeatScreen>
      <Win7 />
    </SeatScreen>
  );
}
