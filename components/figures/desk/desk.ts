import {
  boxCorners,
  corners,
  cylinder,
  dotGrid,
  fitProjection,
  haloOf,
  insetPlan,
  iso,
  knurl,
  lineOnTop,
  planOutline,
  pointsAt,
  ring,
  sideArc,
  slabOf,
  topTicks,
  type Flat,
  type Plan,
  type Plane,
  type Point3,
} from "@/components/iso/iso-kit";

/* ── the truth ───────────────────────────────────────────────────────────
   The machine on /desktop: it boots, puts up a menu bar and a dock, and its
   windows drag and resize. Those are the counts this figure draws and the
   numbers it reads out — the dock has as many slots as the real one has
   apps, and the windows open in the order the real desktop opens them. */

export const APPS = ["Finder", "Notes", "Terminal", "Paint", "Minesweeper", "Settings"] as const;
export const WINDOWS = ["Finder", "Notes", "Terminal"] as const;

export const readoutOf = (open: number, booted: boolean) =>
  booted
    ? `${open} of ${WINDOWS.length} windows · ${APPS.length} in the dock`
    : "booting…";

/* ── the world ───────────────────────────────────────────────────────── */

export const WIDTH = 600;
export const HEIGHT = 352;

export const DESK: Plan = { x: -138, y: -86, w: 292, d: 168, r: 10 };
const DESK_Z = -11;
const DESK_H = 11;
const FOOT_H = 5;

/* The monitor stands at the back of the desk. With the camera at 52° both
   +x and +y face the viewer, so the screen is the panel's +y face and the
   case sits behind it in −y. */
const CASE: Plan = { x: -74, y: -62, w: 134, d: 10, r: 2.5 };
const CASE_Z = 16;
const CASE_H = 84;
export const FACE_Y = CASE.y + CASE.d;

const BEZEL = 7;
export const SCREEN = {
  x0: CASE.x + BEZEL,
  x1: CASE.x + CASE.w - BEZEL,
  z0: CASE_Z + BEZEL,
  z1: CASE_Z + CASE_H - BEZEL - 4,
};
export const SCREEN_W = SCREEN.x1 - SCREEN.x0;
export const SCREEN_H = SCREEN.z1 - SCREEN.z0;

const NECK: Plan = { x: -13, y: CASE.y + 1, w: 26, d: 13, r: 3 };
const BOOT: Plan = { x: -34, y: CASE.y - 2, w: 68, d: 30, r: 5 };

const KEYS: Plan = { x: -66, y: 2, w: 132, d: 44, r: 3 };
const MOUSE: Plan = { x: 78, y: 10, w: 26, d: 36, r: 11 };
const TOWER: Plan = { x: 84, y: -62, w: 44, d: 48, r: 4 };
const TOWER_H = 54;

export const P = fitProjection(
  [
    ...boxCorners(DESK, DESK_Z - FOOT_H, 0),
    ...boxCorners(CASE, CASE_Z, CASE_Z + CASE_H),
    ...boxCorners(TOWER, 0, TOWER_H),
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, azimuth: 52 },
);

const n2 = (v: number) => Math.round(v * 10) / 10;
const pt = (p: Point3): string => {
  const [x, y] = iso(p, P);
  return `${n2(x)} ${n2(y)}`;
};

/** A rectangle lying in the screen's own plane, as an SVG path. */
export const onFace = (x0: number, z0: number, x1: number, z1: number) =>
  `M${pt([x0, FACE_Y, z0])}L${pt([x1, FACE_Y, z0])}L${pt([x1, FACE_Y, z1])}L${pt([x0, FACE_Y, z1])}Z`;

/** One point in that plane, for a dot. */
export const atFace = (x: number, z: number): Flat => iso([x, FACE_Y, z], P);

const byDepth = (points: Plane[]) =>
  [...points].sort((a, b) => iso([a[0], a[1], 0], P)[1] - iso([b[0], b[1], 0], P)[1]);

/* ── the parts ───────────────────────────────────────────────────────── */

export const ART = (() => {
  const LABEL: Plan = { x: DESK.x + 15, y: DESK.y + DESK.d - 30, w: 52, d: 20, r: 2 };
  const RULER: Plan = { x: -60, y: DESK.y + DESK.d - 9, w: 150, d: 6, r: 1 };

  return {
    halo: haloOf(DESK, DESK_Z - FOOT_H, 12, P),
    feet: byDepth(corners(DESK, 20)).map(([x, y]) => ({
      flange: cylinder(x, y, 7, DESK_Z - FOOT_H, 1.6, P, 24),
      foot: cylinder(x, y, 5.4, DESK_Z - FOOT_H + 1.6, FOOT_H - 1.6, P, 24),
    })),
    desk: slabOf(DESK, DESK_Z, DESK_H, P, 10, 1.5),
    groove: planOutline(insetPlan(DESK, 5), 0, P),
    screwRings: corners(DESK, 10).map(([x, y]) => ring(x, y, 2.2, 0, P, 16)),
    screws: pointsAt(corners(DESK, 10).map(([x, y]) => [x, y, 0] as Point3), P),

    label: slabOf(LABEL, 0, 0.8, P, 3),
    labelInset: planOutline(insetPlan(LABEL, 1.6), 0.8, P),
    labelRules: [36, 26, 31].map((w, i) =>
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

    /* The monitor: a foot, a neck, the case, and the bezel the screen sits
       inside. The screen's own picture is drawn live in the face plane. */
    boot: slabOf(BOOT, 0, 3, P, 5, 0.5),
    bootGroove: planOutline(insetPlan(BOOT, 4), 3, P),
    bootScrews: pointsAt(
      [
        [BOOT.x + 7, BOOT.y + 7, 3],
        [BOOT.x + BOOT.w - 7, BOOT.y + 7, 3],
      ] as Point3[],
      P,
    ),
    neck: slabOf(NECK, 3, CASE_Z - 3 + 6, P, 4, 0.5),
    neckSeam: lineOnTop([NECK.x + 3, NECK.y + NECK.d], [NECK.x + NECK.w - 3, NECK.y + NECK.d], CASE_Z - 6, P),
    case: slabOf(CASE, CASE_Z, CASE_H, P, 3, 0.9),
    bezel: onFace(SCREEN.x0 - 1.4, SCREEN.z0 - 1.4, SCREEN.x1 + 1.4, SCREEN.z1 + 1.4),
    chinDot: pointsAt([[0, FACE_Y, CASE_Z + 3.6]] as Point3[], P),

    /* The keyboard: a tray, a lip, and a grid of keys. */
    keyTray: slabOf(KEYS, 0, 4, P, 3, 0.5),
    keyLip: planOutline(insetPlan(KEYS, 3.5), 4, P),
    keys: dotGrid(KEYS.x + 8, KEYS.y + 8, 15, 4, 8.2, 4, P),
    keySpace: lineOnTop([KEYS.x + 42, KEYS.y + KEYS.d - 7], [KEYS.x + 90, KEYS.y + KEYS.d - 7], 4, P),

    mouse: slabOf(MOUSE, 0, 6, P, 11, 0.8),
    mouseSeam: lineOnTop([MOUSE.x + 13, MOUSE.y + 4], [MOUSE.x + 13, MOUSE.y + 20], 6, P),

    /* The tower, with its vents and a power ring. */
    tower: slabOf(TOWER, 0, TOWER_H, P, 4, 0.8),
    towerSeam: sideArc(TOWER.x + TOWER.w / 2, TOWER.y + TOWER.d / 2, 0, 0, P, 4),
    vents: [0, 1, 2, 3, 4].map((i) =>
      planOutline(
        { x: TOWER.x + 8, y: TOWER.y + TOWER.d - 3.4, w: TOWER.w - 16, d: 1.6, r: 0.8 },
        TOWER_H - 12 - i * 6,
        P,
      ),
    ),
    power: ring(TOWER.x + 10, TOWER.y + TOWER.d - 6, 2.4, TOWER_H, P, 14),
    powerDot: pointsAt([[TOWER.x + 10, TOWER.y + TOWER.d - 6, TOWER_H]] as Point3[], P),
    towerKnurl: knurl(TOWER.x + TOWER.w - 11, TOWER.y + TOWER.d - 8, 3.4, TOWER_H - 9, TOWER_H, 14, P),
  };
})();

/* ── the picture on the screen ───────────────────────────────────────── */

const BAR_H = 5;

/** The menu bar across the top of the screen, always there once booted. */
export const MENU = onFace(SCREEN.x0, SCREEN.z1 - BAR_H, SCREEN.x1, SCREEN.z1);

export const MENU_ITEMS = [6, 18, 30, 42].map((dx) =>
  onFace(SCREEN.x0 + dx, SCREEN.z1 - BAR_H + 1.6, SCREEN.x0 + dx + 8, SCREEN.z1 - 1.6),
);

/** The dock along the bottom: one slot per app on the real desktop. */
export const DOCK = (() => {
  const w = APPS.length * 9 + 6;
  const x0 = (SCREEN.x0 + SCREEN.x1) / 2 - w / 2;
  return {
    tray: onFace(x0, SCREEN.z0 + 2, x0 + w, SCREEN.z0 + 11),
    slots: APPS.map((_, i) => atFace(x0 + 7.5 + i * 9, SCREEN.z0 + 6.5)),
  };
})();

/** A window on the screen, grown from its own corner by `open` (0 to 1). */
export function windowAt(index: number, open: number) {
  const w = 54;
  const h = 34;
  const x = SCREEN.x0 + 10 + index * 13;
  const z = SCREEN.z1 - BAR_H - 10 - h - index * 7;
  const k = Math.max(0.001, open);
  const cx = x + w / 2;
  const cz = z + h / 2;
  const x0 = cx - (w / 2) * k;
  const x1 = cx + (w / 2) * k;
  const z0 = cz - (h / 2) * k;
  const z1 = cz + (h / 2) * k;
  return {
    body: onFace(x0, z0, x1, z1),
    bar: onFace(x0, z1 - 4.4 * k, x1, z1),
    light: atFace(x0 + 3.4 * k, z1 - 2.2 * k),
  };
}
