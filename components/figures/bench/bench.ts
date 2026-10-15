import {
  boxCorners,
  circleRing,
  corners,
  coil,
  cylinder,
  dotGrid,
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
  slabOf,
  topTicks,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";

/* ── what it says ────────────────────────────────────────────────────────
   One piece travels the bench and comes off finished. It is drawn on, cut,
   pressed and measured, and nothing leaves a station until that station has
   done its work. The stages are the ones named on the front page — design
   and build are the same job, and the last word is whether it feels right —
   so the fourth station is a gauge rather than a stamp: the piece is not
   done when it is made, it is done when it measures true. */

export const STAGES = [
  { at: -112, name: "Draw", says: "scribing the layout" },
  { at: -38, name: "Cut", says: "taking the profile" },
  { at: 38, name: "Press", says: "setting the detail" },
  { at: 112, name: "Gauge", says: "checking it reads true" },
] as const;

export const TRAVEL = { from: -168, to: 170 };
export const CYCLE = STAGES.length * 4.2 + 5.4;

/** Where the carriage is, and what is happening, at this moment of a cycle. */
export function stepAt(clock: number) {
  const t = clock % CYCLE;
  for (let i = 0; i < STAGES.length; i += 1) {
    const start = i * 4.2;
    if (t < start + 2.0) {
      // travelling to station i
      const from = i === 0 ? TRAVEL.from : STAGES[i - 1].at;
      const k = Math.min(1, Math.max(0, (t - start) / 2.0));
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      return { x: from + (STAGES[i].at - from) * e, tool: -1, bite: 0, done: i, moving: true };
    }
    if (t < start + 4.2) {
      const k = (t - start - 2.0) / 2.2;
      // down, hold, up
      const bite = k < 0.3 ? k / 0.3 : k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3;
      return { x: STAGES[i].at, tool: i, bite, done: i + (k > 0.5 ? 1 : 0), moving: false };
    }
  }
  const k = Math.min(1, (t - STAGES.length * 4.2) / 3.4);
  const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
  return {
    x: STAGES[STAGES.length - 1].at + (TRAVEL.to - STAGES[STAGES.length - 1].at) * e,
    tool: -1,
    bite: 0,
    done: STAGES.length,
    moving: true,
  };
}

export const readoutOf = (s: ReturnType<typeof stepAt>) =>
  s.tool >= 0
    ? `${STAGES[s.tool].name.toLowerCase()} · ${STAGES[s.tool].says}`
    : s.done >= STAGES.length
      ? "done · 4 of 4 passes"
      : `moving · ${s.done} of ${STAGES.length} passes`;

/* ── the world ───────────────────────────────────────────────────────── */

export const WIDTH = 760;
export const HEIGHT = 318;

export const BENCH: Plan = { x: -215, y: -88, w: 430, d: 176, r: 11 };
const BENCH_Z = -12;
const BENCH_H = 12;
const FOOT_H = 6;

const RAIL_Y = [-15, 15];
const RAIL_Z = 0;
const RAIL_H = 4;

export const CAR: Plan = { x: -27, y: -25, w: 54, d: 50, r: 4 };
const CAR_Z = RAIL_Z + RAIL_H;
const CAR_H = 6;
export const PIECE_Z = CAR_Z + CAR_H;
const PIECE: Plan = { x: -17, y: -14, w: 34, d: 28, r: 2 };
const PIECE_H = 6;
export const PIECE_TOP = PIECE_Z + PIECE_H;

const POST_Y = [-38, 32];
const POST_W = 10;
const POST_D = 10;

const RACK: Plan = { x: -168, y: -78, w: 124, d: 16, r: 2 };
const TRAY: Plan = { x: -156, y: 50, w: 118, d: 26, r: 3 };
const BOX: Plan = { x: 150, y: -54, w: 52, d: 62, r: 4 };
const BOX_H = 44;
const OUT: Plan = { x: 150, y: 16, w: 54, d: 48, r: 4 };

export const P = fitProjection(
  [
    ...boxCorners(BENCH, BENCH_Z - FOOT_H, 0),
    ...boxCorners({ x: -130, y: POST_Y[0], w: 250, d: 80, r: 0 }, 0, 78),
    ...boxCorners(BOX, 0, BOX_H),
  ],
  WIDTH,
  HEIGHT,
  { pad: 26, azimuth: 54 },
);

const byDepth = (points: Plane[]) =>
  [...points].sort((a, b) => iso([a[0], a[1], 0], P)[1] - iso([b[0], b[1], 0], P)[1]);

const n2 = (v: number) => Math.round(v * 10) / 10;
export const atPt = (p: Point3): Flat => iso(p, P);
export const faceLine = (a: Point3, b: Point3) => {
  const [ax, ay] = atPt(a);
  const [bx, by] = atPt(b);
  return `M${n2(ax)} ${n2(ay)}L${n2(bx)} ${n2(by)}`;
};

/* ── a gantry: two posts, a beam, and whatever hangs under it ────────── */

const gantry = (x: number, height: number, beamH = 9) => ({
  feet: POST_Y.map((y) =>
    slabOf({ x: x - POST_W / 2 - 3, y: y - 3, w: POST_W + 6, d: POST_D + 6, r: 2 }, 0, 3, P, 3, 0.4),
  ),
  posts: POST_Y.map((y) =>
    slabOf({ x: x - POST_W / 2, y, w: POST_W, d: POST_D, r: 2 }, 3, height - 3, P, 3, 0.6),
  ),
  seams: POST_Y.map((y) =>
    lineOnTop([x - POST_W / 2 + 1.5, y + POST_D], [x + POST_W / 2 - 1.5, y + POST_D], height - 12, P),
  ),
  beam: slabOf(
    { x: x - POST_W / 2 - 2, y: POST_Y[0] - 2, w: POST_W + 4, d: POST_Y[1] - POST_Y[0] + POST_D + 4, r: 2 },
    height,
    beamH,
    P,
    3,
    0.6,
  ),
  bolts: pointsAt(
    POST_Y.flatMap((y) => [
      [x - 3, y + 2, height + beamH],
      [x + 3, y + POST_D - 2, height + beamH],
    ]) as Point3[],
    P,
  ),
});

/* ── the parts ───────────────────────────────────────────────────────── */

export const ART = (() => {
  const LABEL: Plan = { x: BENCH.x + 18, y: BENCH.y + BENCH.d - 26, w: 56, d: 18, r: 2 };
  const RULER: Plan = { x: -60, y: BENCH.y + BENCH.d - 9, w: 180, d: 6, r: 1 };

  return {
    halo: haloOf(BENCH, BENCH_Z - FOOT_H, 13, P),
    feet: byDepth(corners(BENCH, 24)).map(([x, y]) => ({
      flange: cylinder(x, y, 8, BENCH_Z - FOOT_H, 1.8, P, 24),
      foot: cylinder(x, y, 6, BENCH_Z - FOOT_H + 1.8, FOOT_H - 1.8, P, 24),
    })),
    bench: slabOf(BENCH, BENCH_Z, BENCH_H, P, 11, 1.6),
    groove: planOutline(insetPlan(BENCH, 6), 0, P),
    screwRings: corners(BENCH, 11).map(([x, y]) => ring(x, y, 2.3, 0, P, 16)),
    screws: pointsAt(corners(BENCH, 11).map(([x, y]) => [x, y, 0] as Point3), P),
    grid: dotGrid(BENCH.x + 96, BENCH.y + 26, 9, 3, 9, 0, P),

    label: slabOf(LABEL, 0, 0.8, P, 3),
    labelInset: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
    labelRules: [40, 29, 34].map((w, i) =>
      lineOnTop([LABEL.x + 5, LABEL.y + 4.5 + i * 4.5], [LABEL.x + 5 + w, LABEL.y + 4.5 + i * 4.5], 0.8, P),
    ),
    labelScrews: pointsAt(
      [
        [LABEL.x + LABEL.w - 4, LABEL.y + 4, 0.8],
        [LABEL.x + LABEL.w - 4, LABEL.y + LABEL.d - 4, 0.8],
      ] as Point3[],
      P,
    ),
    ruler: slabOf(RULER, 0, 0.6, P, 3),
    ticks: topTicks(RULER.x + 5, RULER.x + RULER.w - 5, 5, 5, RULER.y + 0.8, 0.6, [2, 3.8], P),

    /* The rail the work runs on, with a stop at each end. */
    rails: RAIL_Y.map((y) => slabOf({ x: -182, y: y - 3, w: 364, d: 6, r: 1.4 }, RAIL_Z, RAIL_H, P, 3, 0.4)),
    stops: [-182, 176].map((x) =>
      slabOf({ x: x - 3, y: RAIL_Y[0] - 7, w: 6, d: RAIL_Y[1] - RAIL_Y[0] + 20, r: 1.4 }, 0, 10, P, 3, 0.5),
    ),
    stopScrews: pointsAt(
      ([[-182, RAIL_Y[0] - 2, 10], [-182, RAIL_Y[1] + 8, 10], [176, RAIL_Y[0] - 2, 10], [176, RAIL_Y[1] + 8, 10]] as Point3[]),
      P,
    ),
    rodBores: [-182, 176].map((x) => ring(x, 0, 2, 10, P, 12)),

    /* The carriage, built at the origin and moved along the rail. */
    car: slabOf(CAR, CAR_Z, CAR_H, P, 4, 0.6),
    carSeat: planOutline(insetPlan(CAR, 6), CAR_Z + CAR_H, P),
    carBushes: [
      slabOf({ x: CAR.x + 4, y: RAIL_Y[0] - 5, w: 13, d: 10, r: 2 }, CAR_Z - 1.5, 4.5, P, 3),
      slabOf({ x: CAR.x + 37, y: RAIL_Y[0] - 5, w: 13, d: 10, r: 2 }, CAR_Z - 1.5, 4.5, P, 3),
      slabOf({ x: CAR.x + 4, y: RAIL_Y[1] - 5, w: 13, d: 10, r: 2 }, CAR_Z - 1.5, 4.5, P, 3),
      slabOf({ x: CAR.x + 37, y: RAIL_Y[1] - 5, w: 13, d: 10, r: 2 }, CAR_Z - 1.5, 4.5, P, 3),
    ],
    carRivets: pointsAt(
      [-2, 8, 18, 28, 38].map((dx) => [CAR.x + 6 + dx, CAR.y + 4, CAR_Z + CAR_H] as Point3),
      P,
    ),
    clamps: [
      slabOf({ x: PIECE.x - 5, y: -4, w: 5, d: 8, r: 1.4 }, PIECE_Z, 7, P, 2),
      slabOf({ x: PIECE.x + PIECE.w, y: -4, w: 5, d: 8, r: 1.4 }, PIECE_Z, 7, P, 2),
    ],

    /* The work itself: a blank that gains its marks as it goes. */
    piece: slabOf(PIECE, PIECE_Z, PIECE_H, P, 2, 0.5),
    scribes: [7, 13, 19].map((dy) =>
      lineOnTop([PIECE.x + 4, PIECE.y + dy], [PIECE.x + PIECE.w - 4, PIECE.y + dy], PIECE_TOP, P),
    ),
    notch: planOutline({ x: PIECE.x + 3, y: PIECE.y + 3, w: 11, d: 9, r: 1.5 }, PIECE_TOP, P),
    stamp: ring(PIECE.x + PIECE.w - 9, PIECE.y + PIECE.d - 8, 3.4, PIECE_TOP, P, 18),
    stampDot: pointsAt([[PIECE.x + PIECE.w - 9, PIECE.y + PIECE.d - 8, PIECE_TOP]] as Point3[], P),

    /* ── station one: the drawing head ── */
    draw: gantry(STAGES[0].at, 58),
    drawHead: slabOf({ x: STAGES[0].at - 7, y: -9, w: 14, d: 18, r: 2 }, 50, 8, P, 3, 0.4),
    drawInk: cylinder(STAGES[0].at - 24, -52, 6, 0, 9, P, 22, 0.5),
    drawInkRing: ring(STAGES[0].at - 24, -52, 3.6, 9, P, 16),

    /* ── station two: the spindle ── */
    cut: gantry(STAGES[1].at, 66, 11),
    cutHousing: cylinder(STAGES[1].at, 0, 9, 50, 17, P, 26, 0.6),
    cutSeam: sideArc(STAGES[1].at, 0, 9, 62, P, 22),
    cutKnurl: knurl(STAGES[1].at, 0, 9, 52, 60, 24, P),
    cutGuard: slabOf({ x: STAGES[1].at - 15, y: -20, w: 30, d: 6, r: 1.5 }, 30, 14, P, 3, 0.4),

    /* ── station three: the press ── */
    press: gantry(STAGES[2].at, 62, 12),
    pressDie: slabOf({ x: STAGES[2].at - 13, y: -13, w: 26, d: 26, r: 2 }, 0, 5, P, 3, 0.5),
    pressDieRing: ring(STAGES[2].at, 0, 7, 5, P, 20),
    pressTies: [-16, 16].map((dx) =>
      cylinder(STAGES[2].at + dx, 0, 2.6, 5, 57, P, 14),
    ),

    /* ── station four: the gauge ── */
    gaugePost: cylinder(STAGES[3].at, -40, 6, 0, 46, P, 22, 0.5),
    gaugeCollar: cylinder(STAGES[3].at, -40, 8, 40, 5, P, 22),
    gaugeArm: slabOf({ x: STAGES[3].at - 5, y: -40, w: 10, d: 38, r: 2 }, 44, 7, P, 3, 0.5),
    gaugePuck: cylinder(STAGES[3].at, -4, 15, 48, 9, P, 48, 0.8),
    gaugeBand: knurl(STAGES[3].at, -4, 15, 54, 57, 64, P, 0.3),
    gaugeSeam: sideArc(STAGES[3].at, -4, 15, 54, P, 32),
    gaugeBezel: ring(STAGES[3].at, -4, 12.6, 57, P, 48),
    gaugeTicks: radialTicks(STAGES[3].at, -4, 11.6, 40, 5, 57, [1.2, 2.8], P),
    gaugeHub: ring(STAGES[3].at, -4, 1.6, 57, P, 14),

    /* ── what stands around it ── */
    rack: slabOf(RACK, 0, 4, P, 3, 0.4),
    rackLip: planOutline(insetPlan(RACK, 2.5), 4, P),
    tools: [26, 21, 30, 18, 24, 28].map((h, i) => ({
      shank: cylinder(RACK.x + 14 + i * 19, RACK.y + 8, 2.2, 4, h, P, 12),
      head: cylinder(RACK.x + 14 + i * 19, RACK.y + 8, 3.6, 4 + h, 4, P, 14, 0.3),
    })),

    tray: slabOf(TRAY, 0, 5, P, 4, 0.5),
    trayWell: planOutline(insetPlan(TRAY, 4), 5, P),
    chips: dotGrid(TRAY.x + 12, TRAY.y + 8, 11, 2, 9, 5, P),

    box: slabOf(BOX, 0, BOX_H, P, 4, 0.8),
    boxFace: planOutline({ x: BOX.x + 7, y: BOX.y + BOX.d - 3, w: BOX.w - 14, d: 1.4, r: 0.7 }, BOX_H - 12, P),
    boxWindow: slabOf({ x: BOX.x + 8, y: BOX.y + 8, w: BOX.w - 16, d: 14, r: 1.5 }, BOX_H, 0.8, P, 2),
    boxWindowInset: planOutline({ x: BOX.x + 10, y: BOX.y + 10, w: BOX.w - 20, d: 10, r: 1 }, BOX_H + 0.8, P),
    boxLines: [22, 16, 19].map((w, i) =>
      lineOnTop([BOX.x + 12, BOX.y + 12.5 + i * 3], [BOX.x + 12 + w, BOX.y + 12.5 + i * 3], BOX_H + 0.8, P),
    ),
    boxKnobs: [0, 1].map((i) => ({
      body: cylinder(BOX.x + 16 + i * 20, BOX.y + 34, 5, BOX_H, 4.5, P, 20, 0.4),
      knurl: knurl(BOX.x + 16 + i * 20, BOX.y + 34, 5, BOX_H, BOX_H + 4.5, 18, P),
      mark: lineOnTop(
        [BOX.x + 16 + i * 20, BOX.y + 34],
        [BOX.x + 16 + i * 20 + 4, BOX.y + 34],
        BOX_H + 4.5,
        P,
      ),
    })),
    boxVents: [0, 1, 2].map((i) =>
      planOutline({ x: BOX.x + 10, y: BOX.y + 2.6, w: BOX.w - 20, d: 1.4, r: 0.7 }, 10 + i * 6, P),
    ),

    /* Where the finished work is set down. */
    out: slabOf(OUT, 0, 4, P, 4, 0.5),
    outWell: planOutline(insetPlan(OUT, 4), 4, P),
    /* The pieces that have come off it. They are the same slab as the one
       on the carriage, at the same thickness — a finished piece that is a
       fifth as thick as the one being worked reads as a shim, not as the
       output. Each carries its stamp, because the stamp is the thing that
       says it is finished. */
    outDone: [0, 1, 2].map((i) =>
      slabOf({ x: OUT.x + 9 + i * 2, y: OUT.y + 10 + i * 2, w: 34, d: 26, r: 2 }, 4 + i * 4.6, 4.4, P, 2, 0.5),
    ),
    outStamp: [0, 1, 2].map((i) =>
      ring(OUT.x + 9 + i * 2 + 25, OUT.y + 10 + i * 2 + 18, 3.4, 8.4 + i * 4.6, P, 18),
    ),
    outNotch: [0, 1, 2].map((i) =>
      planOutline({ x: OUT.x + 12 + i * 2, y: OUT.y + 13 + i * 2, w: 11, d: 9, r: 1.5 }, 8.4 + i * 4.6, P),
    ),

    /* Conduit from the control box along the back of the bench, dropping at
       each station. Drawn as trunking rather than loose cable: trunking is
       what a bench like this actually has, and it can rest on the plate. */
    conduit: slabOf({ x: -130, y: BENCH.y + 9, w: 288, d: 7, r: 1.4 }, 0, 5, P, 3, 0.4),
    conduitLid: lineOnTop([-128, BENCH.y + 16], [156, BENCH.y + 16], 5, P),
    drops: STAGES.map((s) => slabOf({ x: s.at - 3, y: BENCH.y + 9, w: 6, d: 7, r: 1.2 }, 5, 16, P, 2)),
    dropCaps: pointsAt(STAGES.map((s) => [s.at, BENCH.y + 12.5, 21] as Point3), P),
  };
})();

/* ── what moves ──────────────────────────────────────────────────────── */

/** The pen at station one, down by `bite`. */
export const penAt = (bite: number) => {
  const z = 50 - bite * 24;
  return {
    holder: slabOf({ x: STAGES[0].at - 4, y: -5, w: 8, d: 10, r: 1.4 }, z, 9, P, 2, 0.3),
    nib: cylinder(STAGES[0].at, 0, 1.6, z - 7, 7, P, 10),
  };
};

/** The spindle at station two, plunged by `bite`, turned by `spin`. */
export const spindleAt = (bite: number, spin: number) => {
  const z = 46 - bite * 22;
  return {
    quill: cylinder(STAGES[1].at, 0, 5.5, z, 10, P, 18),
    collet: cylinder(STAGES[1].at, 0, 4.2, z - 6, 6, P, 16, 0.3),
    cutter: cylinder(STAGES[1].at, 0, 3, z - 13, 7, P, 14),
    mark: lineOnTop(
      [STAGES[1].at + Math.cos(spin) * 2, Math.sin(spin) * 2],
      [STAGES[1].at + Math.cos(spin) * 8.4, Math.sin(spin) * 8.4],
      62,
      P,
    ),
  };
};

/** The ram at station three, down by `bite`, with its springs. */
export const ramAt = (bite: number) => {
  const z = 40 - bite * 19;
  return {
    head: slabOf({ x: STAGES[2].at - 11, y: -11, w: 22, d: 22, r: 2 }, z, 10, P, 3, 0.5),
    nose: cylinder(STAGES[2].at, 0, 6, z - 5, 5, P, 20, 0.3),
    springs: [-16, 16].map((dx) =>
      coil(z + 10, 57, [0, 0], 4.2, 5, "x", P),
    ),
  };
};

/** The gauge plunger, and the needle it drives. */
export const probeAt = (bite: number) => {
  const z = 44 - bite * 20;
  return {
    stem: cylinder(STAGES[3].at, -4, 2.4, z, 12, P, 12),
    pad: cylinder(STAGES[3].at, -4, 4, z - 3, 3, P, 14, 0.3),
  };
};

export const needleAt = (reading: number) => {
  const a = -Math.PI / 2 + reading * Math.PI * 1.7;
  return lineOnTop(
    [STAGES[3].at - Math.cos(a) * 3, -4 - Math.sin(a) * 3],
    [STAGES[3].at + Math.cos(a) * 9.6, -4 + Math.sin(a) * 9.6],
    57.2,
    P,
  );
};

export { PIECE, CAR_Z, CAR_H };
