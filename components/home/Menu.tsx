"use client";

import { useRouter } from "next/navigation";
import { CommandMenu } from "@/components/ui/command-menu";
import { useTheme } from "next-themes";

/**
 * ⌘K.
 *
 * The actions are the site's own routes and the two things you might actually
 * want from a keyboard — somewhere to go, and the light turned up or down.
 * Nothing here is a feature invented to fill the list.
 */
export default function Menu() {
  const router = useRouter();
  const { setTheme } = useTheme();

  return (
    <CommandMenu
      placeholder="Go somewhere, or change the light…"
      actions={[
        {
          id: "home",
          label: "Home",
          keywords: ["start", "index"],
          group: "Go to",
          action: () => router.push("/"),
        },
        {
          id: "work",
          label: "Work",
          keywords: ["projects", "portfolio"],
          group: "Go to",
          action: () => router.push("/work"),
        },
        {
          id: "writing",
          label: "Writing",
          keywords: ["blog", "notes", "essays"],
          group: "Go to",
          action: () => router.push("/blog"),
        },
        {
          id: "inspiration",
          label: "Inspiration",
          keywords: ["people", "influences"],
          group: "Go to",
          action: () => router.push("/inspiration"),
        },
        {
          id: "lab",
          label: "Lab",
          keywords: ["experiments", "motion"],
          group: "Go to",
          action: () => router.push("/lab"),
        },
        {
          id: "desktop",
          label: "Desktop",
          keywords: ["machine", "macos", "games"],
          group: "Go to",
          action: () => router.push("/desktop"),
        },

        {
          id: "light",
          label: "Light",
          keywords: ["day", "sunny", "theme"],
          group: "Appearance",
          action: () => setTheme("light"),
        },
        {
          id: "dark",
          label: "Dark",
          keywords: ["night", "theme"],
          group: "Appearance",
          action: () => setTheme("dark"),
        },

        {
          id: "email",
          label: "Email me",
          keywords: ["contact", "hire", "hello"],
          group: "Elsewhere",
          action: () => {
            window.location.href = "mailto:namansharmans03@gmail.com";
          },
        },
        {
          id: "github",
          label: "GitHub",
          group: "Elsewhere",
          action: () => {
            window.open("https://github.com/NamanSharma2112", "_blank", "noopener,noreferrer");
          },
        },
        {
          id: "x",
          label: "X",
          group: "Elsewhere",
          action: () => {
            window.open("https://x.com/NamanSharma2112", "_blank", "noopener,noreferrer");
          },
        },
      ]}
    />
  );
}
