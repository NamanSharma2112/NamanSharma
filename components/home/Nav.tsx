"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

/**
 * The row of links under the prose.
 *
 * Work opens to the projects; the rest are plain links, because a menu that
 * drops a panel containing one item is a worse link.
 */
export default function Nav() {
  return (
    <NavigationMenu className="home-nav">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink render={<Link href="/" />}>Home</NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Work</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="home-nav-panel">
              {PROJECTS.map((p) => (
                <li key={p.href}>
                  <NavigationMenuLink
                    render={<a href={p.href} target="_blank" rel="noopener noreferrer" />}
                  >
                    <span className="home-nav-name">{p.name}</span>
                    <span className="home-nav-note">{p.note}</span>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink render={<Link href="/blog" />}>Writing</NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink render={<a href="mailto:namansharmans03@gmail.com" />}>
            Connect
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const PROJECTS = [
  { name: "MotionKit", note: "Animation library", href: "https://www.motionlib.me/" },
  { name: "ChurnRate", note: "SaaS dashboard", href: "https://www.churnrate.fun/" },
  {
    name: "Task Management",
    note: "Full-stack task app",
    href: "https://taskmangementapplication-production.up.railway.app",
  },
];
