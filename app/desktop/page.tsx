import DesktopHome from "@/components/DesktopHome";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desktop | Naman Sharma",
  description: "The desktop: wallpaper, rain, windows and a dock.",
};

/**
 * The macOS-style desktop, kept on its own route now that the front page is a
 * plain column of text.
 */
export default function DesktopPage() {
  return <DesktopHome />;
}
