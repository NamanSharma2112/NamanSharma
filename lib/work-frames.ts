/* The shots on the Work ring, in ring order. Each is a 1280x800 screenshot
   in public/work/ring/<id>.jpg with a 320x200 thumbnail beside it as
   <id>-t.jpg. The projects are interleaved round the ring rather than
   grouped, so no stretch of it is all one site. */

export type Frame = {
  id: string;
  project: string;
  /* what this shot shows */
  title: string;
  /* where it goes; none for shots of this site itself */
  href?: string;
};

export const FRAMES: Frame[] = [
  { id: "iso-home", project: "Isomatric", title: "Isometric figures for React", href: "https://isomatric-eta.vercel.app/" },
  { id: "iso-cam", project: "Isomatric", title: "Cam and slide", href: "https://isomatric-eta.vercel.app/figures/cam" },
  { id: "iso-churn", project: "Isomatric", title: "Churn abacus", href: "https://isomatric-eta.vercel.app/figures/churn" },
  { id: "mk-home", project: "MotionKit", title: "Motion components", href: "https://www.motionlib.me/" },
  { id: "iso-desk", project: "Isomatric", title: "Desk computer", href: "https://isomatric-eta.vercel.app/figures/desk" },
  { id: "mk-components", project: "MotionKit", title: "Component gallery", href: "https://www.motionlib.me/" },
  { id: "ease-compare", project: "Easing Lab", title: "Compare curves", href: "https://easing-nine.vercel.app/" },
  { id: "iso-watch", project: "Isomatric", title: "Day-Date 40", href: "https://isomatric-eta.vercel.app/figures/watch" },
  { id: "mk-svg", project: "MotionKit", title: "SVG studio", href: "https://www.motionlib.me/svg" },
  { id: "write-index", project: "Writing", title: "Notes and essays", href: "/blog" },
  { id: "iso-gpu", project: "Isomatric", title: "Three-fan graphics card", href: "https://isomatric-eta.vercel.app/figures/gpu" },
  { id: "mk-shaders", project: "MotionKit", title: "Shader playground", href: "https://www.motionlib.me/shaders" },
  { id: "ease-dialog", project: "Easing Lab", title: "Dialog, three ways", href: "https://easing-nine.vercel.app/" },
  { id: "iso-sorter", project: "Isomatric", title: "Task sorter", href: "https://isomatric-eta.vercel.app/figures/sorter" },
  { id: "mk-ascii", project: "MotionKit", title: "ASCII animator", href: "https://www.motionlib.me/ascii" },
  { id: "write-taste", project: "Writing", title: "Developing taste", href: "/blog/developing-taste" },
  { id: "iso-scale", project: "Isomatric", title: "Progress scale", href: "https://isomatric-eta.vercel.app/figures/scale" },
  { id: "mk-isometric", project: "MotionKit", title: "Isometric maker", href: "https://www.motionlib.me/isometric" },
  { id: "ease-toast", project: "Easing Lab", title: "Toast, three ways", href: "https://easing-nine.vercel.app/" },
  { id: "iso-kit", project: "Isomatric", title: "The kit", href: "https://isomatric-eta.vercel.app/kit" },
  { id: "mk-shadow", project: "MotionKit", title: "Shadow studio", href: "https://www.motionlib.me/shadow" },
  { id: "site-intro", project: "This site", title: "Front page" },
  { id: "iso-shuttle", project: "Isomatric", title: "Save and undo", href: "https://isomatric-eta.vercel.app/figures/shuttle" },
  { id: "mk-background", project: "MotionKit", title: "Background playground", href: "https://www.motionlib.me/background" },
  { id: "ease-tune", project: "Easing Lab", title: "Tune a spring", href: "https://easing-nine.vercel.app/" },
  { id: "write-rls", project: "Writing", title: "Postgres row-level security", href: "/blog/postgresql-row-level-security" },
  { id: "mk-css", project: "MotionKit", title: "CSS playground", href: "https://www.motionlib.me/css" },
  { id: "iso-bench", project: "Isomatric", title: "Workbench line", href: "https://isomatric-eta.vercel.app/figures/bench" },
  { id: "mk-templates", project: "MotionKit", title: "Bigger pieces, ready to drop in", href: "https://www.motionlib.me/templates" },
  { id: "site-contact", project: "This site", title: "Say hello, signed" },
];
