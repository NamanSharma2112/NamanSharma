"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Home, User, PenTool, Lightbulb, Mail } from "lucide-react";
import { SiX, SiGithub } from "@icons-pack/react-simple-icons";
import { playTap } from "@/lib/sounds";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        playTap();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
    playTap();
  };

  const openWindow = (id: string) => {
    window.dispatchEvent(new CustomEvent("open-desktop-window", { detail: id }));
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Applications">
          <CommandItem onSelect={() => runCommand(() => openWindow("home"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Desktop (Minimize All)</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => openWindow("about"))}>
            <User className="mr-2 h-4 w-4" />
            <span>About Me</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => openWindow("blog"))}>
            <PenTool className="mr-2 h-4 w-4" />
            <span>Writing</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => openWindow("inspiration"))}>
            <Lightbulb className="mr-2 h-4 w-4" />
            <span>Inspiration</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Socials">
          <CommandItem onSelect={() => runCommand(() => window.open("https://x.com/NamanSharma2112", "_blank"))}>
            <SiX className="mr-2 h-4 w-4" />
            <span>Twitter / X</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.open("https://github.com", "_blank"))}>
            <SiGithub className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => window.location.href = "mailto:hello@example.com")}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Email</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
