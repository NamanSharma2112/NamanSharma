"use client";

import { usePathname } from "next/navigation";
import { usesPhotoBackdrop } from "@/lib/routes";

/**
 * Holds the pages that sit on the photo in dark styling, whatever the theme is.
 *
 * The backdrop stays dark in light mode by design, so without this the nav and
 * the panels in front of it switch to their light treatment and end up as pale
 * shapes on a night photo. Scoping `dark` here covers the chrome and the page
 * together, so they can never disagree about which ground they are on.
 *
 * `display: contents` keeps the wrapper out of the layout entirely — the flex
 * column in the body still sees its own children.
 */
export default function PhotoScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className={usesPhotoBackdrop(pathname) ? "dark contents" : "contents"}>
      {children}
    </div>
  );
}
