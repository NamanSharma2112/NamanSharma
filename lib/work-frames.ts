/* The shots on the Work ring, in ring order. Each is a 1280x800 screenshot
   in public/work/ring/<id>.webp with a 320x200 thumbnail beside it as
   <id>-t.webp, and a blurred speck of it in lib/work-blur.ts. Each
   project's shots stand together, one project after another round the ring, so when the ring opens into a strip a project is
   one stretch of it, and travelling along the strip passes from one
   project to the next. */

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
  { id: "iso-desk", project: "Isomatric", title: "Desk computer", href: "https://isomatric-eta.vercel.app/figures/desk" },
  { id: "iso-watch", project: "Isomatric", title: "Day-Date 40", href: "https://isomatric-eta.vercel.app/figures/watch" },
  { id: "iso-gpu", project: "Isomatric", title: "Three-fan graphics card", href: "https://isomatric-eta.vercel.app/figures/gpu" },
  { id: "mk-home", project: "MotionKit", title: "Motion components", href: "https://www.motionlib.me/" },
  { id: "mk-components", project: "MotionKit", title: "Component gallery", href: "https://www.motionlib.me/" },
  { id: "mk-svg", project: "MotionKit", title: "SVG studio", href: "https://www.motionlib.me/svg" },
  { id: "mk-shaders", project: "MotionKit", title: "Shader playground", href: "https://www.motionlib.me/shaders" },
  { id: "mk-ascii", project: "MotionKit", title: "ASCII animator", href: "https://www.motionlib.me/ascii" },
  { id: "acc-card", project: "AI Control Center", title: "The island, opened", href: "https://github.com/NamanSharma2112/AI-Control-Center" },
  { id: "acc-panel", project: "AI Control Center", title: "Usage and agents", href: "https://github.com/NamanSharma2112/AI-Control-Center" },
  { id: "acc-activity", project: "AI Control Center", title: "What just happened", href: "https://github.com/NamanSharma2112/AI-Control-Center" },
  { id: "churn-hero", project: "ChurnRate", title: "Know who is about to leave", href: "https://churnrate-app.vercel.app/" },
  { id: "churn-steps", project: "ChurnRate", title: "From export to at-risk list", href: "https://churnrate-app.vercel.app/" },
  { id: "churn-features", project: "ChurnRate", title: "Built around the work", href: "https://churnrate-app.vercel.app/" },
  { id: "churn-signin", project: "ChurnRate", title: "Sign in", href: "https://churnrate-app.vercel.app/customers" },
  { id: "oil-overview", project: "CrudeIQ", title: "Market overview", href: "https://crude-oil-prediction-b9wu.vercel.app/" },
  { id: "oil-forecast", project: "CrudeIQ", title: "Price forecasting", href: "https://crude-oil-prediction-b9wu.vercel.app/forecasting" },
  { id: "oil-production", project: "CrudeIQ", title: "Production by country", href: "https://crude-oil-prediction-b9wu.vercel.app/production" },
  { id: "oil-supply", project: "CrudeIQ", title: "Tanker routes", href: "https://crude-oil-prediction-b9wu.vercel.app/supply-chain" },
  { id: "ease-compare", project: "Easing Lab", title: "Compare curves", href: "https://easing-nine.vercel.app/" },
  { id: "ease-dialog", project: "Easing Lab", title: "Dialog, three ways", href: "https://easing-nine.vercel.app/" },
  { id: "ease-tune", project: "Easing Lab", title: "Tune a spring", href: "https://easing-nine.vercel.app/" },
  { id: "write-index", project: "Writing", title: "Notes and essays", href: "/blog" },
  { id: "write-taste", project: "Writing", title: "Developing taste", href: "/blog/developing-taste" },
  { id: "write-rls", project: "Writing", title: "Postgres row-level security", href: "/blog/postgresql-row-level-security" },
  { id: "site-intro", project: "This site", title: "Front page" },
  { id: "site-contact", project: "This site", title: "Say hello, signed" },
];

/* What each project is, for the page a shot opens onto: the role, in the
   order it was done, and a line or two on what it is. */
export type ProjectInfo = { name: string; role: string[]; about: string; href?: string };

export const PROJECTS: Record<string, ProjectInfo> = {
  Isomatric: {
    name: "Isomatric",
    role: ["Concept", "Design", "Development"],
    about:
      "Isometric figures for React: eleven interactive machines, each the explanation of an idea, drawn from one small kit of real solids. Every one comes apart into a labelled teardown.",
    href: "https://isomatric-eta.vercel.app/",
  },
  MotionKit: {
    name: "MotionKit",
    role: ["Design", "Development"],
    about:
      "An animation library: the curves and springs I kept rewriting slightly differently every time, packaged once, with playgrounds for SVG, shaders, ASCII and isometric scenes.",
    href: "https://www.motionlib.me/",
  },
  "AI Control Center": {
    name: "AI Control Center",
    role: ["Concept", "Design", "Development"],
    about:
      "A desktop island for your AI agents. A ghost at the top of the screen says what Claude Code and Codex are doing, who needs you, and how much usage is left; click it for every session and what just happened. Local-first, for Windows and macOS.",
    href: "https://github.com/NamanSharma2112/AI-Control-Center",
  },
  ChurnRate: {
    name: "ChurnRate",
    role: ["Design", "Development", "Machine learning"],
    about:
      "Churn prediction for SaaS teams. Drop in any customer export or connect Stripe; columns are mapped for you, a gradient-boosted model scores every account with the reasons behind it, and the at-risk list is ranked by the revenue on the line.",
    href: "https://churnrate-app.vercel.app/",
  },
  CrudeIQ: {
    name: "CrudeIQ",
    role: ["Data", "Machine learning", "Development"],
    about:
      "Oil market intelligence: live benchmark prices, WTI and Brent forecasts from an LSTM, XGBoost and LightGBM ensemble retrained every week, world production on a map and the routes tankers take.",
    href: "https://crude-oil-prediction-b9wu.vercel.app/",
  },
  "Easing Lab": {
    name: "Easing Lab",
    role: ["Concept", "Design", "Development"],
    about:
      "A bench for motion. Easing curves and springs side by side on the same animation, so you can see which one feels right, and what each does when you interrupt it halfway.",
    href: "https://easing-nine.vercel.app/",
  },
  Writing: {
    name: "Writing",
    role: ["Writing"],
    about: "Notes from building: on developing taste, and on the things I had to learn properly, like Postgres row-level security.",
    href: "/blog",
  },
  "This site": {
    name: "This site",
    role: ["Design", "Development"],
    about: "This portfolio: one chapter at a time, a ghost that hops when you reach for it, a ring of everything I have made, and a signature that writes itself in.",
  },
};
