import {
  boxCorners,
  corners,
  cylinder,
  fitProjection,
  haloOf,
  insetPlan,
  iso,
  lineOnTop,
  planOutline,
  pointsAt,
  radialTicks,
  ring,
  sideArc,
  slabOf,
  topTicks,
  type Plan,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";

/* ── the model ───────────────────────────────────────────────────────────
   A worked example, not figures out of anyone's account: a cohort that
   keeps 88% of its subscribers each month, which is the 12% monthly churn
   a subscription dashboard exists to watch. Ten beads stand for ten
   subscribers, so one bead is ten per cent of a cohort and the beads that
   cross the bar are the ones that left.

   Every number the figure shows is read back from the beads, so the
   readout cannot claim a retention the rods do not hold. */

export const KEEP = 0.88;
export const ROWS = 6;
export const BEADS = 10;
export const MONTHS = 14;

/** Beads still on the kept side of cohort `row` in month `month`. */
export function keptAt(row: number, month: number) {
  const age = month - row;
  if (age < 0) return BEADS;
  return Math.round(BEADS * KEEP ** age);
}

export function tallyAt(month: number) {
  let kept = 0;
  let total = 0;
  for (let row = 0; row < ROWS; row += 1) {
    if (month < row) continue;
    kept += keptAt(row, month);
    total += BEADS;
  }
  return { kept, total, rate: total ? kept / total : 1 };
}

export const readoutOf = (month: number) => {
  const { kept, total, rate } = tallyAt(Math.floor(month));
  return `month ${Math.floor(month)} · ${Math.round(rate * 100)}% kept · ${kept} of ${total}`;
};

/* ── the world ───────────────────────────────────────────────────────── */

export const WIDTH = 600;
export const HEIGHT = 352;

export const PLATE: Plan = { x: -140, y: -88, w: 296, d: 174, r: 10 };
const PLATE_Z = -11;
const PLATE_H = 11;
const FOOT_H = 5;

const POST_X = [-118, 118];
const POST_W = 11;
const POST_Z = 0;
const POST_H = 46;

const ROD_Z = 14;
const ROD_GAP = 13;
const ROD_Y0 = -((ROWS - 1) * ROD_GAP) / 2;
export const rodY = (row: number) => ROD_Y0 + row * ROD_GAP;

const BEAD_R = 4.2;
const BEAD_STEP = 9.4;
const BAR_X = 0;

/** Where a bead sits: kept beads stack right of the bar, churned left. */
export function beadX(index: number, kept: number) {
  return index < kept
    ? BAR_X + 9 + (kept - 1 - index) * BEAD_STEP
    : BAR_X - 9 - (index - kept) * BEAD_STEP;
}

const DIAL: Plane = [0, 64];
const DIAL_R = 15;
const DIAL_Z = 0;
const DIAL_H = 8;
const DIAL_TOP = DIAL_Z + DIAL_H;

export const P = fitProjection(
  [
    ...boxCorners(PLATE, PLATE_Z - FOOT_H, 0),
    ...boxCorners({ x: POST_X[0], y: ROD_Y0 - 8, w: POST_X[1] - POST_X[0], d: (ROWS - 1) * ROD_GAP + 16, r: 0 }, POST_Z, POST_Z + POST_H),
    [DIAL[0], DIAL[1], DIAL_TOP + 3] as Point3,
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 52 },
);

const byDepth = (points: Plane[]) =>
  [...points].sort((a, b) => iso([a[0], a[1], 0], P)[1] - iso([b[0], b[1], 0], P)[1]);

/* ── the parts ───────────────────────────────────────────────────────── */

export const ART = (() => {
  const LABEL: Plan = { x: PLATE.x + 16, y: PLATE.y + 13, w: 54, d: 21, r: 2 };
  const RULER: Plan = { x: -66, y: PLATE.y + PLATE.d - 11, w: 150, d: 6, r: 1 };

  return {
    halo: haloOf(PLATE, PLATE_Z - FOOT_H, 12, P),
    feet: byDepth(corners(PLATE, 20)).map(([x, y]) => ({
      flange: cylinder(x, y, 7, PLATE_Z - FOOT_H, 1.6, P, 24),
      foot: cylinder(x, y, 5.4, PLATE_Z - FOOT_H + 1.6, FOOT_H - 1.6, P, 24),
    })),
    plate: slabOf(PLATE, PLATE_Z, PLATE_H, P, 10, 1.5),
    groove: planOutline(insetPlan(PLATE, 5), 0, P),
    screwRings: corners(PLATE, 10).map(([x, y]) => ring(x, y, 2.2, 0, P, 16)),
    screws: pointsAt(corners(PLATE, 10).map(([x, y]) => [x, y, 0] as Point3), P),

    label: slabOf(LABEL, 0, 0.8, P, 3),
    labelInset: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
    labelRules: [38, 27, 32].map((w, i) =>
      lineOnTop([LABEL.x + 5, LABEL.y + 5 + i * 5], [LABEL.x + 5 + w, LABEL.y + 5 + i * 5], 0.8, P),
    ),
    labelScrews: pointsAt(
      [
        [LABEL.x + LABEL.w - 4, LABEL.y + 4, 0.8],
        [LABEL.x + LABEL.w - 4, LABEL.y + LABEL.d - 4, 0.8],
      ] as Point3[],
      P,
    ),

    ruler: slabOf(RULER, 0, 0.6, P, 3),
    ticks: topTicks(RULER.x + 5, RULER.x + RULER.w - 5, 4, 5, RULER.y + 0.8, 0.6, [2, 3.6], P),

    /* The frame: two posts the rods are carried on, with a cap and screws
       on each, and a shelf at the foot of each post. */
    posts: POST_X.map((x) => ({
      shelf: slabOf({ x: x - POST_W / 2 - 3, y: ROD_Y0 - 11, w: POST_W + 6, d: (ROWS - 1) * ROD_GAP + 22, r: 2 }, 0, 3, P, 3, 0.4),
      body: slabOf({ x: x - POST_W / 2, y: ROD_Y0 - 8, w: POST_W, d: (ROWS - 1) * ROD_GAP + 16, r: 2 }, 3, POST_H - 3, P, 3, 0.6),
      /* Edge to edge across the top, so it reads as a seam and not a scratch. */
      cap: lineOnTop([x - POST_W / 2, ROD_Y0 - 6], [x + POST_W / 2, ROD_Y0 - 6], POST_H, P),
      screws: pointsAt(
        [
          [x, ROD_Y0 - 4, POST_H],
          [x, ROD_Y0 + (ROWS - 1) * ROD_GAP + 4, POST_H],
        ] as Point3[],
        P,
      ),
    })),

    /* One rod per cohort, with a collar where it enters each post. */
    rods: Array.from({ length: ROWS }, (_, row) => {
      const y = rodY(row);
      return {
        rod: slabOf({ x: POST_X[0], y: y - 1.6, w: POST_X[1] - POST_X[0], d: 3.2, r: 1.6 }, ROD_Z, 3.2, P, 3),
        collars: POST_X.map((x) =>
          slabOf({ x: x - (x < 0 ? 0 : 5), y: y - 3.4, w: 5, d: 6.8, r: 1.4 }, ROD_Z - 0.8, 4.8, P, 3),
        ),
      };
    }),

    /* The bar the beads cross when they churn: everything left of it has
       gone. It is the one thing in the figure that means something on its
       own, so it is drawn as a real part, not a line on the plate. */
    bar: slabOf({ x: BAR_X - 2, y: ROD_Y0 - 10, w: 4, d: (ROWS - 1) * ROD_GAP + 20, r: 1 }, 0, POST_H - 6, P, 2, 0.5),
    barSeam: lineOnTop([BAR_X - 2, ROD_Y0 - 10], [BAR_X - 2, ROD_Y0 + (ROWS - 1) * ROD_GAP + 10], POST_H - 6, P),

    dialStand: slabOf({ x: DIAL[0] - 8, y: DIAL[1] - 8, w: 16, d: 16, r: 3 }, 0, DIAL_Z + 1, P, 3, 0.4),
    dialPuck: cylinder(DIAL[0], DIAL[1], DIAL_R, DIAL_Z, DIAL_H, P, 52, 0.8),
    dialSeam: sideArc(DIAL[0], DIAL[1], DIAL_R, DIAL_TOP - 3, P, 34),
    dialBezel: ring(DIAL[0], DIAL[1], DIAL_R - 2.3, DIAL_TOP, P, 52),
    dialTicks: radialTicks(DIAL[0], DIAL[1], DIAL_R - 3.3, 40, 5, DIAL_TOP, [1.2, 2.8], P),
    dialHub: ring(DIAL[0], DIAL[1], 1.6, DIAL_TOP, P, 14),
    dialCrown: slabOf({ x: DIAL[0] + DIAL_R - 1, y: DIAL[1] - 2.2, w: 5, d: 4.4, r: 1 }, DIAL_Z + 2, 3.6, P, 2),

    /** One bead, built at the origin of its rod and moved from there. */
    bead: cylinder(0, 0, BEAD_R, ROD_Z - 1.4, 6, P, 20, 0.4),
    beadRing: ring(0, 0, BEAD_R - 1.8, ROD_Z + 4.6, P, 14),
  };
})();

/** The needle, reading the share of beads still on the kept side. */
export const needleAt = (rate: number) => {
  const a = Math.PI * 0.75 + rate * Math.PI * 1.5;
  return lineOnTop(
    [DIAL[0] - Math.cos(a) * 3.2, DIAL[1] - Math.sin(a) * 3.2],
    [DIAL[0] + Math.cos(a) * (DIAL_R - 5), DIAL[1] + Math.sin(a) * (DIAL_R - 5)],
    DIAL_TOP + 0.2,
    P,
  );
};

export const beadKey = (row: number, index: number) => `${row}-${index}`;
