import {
  type Plane,
  type Point3,
  type Projection,
  type SolidPaths,
  extrude,
  iso,
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

/** A rounded rectangle in lane coordinates, as an octagon. Cheaper to write
    than a plan object and it is the shape most of this aircraft is made of. */
const pod = (d0: number, d1: number, s0: number, s1: number, c: number) =>
  [
    [d0 + c, s0],
    [d1 - c, s0],
    [d1, s0 + c],
    [d1, s1 - c],
    [d1 - c, s1],
    [d0 + c, s1],
    [d0, s1 - c],
    [d0, s0 + c],
  ] as const;

/* ── the aircraft, nose first ──────────────────────────────────────────
   Eleven solids. The hull tapers to a point at the nose and is cut square
   at the tail where the engines sit; the wings sweep back from the roots to
   tip floats that hang below them, which is what makes it a skimmer rather
   than an aeroplane — it flies in the cushion of air over the surface, and
   the floats are what it would land on. */

const HULL = [
  [50, 0],
  [41, -6],
  [14, -12],
  [-16, -12],
  [-39, -7],
  [-47, -4],
  [-47, 4],
  [-39, 7],
  [-16, 12],
  [14, 12],
  [41, 6],
] as const;

const CANOPY = [
  [28, 0],
  [21, -5],
  [2, -6],
  [-7, -5],
  [-7, 5],
  [2, 6],
  [21, 5],
] as const;

const wing = (side: 1 | -1) =>
  [
    [15, 9 * side],
    [-3, 59 * side],
    [-19, 59 * side],
    [-21, 9 * side],
  ] as const;

const float = (side: 1 | -1) =>
  side === 1 ? pod(-27, 11, 52, 62, 4) : pod(-27, 11, -62, -52, 4);

const nacelle = (side: 1 | -1) =>
  side === 1 ? pod(-35, -2, 9, 21, 4) : pod(-35, -2, -21, -9, 4);

/* The aircraft is drawn a third larger than it is flown: it has to read at
   the size of a thumbnail against a pylon the size of a thumb, and a
   skimmer with a 120-unit span would be a smudge. One factor, applied to
   every plan and every height, so the proportions are untouched. */
const G = 1.32;

const part = (
  plan: readonly (readonly [number, number])[],
  z: number,
  height: number,
  options: { bevel?: number } = {},
) => solid(plan.map(([d, s]) => [d * G, s * G]), z * G, height * G, options);

export const PLANE = {
  hull: part(HULL, 8, 10.5, { bevel: 1.2 }),
  canopy: part(CANOPY, 18.5, 4, { bevel: 0.8 }),
  wingR: part(wing(1), 11, 3),
  wingL: part(wing(-1), 11, 3),
  floatR: part(float(1), 1.5, 8, { bevel: 1 }),
  floatL: part(float(-1), 1.5, 8, { bevel: 1 }),
  nacelleR: part(nacelle(1), 11.5, 9, { bevel: 1.4 }),
  nacelleL: part(nacelle(-1), 11.5, 9, { bevel: 1.4 }),
  fin: part(pod(-46, -26, -2.2, 2.2, 0), 17, 19),
  tailplane: part(pod(-45, -33, -19, 19, 3), 32, 2.5),
};

/** The shadow it carries on the water: the hull's own plan, a little larger,
    flat on the surface. A skimmer this low is mostly recognised by it. */
export const SHADOW = pathOf(
  HULL.map(([d, s]) => iso(ground(d * 1.12 * G, s * 1.6 * G), P)),
  true,
);

/** The cushion under it — three rings on the surface, biggest last so the
    CSS can open them outward one after another. */
export const RIPPLES = [30, 48, 68].map((r) =>
  pathOf(
    Array.from({ length: 36 }, (_, i) => {
      const a = (i / 36) * Math.PI * 2;
      return iso(ground(Math.cos(a) * r, Math.sin(a) * r * 1.5), P);
    }),
    true,
  ),
);

/* ── what is in the lane ───────────────────────────────────────────────
   Two things to miss and one thing to hit: a tall marker pylon, a low
   buoy, and a drone that the guns are for. All three are drawn at the lane
   origin and moved by the game, so each is built exactly once. */

export const PYLON = {
  post: solid(pod(-8, 8, -8, 8, 3), 0, 52, { bevel: 1.5 }),
  cap: solid(pod(-11, 11, -11, 11, 4), 52, 5, { bevel: 1 }),
};

export const BUOY = {
  body: solid(pod(-11, 11, -11, 11, 5), 0, 15, { bevel: 2 }),
  mast: solid(pod(-2, 2, -2, 2, 0), 15, 17),
};

export const DRONE = {
  body: solid(pod(-13, 13, -7, 7, 4), 20, 9, { bevel: 1.2 }),
  rotorR: solid(pod(-4, 4, 7, 19, 3), 29, 2),
  rotorL: solid(pod(-4, 4, -19, -7, 3), 29, 2),
};

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
