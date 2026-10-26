import {
  boxCorners,
  circleRing,
  corners,
  coil,
  cylinder,
  extrude,
  fitProjection,
  haloOf,
  insetPlan,
  iso,
  knurl,
  lineOnTop,
  onTop,
  planOutline,
  pointsAt,
  radialTicks,
  ring,
  sideArc,
  sideRing,
  slabOf,
  topTicks,
  type Plan,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";

/* ── the model ───────────────────────────────────────────────────────────
   The curve is this site's own. `--ease-out` in globals.css is
   cubic-bezier(0.23, 1, 0.32, 1), and the cam is cut to it: the radius at
   any angle is the eased value at that fraction of a turn. So the shape of
   the disc is the easing function, and the slide's travel is what the curve
   returns. Nothing here is a number chosen to look right. */

export const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

const bezier = (a: number, b: number, t: number) => {
  const u = 1 - t;
  return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t;
};

/** Solve x(s) = t for s by bisection, then read y(s). Exact enough at 1px. */
export function ease(t: number, [x1, y1, x2, y2] = EASE) {
  const at = Math.min(1, Math.max(0, t));
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2;
    if (bezier(x1, x2, mid) < at) lo = mid;
    else hi = mid;
  }
  return bezier(y1, y2, (lo + hi) / 2);
}

/** One turn of the crank is one play of the curve, and back. */
export const phaseOf = (turn: number) => {
  const t = ((turn % 1) + 1) % 1;
  return t < 0.72 ? t / 0.72 : 1 - (t - 0.72) / 0.28;
};

export const LIFT = 26;
export const BASE_R = 20;

/** The cam's radius at an angle: the curve, wrapped round a disc. */
export const radiusAt = (angle: number) => {
  const turn = ((angle / (Math.PI * 2)) % 1 + 1) % 1;
  return BASE_R + LIFT * ease(phaseOf(turn));
};

export const readoutOf = (turn: number) => {
  const t = phaseOf(turn);
  return `t ${t.toFixed(2)} · out ${ease(t).toFixed(2)} · ${(BASE_R + LIFT * ease(t) - BASE_R).toFixed(1)} px`;
};

/* ── the world ───────────────────────────────────────────────────────── */

export const WIDTH = 600;
export const HEIGHT = 352;

export const PLATE: Plan = { x: -132, y: -84, w: 286, d: 160, r: 9 };
const PLATE_Z = -11;
const PLATE_H = 11;
const FOOT_H = 5;

const CAM: Plane = [-34, 0];
const CAM_Z = 4;
const CAM_H = 11;
const CAM_TOP = CAM_Z + CAM_H;

const SHAFT_R = 5.2;
const KNOB_R = 10.5;
const KNOB_Z = CAM_TOP + 9;
const KNOB_H = 7;

const ROLLER_R = 6.5;
const ARM_Y = 0;

export const SLIDE_HOME = 16;
export const SLIDE_SPAN = LIFT;

const RAIL_Y = [-26, 22];
/* The slide stands clear of the cam's widest point (46 at full lift) at
   every angle, not just where the follower touches it: a cam is a disc,
   and a plate parked beside it at 28 met its far side as it turned. */
const SLIDE: Plan = { x: 16, y: -30, w: 40, d: 56, r: 4 };
/* Where the follower's rod starts: the roller's centre at rest. */
const ROD_X = -34 + 20 + 6.5;
/* The fixed end the return spring seats against, clear of the dial. */
const STOP_R = 94;
const SLIDE_Z = 3;
const SLIDE_H = 6;

const DIAL: Plane = [118, -4];
const DIAL_R = 16;
const DIAL_Z = 2;
const DIAL_H = 9;
const DIAL_TOP = DIAL_Z + DIAL_H;

export const P = fitProjection(
  [
    ...boxCorners(PLATE, PLATE_Z - FOOT_H, 0),
    [CAM[0], CAM[1], KNOB_Z + KNOB_H] as Point3,
    [DIAL[0], DIAL[1], DIAL_TOP + 4] as Point3,
  ],
  WIDTH,
  HEIGHT,
  { pad: 30, azimuth: 52 },
);

export const at = (point: Point3) => iso(point, P);

/* ── the parts ───────────────────────────────────────────────────────── */

const byDepth = (points: Plane[]) =>
  [...points].sort(
    (a, b) =>
      iso([a[0], a[1], 0], P)[1] - iso([b[0], b[1], 0], P)[1],
  );

const tickRow = (strip: Plan) =>
  topTicks(strip.x + 5, strip.x + strip.w - 5, 4, 5, strip.y + 0.8, 0.6, [2, 3.8], P);

/** Every static path, built once when the module loads. */
export const ART = (() => {
  const RULER: Plan = { x: -8, y: PLATE.y + PLATE.d - 17, w: 150, d: 7, r: 1 };
  const LABEL: Plan = { x: PLATE.x + 14, y: PLATE.y + 12, w: 54, d: 22, r: 2 };

  return {
    halo: haloOf(PLATE, PLATE_Z - FOOT_H, 12, P),

    feet: byDepth(corners(PLATE, 20)).map(([x, y]) => ({
      flange: cylinder(x, y, 7, PLATE_Z - FOOT_H, 1.6, P, 24),
      foot: cylinder(x, y, 5.4, PLATE_Z - FOOT_H + 1.6, FOOT_H - 1.6, P, 24),
    })),

    plate: slabOf(PLATE, PLATE_Z, PLATE_H, P, 9, 1.5),
    groove: planOutline(insetPlan(PLATE, 5), 0, P),
    screwRings: corners(PLATE, 10).map(([x, y]) => ring(x, y, 2.2, 0, P, 16)),
    screws: pointsAt(corners(PLATE, 10).map(([x, y]) => [x, y, 0] as Point3), P),

    label: slabOf(LABEL, 0, 0.8, P, 3),
    labelInset: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
    labelRules: [38, 28, 33].map((w, i) =>
      lineOnTop([LABEL.x + 5, LABEL.y + 6 + i * 5], [LABEL.x + 5 + w, LABEL.y + 6 + i * 5], 0.8, P),
    ),
    labelScrews: pointsAt(
      [
        [LABEL.x + LABEL.w - 4, LABEL.y + 4, 0.8],
        [LABEL.x + LABEL.w - 4, LABEL.y + LABEL.d - 4, 0.8],
      ] as Point3[],
      P,
    ),

    ruler: slabOf(RULER, 0, 0.6, P, 3),
    ticks: tickRow(RULER),
    zero: lineOnTop(
      [RULER.x + 5, RULER.y + 0.8],
      [RULER.x + 5, RULER.y + 5.4],
      0.6,
      P,
    ),

    /* Long enough for the slide's whole travel, and the end stops low
       enough that the follower's rod passes over the near one. */
    rails: RAIL_Y.map((y) => slabOf({ x: 10, y: y - 2.5, w: STOP_R - 10, d: 5, r: 1 }, 0, 3, P, 3, 0.4)),
    stops: [11, STOP_R].map((x) =>
      slabOf({ x: x - 2.5, y: RAIL_Y[0] - 5, w: 5, d: RAIL_Y[1] - RAIL_Y[0] + 10, r: 1.2 }, 0, 4, P, 3, 0.5),
    ),
    stopScrews: pointsAt(
      ([[11, RAIL_Y[0] - 1, 4], [11, RAIL_Y[1] + 1, 4], [STOP_R, RAIL_Y[0] - 1, 4], [STOP_R, RAIL_Y[1] + 1, 4]] as Point3[]),
      P,
    ),

    post: cylinder(CAM[0], CAM[1], 8.5, 0, CAM_Z, P, 28, 0.5),
    postSeam: sideArc(CAM[0], CAM[1], 8.5, CAM_Z - 1.2, P, 24),
    shaft: cylinder(CAM[0], CAM[1], SHAFT_R, CAM_TOP, KNOB_Z - CAM_TOP, P, 22),
    shaftSeam: sideArc(CAM[0], CAM[1], SHAFT_R, KNOB_Z - 2, P, 20),

    knob: cylinder(CAM[0], CAM[1], KNOB_R, KNOB_Z, KNOB_H, P, 32, 0.6),
    knurl: knurl(CAM[0], CAM[1], KNOB_R, KNOB_Z, KNOB_Z + KNOB_H, 34, P),
    knobRing: ring(CAM[0], CAM[1], KNOB_R - 3, KNOB_Z + KNOB_H, P, 28),

    /* Where the return spring seats on the slide's far face: a ring at
       the coil's own radius, so the first turn starts on it. */
    springSeat: sideRing([SLIDE.x + SLIDE.w, ARM_Y, SLIDE_Z + 3], 3, "x", P, 20),

    /* The rod from the roller's pin to the slide's face. It moves with
       the slide, so it is drawn at rest and translated with it; it sits
       inside the roller's height and the slide's thickness, so it meets
       both flush rather than standing proud of either. */
    arm: slabOf({ x: ROD_X, y: ARM_Y - 3, w: SLIDE.x - ROD_X, d: 6, r: 1.4 }, 4.6, 3.5, P, 3, 0.4),

    slide: slabOf(SLIDE, SLIDE_Z, SLIDE_H, P, 4, 0.6),
    slideSeat: planOutline(insetPlan(SLIDE, 5), SLIDE_Z + SLIDE_H, P),
    slideRivets: pointsAt(
      [1, 9, 17, 25, 33].map((dx) => [SLIDE.x + 3 + dx, SLIDE.y + 4, SLIDE_Z + SLIDE_H] as Point3),
      P,
    ),
    slideBushes: [
      slabOf({ x: SLIDE.x + 4, y: RAIL_Y[0] - 5, w: 12, d: 10, r: 2 }, SLIDE_Z - 1, 4, P, 3),
      slabOf({ x: SLIDE.x + 24, y: RAIL_Y[0] - 5, w: 12, d: 10, r: 2 }, SLIDE_Z - 1, 4, P, 3),
      slabOf({ x: SLIDE.x + 4, y: RAIL_Y[1] - 5, w: 12, d: 10, r: 2 }, SLIDE_Z - 1, 4, P, 3),
      slabOf({ x: SLIDE.x + 24, y: RAIL_Y[1] - 5, w: 12, d: 10, r: 2 }, SLIDE_Z - 1, 4, P, 3),
    ],

    dialStand: slabOf({ x: DIAL[0] - 9, y: DIAL[1] - 9, w: 18, d: 18, r: 3 }, 0, DIAL_Z, P, 3, 0.4),
    dialPuck: cylinder(DIAL[0], DIAL[1], DIAL_R, DIAL_Z, DIAL_H, P, 56, 0.8),
    dialBand: knurl(DIAL[0], DIAL[1], DIAL_R, DIAL_TOP - 3.2, DIAL_TOP, 72, P, 0.3),
    dialSeam: sideArc(DIAL[0], DIAL[1], DIAL_R, DIAL_TOP - 3.2, P, 36),
    dialBezel: ring(DIAL[0], DIAL[1], DIAL_R - 2.4, DIAL_TOP, P, 56),
    dialTicks: radialTicks(DIAL[0], DIAL[1], DIAL_R - 3.4, 40, 5, DIAL_TOP, [1.3, 2.9], P),
    dialHub: ring(DIAL[0], DIAL[1], 1.7, DIAL_TOP, P, 14),
    dialCrown: slabOf({ x: DIAL[0] + DIAL_R - 1, y: DIAL[1] - 2.4, w: 5, d: 4.8, r: 1 }, DIAL_Z + 2, 4, P, 2),
    dialLug: slabOf({ x: DIAL[0] - 20, y: DIAL[1] - 3, w: 12, d: 6, r: 1.4 }, DIAL_Z + 1, 4, P, 2),
  };
})();

/* ── what changes while it runs ──────────────────────────────────────── */

/** The cam's own outline, cut to the curve, at this angle. */
export function camAt(angle: number) {
  const ring: Plane[] = [];
  for (let i = 0; i < 96; i += 1) {
    const a = (i / 96) * Math.PI * 2;
    /* Cut so the radius at the point of contact (+x, where the roller
       rides) is the curve's own value at this turn. Wound the other way,
       the contact read the curve backwards while the slide read it
       forwards, and the two only agreed at the ends of the stroke. */
    const r = radiusAt(angle - a);
    ring.push([CAM[0] + Math.cos(a) * r, CAM[1] + Math.sin(a) * r]);
  }
  return extrude(ring, CAM_Z, CAM_H, P, { convex: false, bevel: 0.6 });
}

/** The index line engraved on the knob, so the turn is readable. */
export const markAt = (angle: number) =>
  lineOnTop(
    [CAM[0] + Math.cos(angle) * 3.5, CAM[1] + Math.sin(angle) * 3.5],
    [CAM[0] + Math.cos(angle) * (KNOB_R - 1.2), CAM[1] + Math.sin(angle) * (KNOB_R - 1.2)],
    KNOB_Z + KNOB_H,
    P,
  );

/** The roller that rides the cam, and the return spring that keeps it
    there. `lift` is how far past the base circle the cam reaches at the
    point of contact, so the roller sits ON the rim — it was placed at the
    lift alone, twenty units inside the disc. The spring runs from the
    slide's far face to the fixed stop, so it shortens as the cam pushes. */
export function followerAt(lift: number) {
  const x = CAM[0] + BASE_R + lift + ROLLER_R;
  return {
    roller: cylinder(x, ARM_Y, ROLLER_R, CAM_Z + 1, CAM_H - 2, P, 24, 0.4),
    pin: ring(x, ARM_Y, 1.8, CAM_Z + CAM_H - 1, P, 12),
    spring: coil(SLIDE.x + SLIDE.w + lift, STOP_R - 2.5, [ARM_Y, SLIDE_Z + 3], 3, 7, "x", P),
  };
}

export const needleAt = (fraction: number) => {
  const a = -Math.PI / 2 + fraction * Math.PI * 1.6;
  return lineOnTop(
    [DIAL[0] - Math.cos(a) * 3.4, DIAL[1] - Math.sin(a) * 3.4],
    [DIAL[0] + Math.cos(a) * (DIAL_R - 5), DIAL[1] + Math.sin(a) * (DIAL_R - 5)],
    DIAL_TOP + 0.2,
    P,
  );
};

export const CAM_CENTRE = CAM;
export const ROLLER = ROLLER_R;
