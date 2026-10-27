import {
  boxCorners,
  circleRing,
  cylinder,
  extrude,
  fitProjection,
  haloOf,
  iso,
  knurl,
  lineOnTop,
  onTop,
  planOutline,
  ring,
  sideArc,
  insetPlan,
  slabOf,
  topMatrix,
  towardViewer,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from "@/components/iso/iso-kit";

/* ── the model ───────────────────────────────────────────────────────────
   A Day-Date 40 laid open on a tray, in millimetres: a 40 mm case, a
   fluted bezel, the dial in its recess under a flat crystal with the
   Cyclops over the date, and the three-piece President bracelet lying
   flat either side of it. No maker's name or crown
   is drawn on the dial; the page names the reference in words.

   ── WHICH WAY IT FACES ─────────────────────────────────────────────────
   12 o'clock is at -y and 3 o'clock at +x, so the bracelet runs along y
   and the crown at 3 faces the viewer. A dial angle is measured clockwise
   from 12 seen from above, which with this camera puts the point at
   (sin a, -cos a): the same convention as the kit's radial ticks.

   ── THE RECESS ─────────────────────────────────────────────────────────
   The dial sits level with the case top and the bezel stands 1.6 above
   it, so from 30 degrees up the bezel's near rim hides a band at the
   dial's near edge and its far inner wall shows as a crescent. Both are
   worked out exactly — two equal circles, one shifted along the view —
   rather than masked, so the bezel can lift off and still be a ring you
   see through. Everything printed on the dial stays inside the part the
   near rim leaves visible. */

export const WIDTH = 600;
export const HEIGHT = 440;

/* The exploded stack needs room above and below the assembled drawing:
   five levels of GAP, spread about its middle. */
export const GAP = 26;
const SPARE = (5 * GAP) / 2;

const CASE_R = 20;
const BACK_R = 17.5;
const BACK_H = 1.6;
const CASE_TOP = 9;

const HOLE_R = 17.2;
const BEZEL_R = 19.7;
const BEZEL_TOP = CASE_TOP + 1.6;

const DIAL_Z = CASE_TOP;
const CYCLOPS_TOP = BEZEL_TOP + 1;

const TRAY: Plan = { x: -25.5, y: -61.5, w: 51, d: 129, r: 8 };
const TRAY_Z = -4;

const LUG_X: [number, number] = [10.4, 13.2];
const LUG_END = 24.4;

const P0 = fitProjection(
  [
    ...boxCorners(TRAY, TRAY_Z, 0),
    [0, 0, CYCLOPS_TOP] as Point3,
    [24.6, 0, 7.6] as Point3,
  ],
  WIDTH,
  HEIGHT - SPARE * 2,
  { pad: 8, azimuth: 45 },
);
export const P = { ...P0, origin: [P0.origin[0], P0.origin[1] + SPARE] as [number, number] };

const toward = towardViewer(P);
const deep = (x: number, y: number) => x * toward[0] + y * toward[1];

/* How far along the ground a drop of `dz` slides on screen: a point dz
   lower lines up with one this much farther from the viewer. */
const SLIDE = (() => {
  const unit = iso([0, 0, 1], P);
  const base = iso([0, 0, 0], P);
  const ex = iso([1, 0, 0], P);
  const ey = iso([0, 1, 0], P);
  /* solve a·ex + b·ey = up, for the ground vector under one unit of rise */
  const [ux, uy] = [unit[0] - base[0], unit[1] - base[1]];
  const [ax, ay] = [ex[0] - base[0], ex[1] - base[1]];
  const [bx, by] = [ey[0] - base[0], ey[1] - base[1]];
  const det = ax * by - ay * bx;
  return Math.hypot((ux * by - uy * bx) / det, (ax * uy - ay * ux) / det);
})();

/** A dial position: radius r at angle a, clockwise from 12. */
const polar = (r: number, a: number): Plane => [Math.sin(a) * r, -Math.cos(a) * r];

/* ── small builders ──────────────────────────────────────────────────── */

/** A prism over any ring of plan points, for the parts that meet the
    case along its curve. */
const prism = (pts: Plane[], z: number, h: number) => extrude(pts, z, h, P, { convex: false, bevel: 0.3 });

/** The case's outline between two x values, on the side `s` (±1 in y). */
const caseArc = (x0: number, x1: number, s: number, steps = 6): Plane[] =>
  Array.from({ length: steps + 1 }, (_, i) => {
    const x = x0 + ((x1 - x0) * i) / steps;
    return [x, s * Math.sqrt(CASE_R * CASE_R - x * x)] as Plane;
  });

/** A part that starts flush on the case and runs out to `to` in y,
    with its two outer corners eased. */
function offCase(x0: number, x1: number, s: number, to: number) {
  const c = 1;
  const pts: Plane[] = [
    ...caseArc(x0, x1, s),
    [x1, s * (to - c)],
    [x1 - c * 0.3, s * (to - c * 0.3)],
    [x1 - c, s * to],
    [x0 + c, s * to],
    [x0 + c * 0.3, s * (to - c * 0.3)],
    [x0, s * (to - c)],
  ];
  return pts;
}

/** A shape on the dial, turned to an angle: points in the hand's own
    frame (along, across) placed at the centre. */
const turned = (shape: Plane[], a: number, at: Plane = [0, 0]): Plane[] => {
  const [ux, uy] = [Math.sin(a), -Math.cos(a)];
  const [vx, vy] = [Math.cos(a), Math.sin(a)];
  return shape.map(([r, w]) => [at[0] + ux * r + vx * w, at[1] + uy * r + vy * w] as Plane);
};


/* ── the bracelet ────────────────────────────────────────────────────── */

/* The President: rows of three links, the middle one narrower and a touch
   prouder, each rounded over on top, which the crest line along it shows.
   It lies open both ways from the case, flat on the tray once past the
   end links, narrowing a little row by row; the 6 o'clock half ends in
   the clasp. */
const PITCH = 3.6;
const LINK = 3.25;
const ROWS = { [-1]: 9, [1]: 7 } as const;

type Piece = { depth: number; paths: SolidPaths; crest?: string };

function rowOf(y0: number, width: number, z: number): Piece[] {
  const h = width / 2;
  const spans: [number, number, number][] = [
    [-h, -2.95, 0],
    [-2.65, 2.65, 0.3],
    [2.95, h, 0],
  ];
  const yc = y0 + LINK / 2;
  return spans.map(([x0, x1, proud]) => {
    const top = z + 3.1 + proud;
    return {
      depth: deep((x0 + x1) / 2, yc),
      paths: slabOf({ x: x0, y: y0, w: x1 - x0, d: LINK, r: 1.1 }, z, top - z, P, 4, 0.25),
      crest: lineOnTop([x0, yc], [x1, yc], top, P),
    };
  });
}

function braceletSide(s: 1 | -1): Piece[] {
  const pieces: Piece[] = [];

  /* the end link, flush on the case between the lugs, standing at the
     lugs' height and stepping down to the first row */
  pieces.push({ depth: deep(0, s * 22), paths: prism(offCase(-10, 10, s, LUG_END), 1.8, 4.6) });

  let edge = LUG_END + 0.4;
  for (let k = 0; k < ROWS[s]; k++) {
    const y0 = s > 0 ? edge : -edge - LINK;
    pieces.push(...rowOf(y0, Math.max(16.6, 19.6 - k * 0.35), k === 0 ? 0.5 : 0));
    edge += PITCH;
  }

  if (s > 0) {
    const w = Math.max(16.6, 19.6 - ROWS[1] * 0.35);
    const clasp: Plan = { x: -w / 2, y: edge, w, d: 13, r: 2.2 };
    pieces.push({
      depth: deep(0, edge + 6.5),
      paths: slabOf(clasp, 0, 3, P, 6, 0.4),
      crest: lineOnTop([-w / 2, edge + 8.6], [w / 2, edge + 8.6], 3, P),
    });
  }
  return pieces;
}

function lugsSide(s: 1 | -1): Piece[] {
  return [-1, 1].map((side) => {
    const [x0, x1] = side < 0 ? [-LUG_X[1], -LUG_X[0]] : LUG_X;
    return { depth: deep((x0 + x1) / 2, s * 21), paths: prism(offCase(x0, x1, s, LUG_END), 3.4, 4.8) };
  });
}

/* Everything on one side lies side by side, so far to near is enough. */
const byDepth = (pieces: Piece[]) => [...pieces].sort((a, b) => a.depth - b.depth);

/* ── the bezel ───────────────────────────────────────────────────────── */

/** The bezel as a ring: its outer solid with the opening cut through it,
    so whatever is under it shows, and the far inner wall as a crescent. */
function bezelOf() {
  const outer = cylinder(0, 0, BEZEL_R, CASE_TOP, BEZEL_TOP - CASE_TOP, P, 72);
  const hole = onTop(circleRing(0, 0, HOLE_R, 96), BEZEL_TOP, P, true);

  /* The wall's bottom edge, seen from here, is the opening slid toward
     the viewer by the wall's height. Two equal circles: where they
     cross is exact, so the wall's far edge ends on the opening. */
  const d = (BEZEL_TOP - CASE_TOP) * SLIDE;
  const half = d / 2;
  const h = Math.sqrt(HOLE_R * HOLE_R - half * half);
  const [tx, ty] = toward;
  const [vx, vy] = [-ty, tx];
  const mx = tx * half;
  const my = ty * half;
  const p: Plane = [mx + vx * h, my + vy * h];
  const q: Plane = [mx - vx * h, my - vy * h];

  const arc = (cx: number, cy: number, from: Plane, to: Plane, through: Plane, steps = 48): Plane[] => {
    const a0 = Math.atan2(from[1] - cy, from[0] - cx);
    let a1 = Math.atan2(to[1] - cy, to[0] - cx);
    const am = Math.atan2(through[1] - cy, through[0] - cx);
    /* go the way that passes `through` */
    const norm = (a: number) => ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const ccw = norm(am - a0) < norm(a1 - a0);
    a1 = a0 + (ccw ? norm(a1 - a0) : -norm(a0 - a1));
    return Array.from({ length: steps + 1 }, (_, i) => {
      const a = a0 + ((a1 - a0) * i) / steps;
      return [cx + Math.cos(a) * HOLE_R, cy + Math.sin(a) * HOLE_R] as Plane;
    });
  };

  /* the far arc of the slid circle, and the near arc of the opening */
  const wallFoot = arc(tx * d, ty * d, p, q, [tx * d - tx * HOLE_R, ty * d - ty * HOLE_R]);
  const nearRim = arc(0, 0, q, p, [tx * HOLE_R, ty * HOLE_R]);
  const lens = onTop([...wallFoot, ...nearRim.slice(1, -1)], BEZEL_TOP, P, true);

  return {
    fill: outer.fill + hole,
    top: outer.top + hole,
    shades: outer.shades,
    crease: outer.crease,
    outline: outer.outline,
    hole,
    wall: hole + lens,
    wallFoot: onTop(wallFoot, BEZEL_TOP, P),
    flutesTop: Array.from({ length: 60 }, (_, i) => {
      const a = (i / 60) * Math.PI * 2;
      return lineOnTop(polar(HOLE_R, a), polar(BEZEL_R, a), BEZEL_TOP, P);
    }).join(""),
    flutesSide: knurl(0, 0, BEZEL_R, CASE_TOP, BEZEL_TOP, 60, P, 0),
  };
}

/* ── the dial ────────────────────────────────────────────────────────── */

const HOUR_AT = (h: number) => (h / 12) * Math.PI * 2;
const DAY_AT: Plane = [0, -10.9];
const DATE_AT: Plane = [11.2, 0];
const DATE_WINDOW: Plan = { x: 9.6, y: -1.5, w: 3.2, d: 3, r: 0.4 };
const DAY_WINDOW: Plan = { x: -4.6, y: -12.4, w: 9.2, d: 3, r: 0.5 };
const CYCLOPS: Plan = { x: 8.6, y: -2.6, w: 5.2, d: 5.2, r: 1.6 };

/** Every static path, built once when the module loads. */
export const ART = (() => {
  const near = byDepth([...lugsSide(1), ...braceletSide(1)]);
  const far = byDepth([...lugsSide(-1), ...braceletSide(-1)]);

  const index = (a: number) =>
    extrude(
      turned(
        [
          [10.2, -0.62],
          [13.2, -0.62],
          [13.2, 0.62],
          [10.2, 0.62],
        ],
        a,
      ),
      DIAL_Z,
      0.35,
      P,
    );

  return {
    halo: haloOf(TRAY, TRAY_Z, 2, P),
    tray: slabOf(TRAY, TRAY_Z, -TRAY_Z, P, 8, 0.8),
    groove: planOutline(insetPlan(TRAY, 4), 0, P),

    /* the half of the bracelet behind the case, then the half in front */
    far,
    near,

    caseback: cylinder(0, 0, BACK_R, 0, BACK_H, P, 56),
    case: cylinder(0, 0, CASE_R, BACK_H, CASE_TOP - BACK_H, P, 72, 0.4),
    caseSeam: sideArc(0, 0, CASE_R, BACK_H + 1.2, P, 48),
    seat: ring(0, 0, HOLE_R, CASE_TOP, P, 96),

    tube: slabOf({ x: 19.7, y: -1.8, w: 1.6, d: 3.6, r: 0.6 }, 4.4, 2.2, P, 3),
    crown: slabOf({ x: 21.2, y: -3.1, w: 3.4, d: 6.2, r: 1.1 }, 3.4, 4.2, P, 4, 0.3),
    crownFlutes: [-1.8, -1.08, -0.36, 0.36, 1.08, 1.8]
      .map((y) => lineOnTop([21.2, y], [24.6, y], 7.6, P))
      .join(""),

    dial: cylinder(0, 0, HOLE_R, DIAL_Z - 0.4, 0.4, P, 96),
    track: {
      outer: ring(0, 0, 14, DIAL_Z, P, 96),
      inner: ring(0, 0, 13.5, DIAL_Z, P, 96),
      ticks: Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        return lineOnTop(polar(13.5, a), polar(14, a), DIAL_Z, P);
      }).join(""),
    },
    /* 3 is the date and 12 the day, so neither carries a baton */
    indices: [1, 2, 4, 5, 6, 7, 8, 9, 10, 11]
      .map((h) => ({ h, d: deep(...polar(11.7, HOUR_AT(h))) }))
      .sort((a, b) => a.d - b.d)
      .map(({ h }) => index(HOUR_AT(h))),
    dayWindow: planOutline(DAY_WINDOW, DIAL_Z, P, 3),
    dateWindow: planOutline(DATE_WINDOW, DIAL_Z, P, 3),
    dayText: topMatrix([DAY_AT[0], DAY_AT[1] + 0.52], DIAL_Z, P),
    dateText: topMatrix([DATE_AT[0], DATE_AT[1] + 1.05], CYCLOPS_TOP, P),

    bezel: bezelOf(),

    crystal: onTop(circleRing(0, 0, HOLE_R, 96), BEZEL_TOP, P, true),
    cyclops: slabOf(CYCLOPS, BEZEL_TOP, CYCLOPS_TOP - BEZEL_TOP, P, 4, 0.3),
  };
})();

/* ── what changes while it runs ──────────────────────────────────────── */

const HANDS = {
  hour: { z: DIAL_Z + 0.5, shape: [[-1.8, -0.6], [7.6, -0.9], [8.8, 0], [7.6, 0.9], [-1.8, 0.6]] as Plane[] },
  minute: { z: DIAL_Z + 0.8, shape: [[-1.8, -0.5], [11.8, -0.7], [12.8, 0], [11.8, 0.7], [-1.8, 0.5]] as Plane[] },
  seconds: { z: DIAL_Z + 1.1, shape: [[-3.8, -0.2], [13.8, -0.11], [13.8, 0.11], [-3.8, 0.2]] as Plane[] },
};

/** The three hands, for a time in seconds past midnight. */
export function handsAt(t: number) {
  const s = t % 60;
  const m = (t / 60) % 60;
  const h = (t / 3600) % 12;
  const flat = (shape: Plane[], a: number, z: number) => onTop(turned(shape, a), z, P, true);
  return {
    hour: flat(HANDS.hour.shape, (h / 12) * Math.PI * 2, HANDS.hour.z),
    minute: flat(HANDS.minute.shape, (m / 60) * Math.PI * 2, HANDS.minute.z),
    seconds: flat(HANDS.seconds.shape, (s / 60) * Math.PI * 2, HANDS.seconds.z),
    weight: onTop(circleRing(...polar(-2.6, (s / 60) * Math.PI * 2), 0.75, 16), HANDS.seconds.z, P, true),
  };
}

export const PINION = onTop(circleRing(0, 0, 0.9, 16), HANDS.seconds.z, P, true);

const DAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
const SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** What the windows and the readout say for a moment. */
export function faceOf(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return {
    day: DAYS[date.getDay()]!,
    date: String(date.getDate()),
    readout: `${SHORT[date.getDay()]} ${date.getDate()} · ${hh}:${mm}:${ss}`,
  };
}

