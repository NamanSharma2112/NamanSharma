import {
  boxCorners,
  circleRing,
  cylinder,
  fitProjection,
  groundSlide,
  haloOf,
  iso,
  lineOnTop,
  onTop,
  opening,
  pathOf,
  pointsAt,
  ring,
  sideRing,
  sideSeam,
  slabOf,
  towardViewer,
  type Plan,
  type Plane,
  type Point3,
  type SolidPaths,
} from "@/components/iso/iso-kit";

/* ── the model ───────────────────────────────────────────────────────────
   A flagship three-fan graphics card lying fans-up, at about a third of
   full size (one unit is roughly 2.8 mm). From the bottom: a backplate;
   the board, with the GPU package in the middle, twelve memory packages
   wired round it, the power stages, chokes and capacitors that feed it,
   the 16-pin power connector and the display connectors behind the
   bracket; a fin stack with its heat pipes and base plate; three ring
   fans; and the shroud they sit in, with a light bar along its edge. No
   maker's name or mark is drawn anywhere on it.

   ── THE FANS ───────────────────────────────────────────────────────────
   Each fan sits in a round opening in the shroud, 2.5 below its top,
   worked out the same way as a watch bezel's: the shroud's near rim hides
   the near edge of each fan and its far inner wall shows as a crescent.
   Through the gaps between the blades the fin stack shows.

   ── TAKING IT APART ────────────────────────────────────────────────────
   Straight up, as it is assembled. The cooler rises well clear of the
   board, because the board is the point of taking it apart: lifted one
   gap, the fin stack would sit on the GPU and hide everything round it.

   The numbers the readout gives are a worked example rather than any
   card's measurements: the fans hold still below 30% load, as cards with
   a zero-rpm mode do, then run from 1,000 to 3,000 rpm. */

export const WIDTH = 600;
export const HEIGHT = 540;

export const GAP = 24;
export const LEVEL = { back: 0, board: 1, sink: 5, fans: 6.6, shroud: 8.2 };
const SPARE = (LEVEL.shroud * GAP) / 2;

const BACK: Plan = { x: -60, y: -23, w: 117, d: 46, r: 2 };
const BACK_TOP = 1.2;
const PCB: Plan = { x: -59.5, y: -22.5, w: 116, d: 45, r: 1 };
const PCB_TOP = 2.6;

const SINK: Plan = { x: -57, y: -21, w: 105, d: 42, r: 1 };
const SINK_TOP = 17;
const SINK_END = SINK.x + SINK.w;

const SHROUD: Plan = { x: -60, y: -23, w: 117, d: 46, r: 4 };
const SHROUD_TOP = 23;

const BRACKET: Plan = { x: 57.4, y: -26, w: 1.2, d: 52, r: 0.3 };
const BRACKET_TOP = 24.5;
const FACE = BRACKET.x + BRACKET.w;

export const FAN_X = [-39.5, -1.5, 36.5];
const HOLE_R = 18.4;
const TIP_R = 17.4;
const HUB_R = 5.2;
const BLADE_Z = 20.5;
const BLADES = 11;

const P0 = fitProjection(
  [...boxCorners(SHROUD, 0, SHROUD_TOP), [FACE, -26, BRACKET_TOP], [FACE, 26, BRACKET_TOP], [FACE, -26, 0], [FACE, 26, 0]],
  WIDTH,
  HEIGHT - SPARE * 2,
  { pad: 10, azimuth: 60 },
);
export const P = { ...P0, origin: [P0.origin[0], P0.origin[1] + SPARE] as [number, number] };

const toward = towardViewer(P);
const deep = (x: number, y: number) => x * toward[0] + y * toward[1];
const centre = (p: Plan) => deep(p.x + p.w / 2, p.y + p.d / 2);
const farToNear = <T extends { at: number }>(list: T[]) => [...list].sort((a, b) => a.at - b.at);

/* ── faces ───────────────────────────────────────────────────────────── */

/** A closed outline on a vertical face: `x` fixed (the bracket) or `y`
    fixed (the power connector), points given as (along, up). */
const onFaceX = (x: number, pts: Plane[]) => pathOf(pts.map(([y, z]) => iso([x, y, z], P)), true);
const onFaceY = (y: number, pts: Plane[]) => pathOf(pts.map(([x, z]) => iso([x, y, z], P)), true);

const chamfered = (u: number, v: number, w: number, h: number, c: number): Plane[] => [
  [u + c, v],
  [u + w - c, v],
  [u + w, v + c],
  [u + w, v + h - c],
  [u + w - c, v + h],
  [u + c, v + h],
  [u, v + h - c],
  [u, v + c],
];

/* ── the board ───────────────────────────────────────────────────────── */

const GPU: Plane = [8, -1];
const SUBSTRATE: Plan = { x: GPU[0] - 8.5, y: GPU[1] - 8.5, w: 17, d: 17, r: 0.6 };
const DIE: Plan = { x: GPU[0] - 5, y: GPU[1] - 4.7, w: 10, d: 9.4, r: 0.3 };

/* Twelve memory packages on four sides, two units clear of the
   substrate, each wired to it by a pair of traces. A trace meets a
   package's near faces at their foot, which is drawn; toward a far face
   it stops where it passes under the package's top edge on screen, which
   is short of the foot by the package's height slid along the ground. */
const SUB_H = 0.5;
const MEM_H = 0.9;
const behind = (h: number, axis: 0 | 1) => h * groundSlide(P) * toward[axis];
function memory() {
  const chips: { plan: Plan; traces: [Plane, Plane][] }[] = [];
  const near = 2;
  const [gx, gy] = GPU;
  const s = SUBSTRATE.w / 2;
  for (const i of [0, 1, 2]) {
    const along = -8.1 + i * 5.6;
    /* the left and right columns: 4.2 across, 5 along */
    for (const side of [-1, 1]) {
      const x = side < 0 ? gx - s - near - 4.2 : gx + s + near;
      const yc = gy + along + 2.5;
      const from = side < 0 ? gx - s - behind(SUB_H, 0) : gx + s;
      const to = side < 0 ? x + 4.2 : x - behind(MEM_H, 0);
      chips.push({
        plan: { x, y: gy + along, w: 4.2, d: 5, r: 0.3 },
        traces: [-1.2, 1.2].map((o) => [[from, yc + o], [to, yc + o]] as [Plane, Plane]),
      });
    }
    /* the far and near rows: 5 along, 4.2 across */
    for (const side of [-1, 1]) {
      const y = side < 0 ? gy - s - near - 4.2 : gy + s + near;
      const xc = gx + along + 2.5;
      const from = side < 0 ? gy - s - behind(SUB_H, 1) : gy + s;
      const to = side < 0 ? y + 4.2 : y - behind(MEM_H, 1);
      chips.push({
        plan: { x: gx + along, y, w: 5, d: 4.2, r: 0.3 },
        traces: [-1.2, 1.2].map((o) => [[xc + o, from], [xc + o, to]] as [Plane, Plane]),
      });
    }
  }
  return chips;
}

/* The power stages: two columns of chokes, a power stage beside each,
   and a bank of polymer capacitors behind them, all on the far side of
   the GPU from the bracket. */
function power() {
  const parts: { at: number; paths: SolidPaths }[] = [];
  for (let row = 0; row < 8; row++) {
    const y = -19 + row * 4.6;
    for (const x of [-21, -16.6]) {
      const choke: Plan = { x, y, w: 3.6, d: 3.6, r: 0.4 };
      parts.push({ at: centre(choke), paths: slabOf(choke, PCB_TOP, 2.6, P, 3, 0.2) });
    }
    const stage: Plan = { x: -25, y: y + 0.4, w: 2.6, d: 2.8, r: 0.2 };
    parts.push({ at: centre(stage), paths: slabOf(stage, PCB_TOP, 0.6, P, 2) });
    for (const x of [-29.4, -32.2]) {
      parts.push({ at: deep(x, y + 1.8), paths: cylinder(x, y + 1.8, 1.1, PCB_TOP, 2.8, P, 16, 0.2) });
    }
  }
  return farToNear(parts).map((p) => p.paths);
}

/** Every static path, built once when the module loads. */
export const ART = (() => {
  /* The two runs of contacts either side of the key notch. */
  const tabs: Plan[] = [
    { x: 4, y: -26, w: 11, d: 3.6, r: 0.5 },
    { x: 16.4, y: -26, w: 30, d: 3.6, r: 0.5 },
  ];
  const fingers: string[] = [];
  for (const t of tabs) for (let x = t.x + 1; x < t.x + t.w - 0.6; x += 1) fingers.push(lineOnTop([x, t.y], [x, PCB.y + 0.05], PCB_TOP, P));

  const mem = memory();
  const memChips = farToNear(mem.map((m) => ({ at: centre(m.plan), paths: slabOf(m.plan, PCB_TOP, MEM_H, P, 3) }))).map((m) => m.paths);
  const traces = mem.flatMap((m) => m.traces.map(([a, b]) => lineOnTop(a, b, PCB_TOP, P))).join("");

  /* Decoupling parts round the package, and on it round the die. */
  const around = (plan: Plan, by: number, step: number, z: number) => {
    const out: Point3[] = [];
    const [x0, y0, x1, y1] = [plan.x - by, plan.y - by, plan.x + plan.w + by, plan.y + plan.d + by];
    for (let x = x0; x <= x1 + 1e-6; x += step) out.push([x, y0, z], [x, y1, z]);
    for (let y = y0 + step; y < y1 - 1e-6; y += step) out.push([x0, y, z], [x1, y, z]);
    return out;
  };
  const smd = pointsAt([...around(SUBSTRATE, 0.9, 1.2, PCB_TOP), ...around(DIE, 1.3, 1.1, PCB_TOP + 0.5)], P);

  /* The cooler's four spring screws, at the corners of the package. */
  const screws: Plane[] = [
    [GPU[0] - 12.5, GPU[1] - 12.5],
    [GPU[0] + 12.5, GPU[1] - 12.5],
    [GPU[0] - 12.5, GPU[1] + 12.5],
    [GPU[0] + 12.5, GPU[1] + 12.5],
  ];

  /* Display connectors on the board behind the bracket: three DP and
     one HDMI, each opening in the bracket in front of its housing. */
  const PORTS: [number, number][] = [
    [-21, 8],
    [-11, 8],
    [-1, 8],
    [9.5, 7],
  ];
  const housings = farToNear(
    PORTS.map(([y, w]) => {
      const plan: Plan = { x: SINK_END + 1.5, y, w: BRACKET.x - SINK_END - 1.5, d: w, r: 0.3 };
      return { at: centre(plan), paths: slabOf(plan, PCB_TOP, 4.4, P, 2) };
    }),
  ).map((h) => h.paths);

  const PLUG: Plan = { x: -6, y: 21, w: 12, d: 2.6, r: 0.4 };
  const plugFace = PLUG.y + PLUG.d;
  const pins: string[] = [];
  for (let i = 0; i < 6; i++) {
    for (const z of [4, 6.4]) pins.push(onFaceY(plugFace, chamfered(PLUG.x + 0.9 + i * 1.8, z, 1.2, 1.2, 0.2)));
  }

  /* Fins are plates across the card, so their edges show as lines on the
     long near face above the base plate, and on the top. */
  const finsSide: string[] = [];
  const finsTop: string[] = [];
  for (let x = SINK.x + 1.5; x < SINK_END - 1; x += 1.5) {
    finsSide.push(pathOf([iso([x, SINK.y + SINK.d, 4.4], P), iso([x, SINK.y + SINK.d, SINK_TOP], P)]));
    finsTop.push(lineOnTop([x, SINK.y], [x, SINK.y + SINK.d], SINK_TOP, P));
  }
  /* Six heat pipes run the length of the stack; their ends show on the
     face toward the bracket. */
  const pipes = [-15, -9, -3, 3, 9, 15].map((y, i) => sideRing([SINK_END, y, i % 2 ? 9 : 6.6], 1.3, "x", P, 18)).join("");

  const shell = slabOf(SHROUD, 17, SHROUD_TOP - 17, P, 8, 0.5);
  const cuts = FAN_X.map((x) => opening(x, 0, HOLE_R, SHROUD_TOP, SHROUD_TOP - BLADE_Z, P));
  const holes = cuts.map((c) => c.hole).join("");

  /* The light bar runs the near long edge, ending where the corners
     start to round so it meets the outline on both. */
  const bar = 2.5;
  const reach = Math.sqrt(SHROUD.r * SHROUD.r - (SHROUD.r - bar) ** 2);
  const barY = SHROUD.y + SHROUD.d - bar;

  return {
    halo: haloOf(BACK, 0, 1, P),
    backplate: slabOf(BACK, 0, BACK_TOP, P, 4, 0.2),

    tabs: tabs.map((t) => slabOf(t, BACK_TOP, PCB_TOP - BACK_TOP, P, 3)),
    fingers: fingers.join(""),
    pcb: slabOf(PCB, BACK_TOP, PCB_TOP - BACK_TOP, P, 4),
    traces,
    smd,
    screwRings: screws.map(([x, y]) => ring(x, y, 1.4, PCB_TOP, P, 16)).join(""),
    screws: pointsAt(screws.map(([x, y]) => [x, y, PCB_TOP] as Point3), P),

    power: power(),
    substrate: slabOf(SUBSTRATE, PCB_TOP, SUB_H, P, 3),
    die: slabOf(DIE, PCB_TOP + SUB_H, 0.7, P, 3),
    memory: memChips,
    housings,
    plug: slabOf(PLUG, PCB_TOP, 6.9, P, 3, 0.2),
    pins: pins.join(""),

    sink: slabOf(SINK, PCB_TOP, SINK_TOP - PCB_TOP, P, 4),
    sinkBase: sideSeam(SINK, 4.4, P, 4),
    finsSide: finsSide.join(""),
    finsTop: finsTop.join(""),
    pipes,

    /* The shroud is a slab with three openings cut through its fill and
       top, so the fans and the fins under them show through. */
    shroud: { ...shell, fill: shell.fill + holes, top: shell.top + holes },
    walls: cuts.map((c) => c.wall),
    feet: cuts.map((c) => c.foot).join(""),
    holes,
    lightBar: lineOnTop(
      [SHROUD.x + SHROUD.r - reach, barY],
      [SHROUD.x + SHROUD.w - SHROUD.r + reach, barY],
      SHROUD_TOP,
      P,
    ),
    shroudScrews: pointsAt(
      ([[-57, -20], [-57, 20], [54, -20], [54, 20]] as Plane[]).map(([x, y]) => [x, y, SHROUD_TOP] as Point3),
      P,
    ),

    bracket: slabOf(BRACKET, 0, BRACKET_TOP, P, 2),
    ports: PORTS.map(([y, w], i) => onFaceX(FACE, chamfered(y, 3.2, w, 3.2, i === 3 ? 0.9 : 0.5))).join(""),
    vents: Array.from({ length: 7 }, (_, i) => onFaceX(FACE, chamfered(-21 + i * 6.2, 10, 4.6, 10.5, 0.8))).join(""),
  };
})();

/* ── what changes while it runs ──────────────────────────────────────── */

/** One fan's blades at a turn, as one path: each blade swept back from
    the hub to the tip ring, and the middle fan's mirrored, because it
    turns the other way to cut the turbulence between its neighbours. */
export function bladesAt(fan: number, turn: number) {
  const cx = FAN_X[fan]!;
  const hand = fan === 1 ? -1 : 1;
  const out: string[] = [];
  for (let b = 0; b < BLADES; b++) {
    const a0 = turn * hand * Math.PI * 2 + (b / BLADES) * Math.PI * 2;
    const lead: Plane[] = [];
    const trail: Plane[] = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      const r = HUB_R - 0.2 + (TIP_R - HUB_R + 0.2) * t;
      const c = a0 + hand * 0.5 * t;
      const w = 0.17 + 0.07 * t;
      lead.push([cx + Math.cos(c + w) * r, Math.sin(c + w) * r]);
      trail.push([cx + Math.cos(c - w) * r, Math.sin(c - w) * r]);
    }
    out.push(onTop([...lead, ...trail.reverse()], BLADE_Z, P, true));
  }
  return out.join("");
}

/** The parts of each fan that do not turn. */
export const FANS = FAN_X.map((x) => ({
  tip: ring(x, 0, TIP_R, BLADE_Z, P, 72),
  hub: cylinder(x, 0, HUB_R, BLADE_Z - 1.5, 2.6, P, 32, 0.3),
  cap: onTop(circleRing(x, 0, 2.8, 24), BLADE_Z + 1.1, P, true),
}));

/** Load, 0..1, to what the card does with it. */
export function stateOf(load: number) {
  const rpm = load < 0.3 ? 0 : Math.round((1000 + ((load - 0.3) / 0.7) * 2000) / 10) * 10;
  const temp = Math.round(36 + load * 38);
  const pct = Math.round(load * 100);
  return {
    rpm,
    readout: rpm ? `Load ${pct}% · ${rpm.toLocaleString("en-US")} rpm · ${temp} °C` : `Load ${pct}% · fans stopped · ${temp} °C`,
  };
}
