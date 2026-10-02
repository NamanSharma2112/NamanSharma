/**
 * The spine of the front page.
 *
 * One list, read by three things: the nav builds its index from it, the page
 * builds its sections from it, and the scroll spy matches them by id. Adding a
 * section here is the whole change — there is nowhere else to keep in step.
 */

export type SectionDef = {
  /** The anchor, and what the scroll spy matches on. */
  id: string;
  /** What the nav calls it. */
  label: string;
  /** The line under the heading. Short — it is a caption, not a paragraph. */
  blurb: string;
  /** The heading the section opens with. */
  heading: string;
};

export const SECTIONS: SectionDef[] = [
  {
    id: "work",
    label: "Work",
    heading: "Things I have built",
    blurb:
      "Passion projects and client work — libraries, dashboards and the odd full-stack app.",
  },
  {
    id: "craft",
    label: "Craft",
    heading: "The details nobody names",
    blurb:
      "Motion, interaction and the small decisions that decide whether an interface feels right.",
  },
  {
    id: "machine",
    label: "Machine",
    heading: "A desktop, rebuilt in the browser",
    blurb:
      "Boot, menu bar, dock, windows you can drag and resize, and the games that came with it.",
  },
  {
    id: "writing",
    label: "Writing",
    heading: "Notes and essays",
    blurb: "Thoughts on design engineering, motion, and building for the web.",
  },
  {
    id: "about",
    label: "About",
    heading: "Who is writing this",
    blurb: "The short version, with a few things to hover.",
  },
  {
    id: "contact",
    label: "Contact",
    heading: "Say hello",
    blurb: "Open to design engineering roles and freelance work.",
  },
];

/** `01`, `02`, … — the number a section is known by in the nav and its kicker. */
export const num = (i: number) => String(i + 1).padStart(2, "0");
