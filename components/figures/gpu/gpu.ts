import {
  boxCorners,
  circleRing,
  cylinder,
  fitProjection,
  haloOf,
  iso,
  lineOnTop,
  onTop,
  opening,
  pathOf,
  planOutline,
  ring,
  slabOf,
  towardViewer,
  type Plan,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";

/* ── the model ───────────────────────────────────────────────────────────
   A three-fan graphics card lying fans-up on a tray, at about a third of
   full size (one unit is roughly 2.8 mm): a backplate, the board with its
   PCIe fingers, the GPU and its memory, a fin stack the length of the
   card, three ring fans and the shroud they sit in, with the I/O bracket
   standing at the near end. No maker's name or mark is drawn on it.

   ── THE FANS ───────────────────────────────────────────────────────────
   Each fan sits in a round opening in the shroud, 2.5 below its top, so
   the opening is worked out the same way as a bezel's: the shroud's near
   rim hides the near edge of each fan and its far inner wall shows as a
   crescent. Through the gaps between the blades the fin stack shows,
   because it is under them.

   The numbers the readout gives are a worked example rather than any
   card's measurements: the fans hold still below 30% load, as cards with
   a zero-rpm mode do, then run from 1,000 to 3,000 rpm. */

export const WIDTH = 600;
export const HEIGHT = 480;

export const GAP = 24;
/* The levels each layer rises to. The fin stack is tall and the fans sit
   inside the shroud, so those two get more room than one gap each. */
export const LEVEL = { tray: 0, board: 1, sink: 3, fans: 4.6, shroud: 6.2 };
const LEVELS = LEVEL.shroud;
const SPARE = (LEVELS * GAP) / 2;

const TRAY: Plan = { x: -66, y: -31, w: 128, d: 62, r: 8 };
const TRAY_Z = -4;

const BACK: Plan = { x: -60, y: -23, w: 117, d: 46, r: 2 };
const BACK_TOP = 1.2;
const PCB: Plan = { x: -59.5, y: -22.5, w: 116, d: 45, r: 1 };
const PCB_TOP = 2.6;

const SINK: Plan = { x: -57, y: -21, w: 111, d: 42, r: 1 };
const SINK_TOP = 17;

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
  [...boxCorners(TRAY, TRAY_Z, 0), ...boxCorners(SHROUD, 0, SHROUD_TOP), [FACE, -26, BRACKET_TOP], [FACE, 26, BRACKET_TOP]],
  WIDTH,
  HEIGHT - SPARE * 2,
  { pad: 8, azimuth: 60 },
);
export const P = { ...P0, origin: [P0.origin[0], P0.origin[1] + SPARE] as [number, number] };

const toward = towardViewer(P);
const deep = (x: number, y: number) => x * toward[0] + y * toward[1];

/** A closed outline on the bracket's outer face, in (y, z). */
const onFace = (pts: Plane[]) => pathOf(pts.map(([y, z]) => iso([FACE, y, z], P)), true);
const faceRect = (y: number, z: number, w: number, h: number, c = 0.5) =>
  onFace([
    [y + c, z],
    [y + w - c, z],
    [y + w, z + c],
    [y + w, z + h - c],
    [y + w - c, z + h],
    [y + c, z + h],
    [y, z + h - c],
    [y, z + c],
  ]);

/** A closed outline on the near face of the power connector, in (x, z). */
const PLUG: Plan = { x: -6, y: 21, w: 12, d: 2.6, r: 0.4 };
const PLUG_FACE = PLUG.y + PLUG.d;
const onPlug = (x: number, z: number, s: number) =>
  pathOf(
    ([
      [x, z],
      [x + s, z],
      [x + s, z + s],
      [x, z + s],
    ] as Plane[]).map(([px, pz]) => iso([px, PLUG_FACE, pz], P)),
    true,
  );

/** Every static path, built once when the module loads. */
export const ART = (() => {
  /* The two runs of contacts either side of the key notch. */
  const tabs: Plan[] = [
    { x: 4, y: -26, w: 11, d: 3.6, r: 0.5 },
    { x: 16.4, y: -26, w: 30, d: 3.6, r: 0.5 },
  ];
  const fingers: string[] = [];
  for (const t of tabs) for (let x = t.x + 1; x < t.x + t.w - 0.6; x += 1) fingers.push(lineOnTop([x, t.y], [x, PCB.y + 0.05], PCB_TOP, P));

  /* The GPU and its eight memory packages, only seen with the cooler off. */
  const [gx, gy] = [-1.5, 0];
  const chips: Plan[] = [
    [-17, -9], [-17, 2], [12, -9], [12, 2],
    [-8, -19], [2, -19], [-8, 12], [2, 12],
  ].map(([dx, dy]) => ({ x: gx + dx, y: gy + dy, w: dx === -17 || dx === 12 ? 5 : 7, d: dx === -17 || dx === 12 ? 7 : 5, r: 0.4 }));
  chips.sort((a, b) => deep(a.x + a.w / 2, a.y + a.d / 2) - deep(b.x + b.w / 2, b.y + b.d / 2));

  /* Fins are plates across the card, so their edges show as lines on
     the long near face and on the top, between the fans. */
  const finsSide: string[] = [];
  const finsTop: string[] = [];
  for (let x = SINK.x + 1.5; x < SINK.x + SINK.w - 1; x += 1.5) {
    finsSide.push(pathOf([iso([x, SINK.y + SINK.d, PCB_TOP], P), iso([x, SINK.y + SINK.d, SINK_TOP], P)]));
    finsTop.push(lineOnTop([x, SINK.y], [x, SINK.y + SINK.d], SINK_TOP, P));
  }

  const shell = slabOf(SHROUD, 17, SHROUD_TOP - 17, P, 8, 0.5);
  const cuts = FAN_X.map((x) => opening(x, 0, HOLE_R, SHROUD_TOP, SHROUD_TOP - BLADE_Z, P));
  const holes = cuts.map((c) => c.hole).join("");

  /* The light bar runs the near long edge, ending where the corners
     start to round so it meets the outline on both. */
  const bar = 2.5;
  const reach = Math.sqrt(SHROUD.r * SHROUD.r - (SHROUD.r - bar) ** 2);
  const barY = SHROUD.y + SHROUD.d - bar;
  const lightBar = lineOnTop(
    [SHROUD.x + SHROUD.r - reach, barY],
    [SHROUD.x + SHROUD.w - SHROUD.r + reach, barY],
    SHROUD_TOP,
    P,
  );

  return {
    halo: haloOf(TRAY, TRAY_Z, 2, P),
    tray: slabOf(TRAY, TRAY_Z, -TRAY_Z, P, 8, 0.8),
    groove: planOutline({ x: TRAY.x + 4, y: TRAY.y + 4, w: TRAY.w - 8, d: TRAY.d - 8, r: TRAY.r - 4 }, 0, P),

    backplate: slabOf(BACK, 0, BACK_TOP, P, 4, 0.2),
    tabs: tabs.map((t) => slabOf(t, BACK_TOP, PCB_TOP - BACK_TOP, P, 3)),
    fingers: fingers.join(""),
    pcb: slabOf(PCB, BACK_TOP, PCB_TOP - BACK_TOP, P, 4),
    substrate: slabOf({ x: gx - 9.5, y: gy - 9.5, w: 19, d: 19, r: 0.6 }, PCB_TOP, 0.5, P, 3),
    die: slabOf({ x: gx - 6.5, y: gy - 6.5, w: 13, d: 13, r: 0.4 }, PCB_TOP + 0.5, 0.7, P, 3),
    chips: chips.map((c) => slabOf(c, PCB_TOP, 0.9, P, 3)),

    sink: slabOf(SINK, PCB_TOP, SINK_TOP - PCB_TOP, P, 4),
    finsSide: finsSide.join(""),
    finsTop: finsTop.join(""),
    plug: slabOf(PLUG, PCB_TOP, 6.9, P, 3, 0.2),
    pins: [0, 1, 2, 3, 4, 5].flatMap((i) => [onPlug(PLUG.x + 0.9 + i * 1.8, 4, 1.2), onPlug(PLUG.x + 0.9 + i * 1.8, 6.4, 1.2)]).join(""),

    /* The shroud is a slab with three openings cut through its fill and
       top, so the fans and the fins under them show through. */
    shroud: { ...shell, fill: shell.fill + holes, top: shell.top + holes },
    walls: cuts.map((c) => c.wall),
    feet: cuts.map((c) => c.foot).join(""),
    holes,
    lightBar,

    bracket: slabOf(BRACKET, 0, BRACKET_TOP, P, 2),
    ports: [faceRect(-21, 13, 8, 3.2), faceRect(-11, 13, 8, 3.2), faceRect(-1, 13, 8, 3.2), faceRect(9.5, 13, 7, 3, 0.9)].join(""),
    vents: Array.from({ length: 7 }, (_, i) => faceRect(-21 + i * 6.2, 18, 4.6, 3.2, 0.8)).join(""),
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

/** The parts of each fan that do not turn, nearest drawn last. */
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
