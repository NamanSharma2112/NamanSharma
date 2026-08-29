"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BootScreen, { BOOT_DURATION } from "@/components/BootScreen";
import BoardingPass from "@/components/landing/BoardingPass";

/**
 * Owns the one moment the whole entrance hangs off: when the intro lifts.
 *
 * Which intro that is depends on where you came in. The front door is a gate
 * with a boarding pass to swipe; every other page turns the name over on a
 * reel; the desktop starts a machine up and needs neither.
 *
 * Everything waiting behind whichever one it is reads from the same flag, so
 * the page starts arriving as the intro clears rather than after it.
 */

const IntroDone = createContext(false);

/** True once the intro has lifted and the page is free to arrive. */
export const useIntroDone = () => useContext(IntroDone);

/** Set once the gate has been passed, so it is a welcome and not a toll. */
const SEEN = "boarded";

type Intro = "gate" | "reel" | "none";

export default function Boot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [done, setDone] = useState(false);
  const [intro, setIntro] = useState<Intro | null>(null);

  // Decided on the client: whether the gate has already been passed lives in
  // sessionStorage, which the server cannot see. Until it is known, no intro
  // renders — a gate that flashed and vanished would be worse than none.
  useEffect(() => {
    if (pathname.startsWith("/desktop")) {
      setIntro("none");
      setDone(true);
      return;
    }
    if (pathname === "/") {
      let boarded = false;
      try {
        boarded = sessionStorage.getItem(SEEN) === "true";
      } catch {
        // Storage blocked: treat it as a first visit.
      }
      setIntro(boarded ? "none" : "gate");
      setDone(boarded);
      return;
    }
    setIntro("reel");
  }, [pathname]);

  useEffect(() => {
    if (intro !== "reel") return;
    const timer = window.setTimeout(() => setDone(true), BOOT_DURATION * 1000);
    return () => window.clearTimeout(timer);
  }, [intro]);

  return (
    <IntroDone.Provider value={done}>
      {children}
      {intro === "reel" && <BootScreen show={!done} />}
      {intro === "gate" && (
        <BoardingPass
          onDone={() => setDone(true)}
          onExited={() => setIntro("none")}
        />
      )}
    </IntroDone.Provider>
  );
}
