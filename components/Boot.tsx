"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BootScreen, { BOOT_DURATION } from "@/components/BootScreen";

/**
 * Owns the one moment the whole entrance hangs off: when the intro lifts.
 *
 * One intro a session — the name turning over on a reel — and none at all on
 * the desktop, which starts a machine of its own. Everything waiting behind it
 * reads from the same flag, so the page begins arriving as the intro clears
 * rather than after it.
 */

const IntroDone = createContext(false);

/** True once the intro has lifted and the page is free to arrive. */
export const useIntroDone = () => useContext(IntroDone);

/**
 * Set once the intro has run. Without it the reel played on every hard load —
 * four and a half seconds of a sheet the same colour as the page, which reads
 * as a page that failed to load rather than as an entrance.
 */
const SEEN = "introduced";

type Intro = "reel" | "none";

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
    let boarded = false;
    try {
      boarded = sessionStorage.getItem(SEEN) === "true";
    } catch {
      // Storage blocked: treat it as a first visit.
    }

    if (boarded) {
      setIntro("none");
      setDone(true);
      return;
    }

    setIntro("reel");
    setDone(false);
  }, [pathname]);

  useEffect(() => {
    if (intro !== "reel") return;

    const finish = () => {
      setDone(true);
      try {
        sessionStorage.setItem(SEEN, "true");
      } catch {
        // Storage blocked: the intro runs again next navigation. Harmless.
      }
    };

    // The screen says you can skip it, so you can. Any key, or a click.
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);

    const timer = window.setTimeout(() => {
      setDone(true);
      // Marked here rather than on unmount: the reel is the whole welcome when
      // you arrive on an inner page, so having watched it counts as boarded.
      try {
        sessionStorage.setItem(SEEN, "true");
      } catch {
        // Storage blocked: the reel runs again next navigation. Harmless.
      }
    }, BOOT_DURATION * 1000);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [intro]);

  // Nothing to scroll to while the sheet is up, but the page behind it is full
  // height — so the bar was there, scrolling a screen you cannot see. Held
  // until the reel has lifted rather than until it unmounts, so the page is
  // free to move the moment it is yours.
  useEffect(() => {
    if (intro !== "reel" || done) return;
    const root = document.documentElement;
    root.classList.add("intro-up");
    return () => root.classList.remove("intro-up");
  }, [intro, done]);

  return (
    <IntroDone.Provider value={done}>
      {children}
      {intro === "reel" && <BootScreen show={!done} />}
    </IntroDone.Provider>
  );
}
