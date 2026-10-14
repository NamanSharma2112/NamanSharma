import {
  type Flat,
  type Plane,
  type Point3,
  type Projection,
  type SolidPaths,
  extrude,
  iso,
  onTop,
  pathOf,
} from "@/components/iso/iso-kit";

/* ══ Shearwater SK-4 ══════════════════════════════════════════════════════
   A ground-effect skimmer, and the lane it flies down.

   Drawn with the same kit as the figures on the home page: solids extruded
   from plans, four tones of shading, one hairline outline. Nothing here is a
   sprite — every part is a plan in world units, so the whole aircraft is one
   object the game translates rather than a picture that has to be redrawn. */

export const WIDTH = 740;
export const HEIGHT = 470;

/** The camera. The world origin is low and centre: the skimmer holds that
    spot and the lane comes down to meet it. */
export const P: Projection = { origin: [WIDTH / 2, HEIGHT * 0.79], scale: 1.35 };

/* ── lane coordinates ──────────────────────────────────────────────────
   A 45° isometric lays the world's x and y axes on the two screen
   diagonals, so anything travelling along either one slides off toward a
   corner. A game wants its lane running straight up the screen, and in this
   projection the straight-up direction is the x = y diagonal.

   So nothing in this file is authored in world x/y. Everything is written in
   lane coordinates — `d` away from the camera, `s` to the right — and
   converted here. One function, and the aircraft can be drawn as if it were
   a flat plan on paper while still coming out isometric. */
const K = Math.SQRT1_2;

/** Lane coordinates to world. This is the mapping that puts the lane dead
    up the screen: +d is away from the camera, +s is to the right, and
    neither leans. It is what every moving thing is POSITIONED with. */
const axis = (d: number, s: number): Plane => [(-d + s) * K, (-d - s) * K];

export const at = (d: number, s: number, z: number): Point3 => {
  const [x, y] = axis(d, s);
  return [x, y, z];
};

/* ── and the quarter turn that makes it a drawing ──────────────────────
   Built on the bare lane axis, every face of every solid lies square to
   the camera: you get the top of a thing and almost none of its side, and
   an isometric drawing with no side faces is just a plan with a shadow.

   So the SHAPES are turned a quarter of a right angle off the lane while
   the MOVEMENT stays straight up the screen. Each solid is then seen from
   its front quarter — nose, flank and top all at once, which is what makes
   it read as an object — and the surface lines are turned with it so the
   drawing stays one consistent world. The aircraft is technically flying a
   24° crab, and there is nothing in a field of parallel lines that can
   show it. */
const TILT = 17 * (Math.PI / 180);
const CT = Math.cos(TILT);
const ST = Math.sin(TILT);

export const lane = (d: number, s: number): Plane => axis(d * CT - s * ST, d * ST + s * CT);

/** The same turn, for a mark lying flat on the surface. */
const ground = (d: number, s: number): Point3 => {
  const [x, y] = lane(d, s);
  return [x, y, 0];
};

/** A plan written in lane coordinates, extruded into a solid. */
const solid = (
  plan: readonly (readonly [number, number])[],
  z: number,
  height: number,
  options: { convex?: boolean; bevel?: number } = {},
): SolidPaths => extrude(plan.map(([d, s]) => lane(d, s)), z, height, P, { convex: false, ...options });

/* ── the aircraft, by the part ─────────────────────────────────────────
   A ground-effect machine: it flies in the cushion of air over a surface,
   which is why it sits this low and carries floats on the wingtips.

   Nothing here is an octagon pretending to be a fuselage. A hull, a float
   and a nacelle are all the same thing — a smooth body of revolution seen
   from above — so each is a width curve sampled through a spline and
   stacked in three steps, wide at the waterline and narrowing twice above
   it, which is how a flat extrusion reads as a round section. The wings
   are a planform sampled the same way, and every panel line and rivet row
   on them is generated FROM that planform, so each one ends exactly on the
   edge it should rather than near it. */

const G = 1.32; /* drawn a third larger than it is flown, so it reads */

/** A plan in lane coordinates, scaled and extruded. */
const part = (
  plan: readonly (readonly [number, number])[],
  z: number,
  height: number,
  options: { bevel?: number } = {},
) => solid(plan.map(([d, s]) => [d * G, s * G]), z * G, height * G, options);

/** A seam, rule or panel line lying on a face at height z. Every one runs
    edge to edge: a line that stops in the middle of a surface reads as a
    scratch, which is the fault this whole file is arranged to avoid. */
const mark = (plan: readonly (readonly [number, number])[], z: number, closed = false) =>
  onTop(plan.map(([d, s]) => lane(d * G, s * G)), z * G, P, closed);

/** Rivets and screws, as the dots they are at this size. */
const studs = (plan: readonly (readonly [number, number])[], z: number): Flat[] =>
  plan.map(([d, s]) => {
    const [x, y] = lane(d * G, s * G);
    return iso([x, y, z * G], P);
  });

/** One thing to draw, in the order it is drawn. */
export type Piece =
  | { k: "s"; p: SolidPaths; t: string; lit?: boolean }
  | { k: "l"; d: string; t: string }
  | { k: "d"; at: Flat[] };

/* ── curves ────────────────────────────────────────────────────────────
   One Catmull-Rom through a handful of stations, which is all it takes to
   turn a table of widths into a hull line. */
type Pair = readonly [number, number];

const spline = (stations: readonly Pair[], t: number): number => {
  const n = stations.length;
  if (t <= stations[0]![0]) return stations[0]![1];
  if (t >= stations[n - 1]![0]) return stations[n - 1]![1];
  let i = 0;
  while (i < n - 2 && stations[i + 1]![0] < t) i++;
  const p0 = stations[Math.max(0, i - 1)]!;
  const p1 = stations[i]!;
  const p2 = stations[i + 1]!;
  const p3 = stations[Math.min(n - 1, i + 2)]!;
  const u = (t - p1[0]) / (p2[0] - p1[0] || 1);
  const u2 = u * u;
  const u3 = u2 * u;
  return (
    0.5 *
    (2 * p1[1] +
      (-p0[1] + p2[1]) * u +
      (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u2 +
      (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u3)
  );
};

/** A body: a width curve, sampled down one side and back up the other.
    `pinch` narrows the whole thing, which is how one hull line gives the
    waterline, the crown above it and the spine above that. */
const body = (stations: readonly Pair[], pinch = 1, steps = 26): Pair[] => {
  const d0 = stations[0]![0];
  const d1 = stations[stations.length - 1]![0];
  const right: Pair[] = [];
  const left: Pair[] = [];
  for (let i = 0; i <= steps; i++) {
    const d = d0 + ((d1 - d0) * i) / steps;
    const w = Math.max(0.35, spline(stations, d) * pinch);
    right.push([d, w]);
    left.push([d, -w]);
  }
  return [...right, ...left.reverse()];
};

/* ── the hull ──────────────────────────────────────────────────────────
   Three steps off one line: the widest at the waterline, a crown at three
   quarters, a spine at two fifths. */
const HULL_LINE: Pair[] = [
  [-48, 4.5],
  [-40, 8],
  [-26, 11.4],
  [-6, 12.6],
  [12, 12.4],
  [26, 10.6],
  [38, 7.2],
  [46, 3.6],
  [51, 1.5],
];

/* The crown and the spine stop short of the nose and the tail on their own
   lines, so the hull DOMES: run all three to the same tip and the nose
   keeps full height all the way to a point, which reads as a blade stood
   on edge rather than as the front of a boat. */
const CROWN_LINE: Pair[] = [
  [-43, 5.4],
  [-34, 7],
  [-24, 8.3],
  [-6, 9.3],
  [12, 9],
  [24, 7],
  [32, 3.4],
  [36, 0.9],
];
const SPINE_LINE: Pair[] = [
  [-38, 2.6],
  [-24, 4.3],
  [-6, 5],
  [10, 4.6],
  [20, 2.4],
  [25, 0.8],
];

const HULL = body(HULL_LINE);
const CROWN = body(CROWN_LINE);
const SPINE = body(SPINE_LINE);

/** The canopy, set into the crown rather than parked on it. */
const CANOPY = body(
  [
    [-8, 1.2],
    [2, 6.4],
    [14, 6.8],
    [24, 5.2],
    [31, 1],
  ],
  1,
  14,
);

/* ── the wing ──────────────────────────────────────────────────────────
   Leading and trailing edges as their own curves, so the planform can be
   asked where its edges are at any point across the span — which is what
   the panel lines and rivet rows are built from. */
const LEAD: Pair[] = [
  [9, 16],
  [20, 10],
  [38, 2],
  [52, -4],
  [60, -9],
];
const TRAIL: Pair[] = [
  [9, -21],
  [24, -21.5],
  [42, -20],
  [54, -17],
  [60, -12],
];

const leadAt = (s: number) => spline(LEAD, s);
const trailAt = (s: number) => spline(TRAIL, s);

const wing = (k: 1 | -1): Pair[] => {
  const out: Pair[] = [];
  for (let i = 0; i <= 16; i++) {
    const s = 9 + (51 * i) / 16;
    out.push([leadAt(s), s * k]);
  }
  for (let i = 16; i >= 0; i--) {
    const s = 9 + (51 * i) / 16;
    out.push([trailAt(s), s * k]);
  }
  return out;
};

/** A chordwise panel line: leading edge to trailing edge, both ends on a
    real edge because both come from the planform. */
const rib = (s: number, k: 1 | -1, inset = 0.8): Pair[] => [
  [leadAt(s) - inset, s * k],
  [trailAt(s) + inset, s * k],
];

/** A spanwise line at a fraction of the chord, root to tip. */
const spar = (f: number, k: 1 | -1): Pair[] =>
  Array.from({ length: 13 }, (_, i) => {
    const s = 10 + (48 * i) / 12;
    const l = leadAt(s);
    return [l + (trailAt(s) - l) * f, s * k] as Pair;
  });

/** Rivets along that same line, which is why they follow the sweep. */
const rivets = (f: number, k: 1 | -1, n: number): Pair[] =>
  Array.from({ length: n }, (_, i) => {
    const s = 13 + (42 * i) / (n - 1);
    const l = leadAt(s);
    return [l + (trailAt(s) - l) * f, s * k] as Pair;
  });

const aileron = (k: 1 | -1): Pair[] => {
  const out: Pair[] = [];
  for (let i = 0; i <= 8; i++) {
    const s = 30 + (26 * i) / 8;
    out.push([trailAt(s) + 0.6, s * k]);
  }
  for (let i = 8; i >= 0; i--) {
    const s = 30 + (26 * i) / 8;
    out.push([trailAt(s) + 5.4, s * k]);
  }
  return out;
};

/* ── floats and nacelles, the same way ─────────────────────────────── */
const FLOAT_LINE: Pair[] = [
  [-30, 1.2],
  [-24, 3.6],
  [-10, 5],
  [6, 4.8],
  [13, 3.4],
  [17, 0.9],
];
const NAC_LINE: Pair[] = [
  [-38, 4.4],
  [-33, 6],
  [-20, 6.4],
  [-6, 6.2],
  [-1, 5.2],
];

const offset = (plan: readonly Pair[], s0: number): Pair[] => plan.map(([d, s]) => [d, s + s0]);
const floatAt = (k: 1 | -1, pinch = 1) => offset(body(FLOAT_LINE, pinch, 20), 57 * k);
const nacAt = (k: 1 | -1, pinch = 1) => offset(body(NAC_LINE, pinch, 16), 10.5 * k);
const pod = (d0: number, d1: number, s0: number, s1: number, c: number): Pair[] => [
  [d0 + c, s0],
  [d1 - c, s0],
  [d1, s0 + c],
  [d1, s1 - c],
  [d1 - c, s1],
  [d0 + c, s1],
  [d0, s1 - c],
  [d0, s0 + c],
];
const mirror = (plan: readonly Pair[]): Pair[] => plan.map(([d, s]) => [d, -s]);

/** One wing and everything on it, as a side. */
const wingSide = (k: 1 | -1): Piece[] => [
  { k: "s", p: part(floatAt(k), 1.2, 7), t: "lo" },
  { k: "s", p: part(floatAt(k, 0.66), 8.2, 2.4), t: "lo" },
  { k: "l", d: mark(offset([[-24, 0], [13, 0]], 57 * k), 10.6), t: "faint" },
  { k: "d", at: studs(offset([[-18, 0], [-8, 0], [2, 0], [10, 0]], 57 * k), 10.6) },
  { k: "s", p: part(pod(1, 4, 54.5 * k, 59.5 * k, 0), 8.2, 3.2), t: "lo" },
  { k: "s", p: part(pod(-19, -16, 54.5 * k, 59.5 * k, 0), 8.2, 3.2), t: "lo" },
  { k: "s", p: part(wing(k), 10.8, 2.1), t: "mid" },
  { k: "s", p: part(aileron(k), 10.9, 1.7), t: "lo" },
  { k: "s", p: part(pod(-14, 10, 33.2 * k, 34.3 * k, 0), 12.9, 1.8), t: "lo" },
  { k: "l", d: mark(rib(20, k), 12.9), t: "faint" },
  { k: "l", d: mark(rib(30, k), 12.9), t: "faint" },
  { k: "l", d: mark(rib(40, k), 12.9), t: "faint" },
  { k: "l", d: mark(rib(50, k), 12.9), t: "faint" },
  { k: "l", d: mark(spar(0.3, k), 12.9), t: "faint" },
  { k: "l", d: mark(spar(0.74, k), 12.9), t: "faint" },
  { k: "d", at: studs(rivets(0.14, k, 9), 12.9) },
  { k: "d", at: studs(rivets(0.52, k, 9), 12.9) },
];

const nacelleSide = (k: 1 | -1): Piece[] => [
  { k: "s", p: part(nacAt(k), 14.4, 7.4), t: "mid" },
  { k: "s", p: part(nacAt(k, 0.7), 21.8, 2), t: "mid" },
  { k: "s", p: part(offset(pod(-2.5, 0.5, -5.2, 5.2, 2.2), 10.5 * k), 14, 8.2, { bevel: 0.5 }), t: "hi" },
  { k: "s", p: part(offset(pod(-41.5, -37.5, -4.4, 4.4, 2), 10.5 * k), 15, 6, { bevel: 0.6 }), t: "lo" },
  { k: "l", d: mark(offset([[-33, 0], [-6, 0]], 10.5 * k), 21.8), t: "faint" },
  { k: "d", at: studs(offset([[-28, -3.2], [-28, 3.2], [-12, -3.2], [-12, 3.2]], 10.5 * k), 21.8) },
];

/* Painter's order, far side first. The nose points away from the camera,
   so the far end of this aircraft is its nose and the near end is its
   tail, and the right wing is the far one: draw it before the hull and
   the left wing after, or the hull cuts through a wing it is behind.
   Every line and rivet row follows the part it belongs to. */
/* Painter's order. Two rules decide all of it: the nose points away from
   the camera, so the far end of this aircraft is its nose and the near end
   its tail — the right wing is the far one; and where two parts share the
   same ground, the higher one is drawn later. So the hull's waterline goes
   down between the wings, and everything standing above the wing plane —
   the crown, the spine, the canopy, the engines and the whole tail — comes
   after the near wing. Drawn the other way round, the near wing lies
   across the fuselage and the aircraft reads as two slabs with a lump
   between them, which is exactly what the version before this one did. */
export const PLANE: Piece[] = [
  ...wingSide(1),

  { k: "s", p: part(pod(26, 42, -2.6, 2.6, 1.6), 4.6, 3, { bevel: 0.6 }), t: "lo" },
  { k: "s", p: part(HULL, 7.4, 6.4, { bevel: 1 }), t: "hi" },

  ...wingSide(-1),

  { k: "s", p: part(CROWN, 13.8, 3.6, { bevel: 0.8 }), t: "hi" },
  { k: "s", p: part(SPINE, 17.4, 1.8, { bevel: 0.5 }), t: "hi" },
  { k: "l", d: mark([[-36, 0], [24, 0]], 19.2), t: "faint" },
  { k: "l", d: mark([[-24, -4.2], [-24, 4.2]], 19.2), t: "faint" },
  { k: "l", d: mark([[-6, -5], [-6, 5]], 19.2), t: "faint" },
  { k: "l", d: mark([[10, -4.5], [10, 4.5]], 19.2), t: "faint" },
  { k: "d", at: studs([[-24, 3.2], [-24, -3.2], [-6, 3.8], [-6, -3.8], [10, 3.4], [10, -3.4]], 19.2) },
  { k: "s", p: part(CANOPY, 17.4, 3.4, { bevel: 0.7 }), t: "hi", lit: true },
  { k: "s", p: part(pod(5, 9, -0.7, 0.7, 0), 20.8, 5.4), t: "mid" },

  ...nacelleSide(1),
  ...nacelleSide(-1),

  { k: "s", p: part(body([[-46, 1], [-40, 2.3], [-31, 2.4], [-26, 0.9]], 1, 12), 17.5, 13), t: "mid" },
  { k: "s", p: part(pod(-45, -33, -19, 19, 3.2), 30.5, 2, { bevel: 0.5 }), t: "mid" },
  { k: "s", p: part(pod(-47.5, -44.5, -18, 18, 1.2), 30.7, 1.6), t: "lo" },
  { k: "l", d: mark([[-44, -19], [-44, 19]], 32.5), t: "faint" },
  { k: "l", d: mark([[-44, 0], [-34, 0]], 32.5), t: "faint" },
];

/** The shadow it carries on the water. A machine this low is mostly
    recognised by it, so it is the hull's own plan rather than a blob. */
export const SHADOW = pathOf(
  HULL.map(([d, s]) => iso(ground(d * 1.12 * G, s * 2.4 * G), P)),
  true,
);

/** The cushion under it: contour rings on the surface, opening outward one
    after another. Six, because the thing they stand for is a pressure
    field and a pressure field does not have three steps in it. */
export const RIPPLES = [26, 38, 50, 62, 74, 86].map((r) =>
  pathOf(
    Array.from({ length: 48 }, (_, i) => {
      const a = (i / 48) * Math.PI * 2;
      const wob = 1 + Math.sin(a * 3 + r * 0.12) * 0.045;
      return iso(ground(Math.cos(a) * r * wob, Math.sin(a) * r * 1.55 * wob), P);
    }),
    true,
  ),
);

/* ── what is in the lane ───────────────────────────────────────────────
   Two things to miss and one to hit: a marker pylon on a bolted flange, a
   buoy with a lamp on a mast, and a drone whose lit hub is what the guns
   are for. Each is built once at the lane origin and moved by the game. */

export const PYLON: Piece[] = [
  { k: "s", p: part(pod(-13, 13, -13, 13, 4), 0, 2.6, { bevel: 0.8 }), t: "lo" },
  { k: "d", at: studs([[9, 9], [9, -9], [-9, 9], [-9, -9]], 2.6) },
  { k: "s", p: part(body([[-8, 7.6], [0, 8], [8, 7.6]], 1, 14), 2.6, 44, { bevel: 1.2 }), t: "mid" },
  { k: "s", p: part(pod(-9.6, 9.6, -9.6, 9.6, 3.5), 24, 3, { bevel: 0.6 }), t: "lo" },
  { k: "l", d: mark([[-9.6, 0], [9.6, 0]], 27), t: "faint" },
  { k: "s", p: part(pod(-11, 11, -11, 11, 4), 46.6, 4.4, { bevel: 1 }), t: "hi" },
];

export const BUOY: Piece[] = [
  { k: "s", p: part(body([[-12, 11], [0, 12], [12, 11]], 1, 16), 0, 10, { bevel: 2 }), t: "mid" },
  { k: "s", p: part(pod(-11.8, 11.8, -11.8, 11.8, 5), 6.4, 1.8, { bevel: 0.5 }), t: "lo" },
  { k: "d", at: studs([[7, 0], [-7, 0], [0, 7], [0, -7]], 10) },
  { k: "s", p: part(pod(-2, 2, -2, 2, 0), 10, 14), t: "mid" },
  { k: "s", p: part(pod(-3.4, 3.4, -3.4, 3.4, 1.6), 24, 3.6, { bevel: 0.8 }), t: "hi" },
];

export const DRONE: Piece[] = [
  { k: "s", p: part(pod(-11, 11, -6.5, -4.5, 0), 17, 2), t: "lo" },
  { k: "s", p: part(pod(-11, 11, 4.5, 6.5, 0), 17, 2), t: "lo" },
  { k: "s", p: part(body([[-14, 5], [-6, 7], [6, 7], [14, 5]], 1, 16), 19, 7, { bevel: 1.2 }), t: "hi" },
  { k: "l", d: mark([[-10, 0], [10, 0]], 26), t: "faint" },
  { k: "s", p: part(pod(-2.5, 2.5, 6, 9, 0), 24.6, 1.6), t: "lo" },
  { k: "s", p: part(pod(-2.5, 2.5, -9, -6, 0), 24.6, 1.6), t: "lo" },
  { k: "s", p: part(body([[-6, 1.4], [0, 5], [6, 1.4]], 1, 12).map(([d, x]) => [d, x + 14] as Pair), 26.2, 1.2), t: "lo" },
  { k: "s", p: part(mirror(body([[-6, 1.4], [0, 5], [6, 1.4]], 1, 12).map(([d, x]) => [d, x + 14] as Pair)), 26.2, 1.2), t: "lo" },
  { k: "s", p: part(pod(-4, 4, -4, 4, 1.6), 26, 3, { bevel: 0.6 }), t: "hi", lit: true },
];

/* ── the surface ───────────────────────────────────────────────────────
   One line across the lane, drawn once and then translated to wherever it
   has scrolled to. The rails down either side are static and do the job a
   horizon would: they tell you the lane is straight and you are not. */
export const CROSS = pathOf([iso(ground(0, -150), P), iso(ground(0, 150), P)]);

/* The rails are the edge of the playfield, so they are the one thing drawn
   on the bare axis: they have to run straight up the screen. */
export const RAILS = [-135, 135].map((s) =>
  pathOf([iso(at(-90, s, 0), P), iso(at(470, s, 0), P)]),
);

/** A tracer: a short dash lying along the lane, pointing where it is going. */
export const TRACER = pathOf([iso(at(0, 0, 0), P), iso(at(19, 0, 0), P)]);

/** How far across the lane anything may be. */
export const EDGE = 105;
