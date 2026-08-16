/** Shared so the work page and the desktop describe the same projects. */
export const PROJECTS = [
  {
    label: "MotionKit",
    description: "Animation Library",
    href: "https://www.motionlib.me/",
    external: true,
    cards: [
      { src: "/motionkit-preview.png", alt: "MotionKit Components", dx: 34, r: 11.9 },
      { src: "/isometric-studio.png", alt: "Isometric Studio", dx: -34, r: -6.58 },
    ],
  },
  {
    label: "ChurnRate",
    description: "SaaS Dashboard",
    href: "https://www.churnrate.fun/",
    external: true,
    cards: [
      { src: "/churnrate-analysis.png", alt: "ChurnRate Churn Analysis", dx: 34, r: 8.5 },
      { src: "/churnrate-dashboard.png", alt: "ChurnRate Analytics Dashboard", dx: -34, r: -10.2 },
    ],
  },
  {
    label: "Task Management App",
    description: "Productivity Tool",
    href: "https://taskmangementapplication-production.up.railway.app",
    external: true,
    cards: [
      {
        src: "https://api.microlink.io/?url=https://taskmangementapplication-production.up.railway.app&screenshot=true&meta=false&embed=screenshot.url",
        alt: "Task Management Application Preview",
        dx: 34,
        r: 9.5,
      },
      {
        src: "https://api.microlink.io/?url=https://taskmangementapplication-production.up.railway.app&screenshot=true&meta=false&embed=screenshot.url",
        alt: "Task Management Application",
        dx: -34,
        r: -7.2,
      },
    ],
  },
];
