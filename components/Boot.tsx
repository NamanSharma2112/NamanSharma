"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BootScreen, { BOOT_DURATION } from "@/components/BootScreen";

/**
 * Owns the one moment the whole entrance hangs off: when the intro lifts.
 *
 * The black sheet and everything waiting behind it read from the same flag, so
 * the page starts arriving as the sheet clears rather than after it — the two
 * halves overlap into a single movement instead of a pause between two.
 */

const IntroDone = createContext(false);

/** True once the intro has lifted and the page is free to arrive. */
export const useIntroDone = () => useContext(IntroDone);

export default function Boot({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const pathname = usePathname();

  // The desktop starts a machine up, firmware and all. Playing the site's
  // intro over the top of that would be two boot screens for one arrival.
  const ownsItsIntro = pathname.startsWith("/desktop");

  useEffect(() => {
    if (ownsItsIntro) return;
    const timer = window.setTimeout(() => setDone(true), BOOT_DURATION * 1000);
    return () => window.clearTimeout(timer);
  }, [ownsItsIntro]);

  if (ownsItsIntro) {
    return <IntroDone.Provider value>{children}</IntroDone.Provider>;
  }

  return (
    <IntroDone.Provider value={done}>
      {children}
      <BootScreen show={!done} />
    </IntroDone.Provider>
  );
}
