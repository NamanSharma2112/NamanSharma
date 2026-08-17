"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A pane of rainy glass laid over the page.
 *
 * Three things are happening at once:
 *  - rain falls *behind* the glass (the thin streaks),
 *  - water clings to the *front* of the glass (droplets that grow, merge and
 *    run down, carving trails through the smaller ones),
 *  - condensation fogs the glass, and the cursor wipes it clear.
 *
 * Everything is drawn into a single canvas from pre-rendered sprites, so the
 * cost per drop is one `drawImage` rather than a stack of gradients.
 */

type Drop = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  /** Radius at which this drop gets heavy enough to run down the glass. */
  slideAt: number;
  sliding: boolean;
  /** Distance travelled since the last droplet was shed. */
  travel: number;
  wiped: boolean;
  dead: boolean;
  sprite: number;
};

type Streak = {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  width: number;
  /** Streaks that hit the glass instead of falling past it. */
  lands: boolean;
  landY: number;
};

type Splash = {
  x: number;
  y: number;
  life: number;
};

/* ── tuning ─────────────────────────────────────────────────────────────── */

/**
 * Sprites are pre-rendered at several sizes. Most drops are only a few pixels
 * across, and squeezing a 96px bitmap down to 3px throws away the highlight
 * that makes them read as water.
 */
const MIP_SIZES = [96, 48, 24, 12, 6];
/** The droplet art fills 74% of its bitmap; the rest is shadow headroom. */
const SPRITE_PAD = 1 / 0.74;
const SPRITE_COUNT = 4;

/**
 * The glass carries a fine mist rather than a scattering of fat beads, so there
 * are a lot of drops and nearly all of them are around a pixel across.
 */
const MAX_DROPS = 7000;
const CELL = 48;

/** How much glass the cursor clears, in px. */
const WIPE_RADIUS = 82;
/** Radius of the sharp "hole" the cursor opens in the blur. */
const HOLE_RADIUS = 120;

const FOG_SCALE = 0.5;
const FOG_STRENGTH = 0.055;
/** Seconds for a wiped patch to fog back over. */
const FOG_RECOVERY = 3.4;

const SPLASH_LIFE = 0.36;

/* ── sprites ────────────────────────────────────────────────────────────── */

/**
 * A droplet is a lens over a dark page: dark in the middle, bright where the
 * light collects on the far rim, with one hard specular dot near the top-left.
 */
function createDropSprite(variant: number, px: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = px;
  c.height = px;
  const g = c.getContext("2d")!;

  const cx = px / 2;
  const cy = px / 2;
  const R = (px / 2) * 0.74;

  // Contact shadow, pooled slightly below the drop.
  const shadow = g.createRadialGradient(
    cx,
    cy + R * 0.16,
    R * 0.25,
    cx,
    cy + R * 0.16,
    R * 1.34
  );
  shadow.addColorStop(0, "rgba(0,0,0,0.36)");
  shadow.addColorStop(0.6, "rgba(0,0,0,0.14)");
  shadow.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = shadow;
  g.fillRect(0, 0, px, px);

  g.save();
  g.beginPath();
  g.arc(cx, cy, R, 0, Math.PI * 2);
  g.clip();

  const body = g.createRadialGradient(
    cx - R * 0.26,
    cy - R * 0.3,
    R * 0.04,
    cx,
    cy,
    R
  );
  body.addColorStop(0, "rgba(198,220,240,0.17)");
  body.addColorStop(0.45, "rgba(120,150,180,0.05)");
  body.addColorStop(0.84, "rgba(200,222,240,0.11)");
  body.addColorStop(1, "rgba(226,240,255,0.32)");
  g.fillStyle = body;
  g.fillRect(0, 0, px, px);

  // Light refracted through the drop lands on the lower-right of the lens.
  const bounce = g.createRadialGradient(
    cx + R * 0.34,
    cy + R * 0.4,
    R * 0.02,
    cx + R * 0.34,
    cy + R * 0.4,
    R * 0.72
  );
  bounce.addColorStop(0, "rgba(255,255,255,0.30)");
  bounce.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = bounce;
  g.fillRect(0, 0, px, px);
  g.restore();

  const rim = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  rim.addColorStop(0, "rgba(255,255,255,0.06)");
  rim.addColorStop(0.5, "rgba(255,255,255,0.17)");
  rim.addColorStop(1, "rgba(255,255,255,0.44)");
  g.beginPath();
  g.arc(cx, cy, R * 0.96, 0, Math.PI * 2);
  g.strokeStyle = rim;
  g.lineWidth = Math.max(1, R * 0.08);
  g.stroke();

  const hx = cx - R * (0.28 + variant * 0.035);
  const hy = cy - R * (0.36 - variant * 0.03);
  const hr = R * (0.28 + variant * 0.035);
  const spec = g.createRadialGradient(hx, hy, 0, hx, hy, hr);
  spec.addColorStop(0, "rgba(255,255,255,0.88)");
  spec.addColorStop(0.45, "rgba(255,255,255,0.24)");
  spec.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = spec;
  g.fillRect(0, 0, px, px);

  return c;
}

/** Soft round brush used to erase condensation where the cursor passes. */
function createBrushSprite(px: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = px;
  c.height = px;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(px / 2, px / 2, 0, px / 2, px / 2, px / 2);
  grad.addColorStop(0, "rgba(0,0,0,1)");
  grad.addColorStop(0.55, "rgba(0,0,0,0.92)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, px, px);
  return c;
}

/* ── component ──────────────────────────────────────────────────────────── */

export default function RainGlass({
  intensity = 1,
  isActive = true,
  glass = true,
  className,
}: {
  /** Scales how much water is on the glass and how hard it rains. */
  intensity?: number;
  isActive?: boolean;
  /**
   * Renders the blurred pane the drops sit on, which is what lets the cursor
   * open a sharp patch. It costs a full-screen backdrop-filter that the
   * compositor redraws whenever the mask moves, so pages that already animate
   * a lot are better off with just the water.
   */
  glass?: boolean;
  /**
   * Overrides the layer the pane sits on. It defaults to sitting above the
   * page, which suits a bare backdrop; put it below the content instead when
   * there is anything on the page that needs to stay sharp.
   */
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    const pane = glassRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sprites = Array.from({ length: SPRITE_COUNT }, (_, i) =>
      MIP_SIZES.map((px) => createDropSprite(i, px))
    );
    /** Smallest pre-rendered size that still covers the drawn size. */
    const pickMip = (size: number) => {
      for (let i = MIP_SIZES.length - 1; i >= 0; i--) {
        if (MIP_SIZES[i] >= size) return i;
      }
      return 0;
    };
    const brush = createBrushSprite(128);

    const fog = document.createElement("canvas");
    const fogCtx = fog.getContext("2d")!;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let fogFill: CanvasGradient | null = null;

    let drops: Drop[] = [];
    let streaks: Streak[] = [];
    const splashes: Splash[] = [];
    let spawnDebt = 0;

    const grid = new Map<number, Drop[]>();
    const gridKey = (gx: number, gy: number) => (gx + 2) * 8192 + (gy + 2);

    const pointer = { x: -1, y: -1, px: -1, py: -1, inside: false, seen: false };
    const hole = { x: 0, y: 0, r: 0 };
    // Last values pushed to CSS. Touching the mask forces the browser to redo
    // the whole backdrop blur, so it is only rewritten when it really moved.
    const mask = { x: -1, y: -1, r: -1 };

    const applyMask = () => {
      if (!pane) return;
      const hx = Math.round(hole.x);
      const hy = Math.round(hole.y);
      const hr = Math.round(hole.r);
      if (hx === mask.x && hy === mask.y && hr === mask.r) return;
      mask.x = hx;
      mask.y = hy;
      mask.r = hr;
      // A closed hole is a uniformly blurred pane; dropping the mask entirely
      // lets the browser keep that blur cached while the cursor is away.
      const value =
        hr <= 0
          ? "none"
          : `radial-gradient(circle ${hr}px at ${hx}px ${hy}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,1) 100%)`;
      pane.style.setProperty("-webkit-mask-image", value);
      pane.style.setProperty("mask-image", value);
    };

    /* ── setup ─────────────────────────────────────────────────────────── */

    const makeDrop = (x: number, y: number, r: number): Drop => ({
      x,
      y,
      r,
      vx: 0,
      vy: 0,
      slideAt: 3 + Math.random() * 1.8,
      sliding: false,
      travel: 0,
      wiped: false,
      dead: false,
      sprite: (Math.random() * SPRITE_COUNT) | 0,
    });

    // Overwhelmingly mist, with a few drops big enough to read as drops and a
    // rare one heavy enough to run.
    const randomRadius = () => {
      const roll = Math.random();
      if (roll > 0.993) return 2.4 + Math.random() * 1.8; // runners
      if (roll > 0.94) return 1.3 + Math.random() * 0.7;
      const t = Math.random();
      return 0.32 + t * t * 0.85;
    };

    const spawnStreaks = () => {
      const count = Math.min(220, Math.round(((w * h) / 9000) * intensity));
      streaks = Array.from({ length: count }, () => {
        const speed = 700 + Math.random() * 1000;
        return {
          x: Math.random() * (w + 160) - 80,
          y: Math.random() * h,
          len: 8 + (speed / 1700) * 52,
          speed,
          alpha: 0.05 + Math.random() * 0.13,
          width: 0.4 + Math.random() * 0.6,
          lands: Math.random() < 0.4,
          landY: h * (0.1 + Math.random() * 0.9),
        };
      });
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fog.width = Math.max(1, Math.ceil(w * FOG_SCALE));
      fog.height = Math.max(1, Math.ceil(h * FOG_SCALE));
      fogFill = fogCtx.createLinearGradient(0, 0, 0, fog.height);
      fogFill.addColorStop(0, "rgba(203,225,244,1)");
      fogFill.addColorStop(0.55, "rgba(186,208,229,0.86)");
      fogFill.addColorStop(1, "rgba(170,192,214,0.72)");
      fogCtx.globalCompositeOperation = "source-over";
      fogCtx.globalAlpha = 1;
      fogCtx.fillStyle = fogFill;
      fogCtx.fillRect(0, 0, fog.width, fog.height);

      drops = drops.filter((d) => d.x < w && d.y < h);
      spawnStreaks();
    };

    resize();

    // Start with the glass already wet rather than filling up from empty.
    const seed = Math.min(MAX_DROPS, Math.round(((w * h) / 260) * intensity));
    for (let i = 0; i < seed; i++) {
      drops.push(makeDrop(Math.random() * w, Math.random() * h, randomRadius()));
    }

    /* ── interaction ───────────────────────────────────────────────────── */

    const onPointerMove = (e: PointerEvent) => {
      if (!pointer.seen) {
        pointer.px = e.clientX;
        pointer.py = e.clientY;
        hole.x = e.clientX;
        hole.y = e.clientY;
        pointer.seen = true;
      }
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.inside = true;
    };

    const onPointerOut = (e: PointerEvent) => {
      if (e.relatedTarget === null) pointer.inside = false;
    };

    const onBlur = () => {
      pointer.inside = false;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", onBlur);

    /* ── simulation ────────────────────────────────────────────────────── */

    /** Shortest distance from a point to the segment the cursor just swept. */
    const distToSweep = (
      x: number,
      y: number,
      ax: number,
      ay: number,
      bx: number,
      by: number
    ) => {
      const dx = bx - ax;
      const dy = by - ay;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq > 0 ? ((x - ax) * dx + (y - ay) * dy) / lenSq : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const px = ax + dx * t - x;
      const py = ay + dy * t - y;
      return Math.sqrt(px * px + py * py);
    };

    const wipe = (ax: number, ay: number, bx: number, by: number) => {
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.wiped) continue;
        if (distToSweep(d.x, d.y, ax, ay, bx, by) < WIPE_RADIUS + d.r) {
          d.wiped = true;
          d.sliding = false;
        }
      }

      // Stamp the brush along the sweep so fast flicks still clear a band.
      const dist = Math.hypot(bx - ax, by - ay);
      const steps = Math.max(1, Math.ceil(dist / (WIPE_RADIUS * 0.4)));
      const size = WIPE_RADIUS * 2 * FOG_SCALE;
      fogCtx.globalCompositeOperation = "destination-out";
      fogCtx.globalAlpha = 1;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = (ax + (bx - ax) * t) * FOG_SCALE;
        const y = (ay + (by - ay) * t) * FOG_SCALE;
        fogCtx.drawImage(brush, x - size / 2, y - size / 2, size, size);
      }
      fogCtx.globalCompositeOperation = "source-over";
    };

    const step = (dt: number) => {
      // Condensation creeps back over wiped glass.
      if (fogFill) {
        fogCtx.globalAlpha = 1 - Math.exp(-dt / FOG_RECOVERY);
        fogCtx.fillStyle = fogFill;
        fogCtx.fillRect(0, 0, fog.width, fog.height);
        fogCtx.globalAlpha = 1;
      }

      if (pointer.inside && pointer.seen) {
        if (pointer.x !== pointer.px || pointer.y !== pointer.py) {
          wipe(pointer.px, pointer.py, pointer.x, pointer.y);
        }
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }

      // The clear spot in the blur eases toward the cursor and closes when it
      // leaves the window.
      const ease = 1 - Math.exp(-dt * 14);
      hole.x += (pointer.x - hole.x) * ease;
      hole.y += (pointer.y - hole.y) * ease;
      const targetR = pointer.inside && pointer.seen ? HOLE_RADIUS : 0;
      hole.r += (targetR - hole.r) * (1 - Math.exp(-dt * 6));

      // Rain behind the glass.
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        const prevY = s.y;
        s.y += s.speed * dt;
        s.x += s.speed * 0.07 * dt;

        if (s.lands && prevY < s.landY && s.y >= s.landY) {
          if (drops.length < MAX_DROPS) {
            drops.push(makeDrop(s.x, s.landY, 1.1 + Math.random() * 1.1));
            const satellites = 2 + ((Math.random() * 4) | 0);
            for (let n = 0; n < satellites && drops.length < MAX_DROPS; n++) {
              drops.push(
                makeDrop(
                  s.x + (Math.random() - 0.5) * 22,
                  s.landY + (Math.random() - 0.5) * 22,
                  0.32 + Math.random() * 0.5
                )
              );
            }
          }
          splashes.push({ x: s.x, y: s.landY, life: SPLASH_LIFE });
          s.lands = Math.random() < 0.4;
        }

        if (s.y - s.len > h) {
          s.x = Math.random() * (w + 160) - 80;
          s.y = -s.len - Math.random() * h * 0.4;
          s.landY = h * (0.1 + Math.random() * 0.9);
          s.lands = Math.random() < 0.4;
        }
      }

      for (let i = splashes.length - 1; i >= 0; i--) {
        splashes[i].life -= dt;
        if (splashes[i].life <= 0) splashes.splice(i, 1);
      }

      // New water arriving on the glass.
      spawnDebt += ((w * h) / 2600) * intensity * dt;
      while (spawnDebt >= 1) {
        spawnDebt -= 1;
        if (drops.length >= MAX_DROPS) break;
        drops.push(
          makeDrop(Math.random() * w, Math.random() * h, randomRadius())
        );
      }

      // Index the resting drops so runners can pick them up.
      grid.clear();
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.sliding || d.dead || d.wiped) continue;
        const k = gridKey((d.x / CELL) | 0, (d.y / CELL) | 0);
        const cell = grid.get(k);
        if (cell) cell.push(d);
        else grid.set(k, [d]);
      }

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.dead) continue;

        if (d.wiped) {
          d.r -= 34 * dt;
          if (d.r <= 0.1) d.dead = true;
          continue;
        }

        if (!d.sliding) {
          // Drops feed on the mist until they are too heavy to hold on. Slow,
          // so the glass stays misted rather than beading up.
          d.r += 0.05 * dt;
          if (d.r >= d.slideAt) {
            d.sliding = true;
            d.vy = 6 + Math.random() * 12;
          }
          continue;
        }

        const vMax = 25 + d.r * 40;
        d.vy += (240 + d.r * 46) * dt;
        if (d.vy > vMax) d.vy = vMax;

        // Real drops wander and stall as they catch on the glass.
        if (Math.random() < dt * 2.4) d.vx += (Math.random() - 0.5) * 34;
        if (Math.random() < dt * 0.7) d.vy *= 0.3;
        d.vx *= Math.exp(-dt * 4);

        const dx = d.vx * dt;
        const dy = d.vy * dt;
        d.x += dx;
        d.y += dy;
        d.travel += Math.hypot(dx, dy);

        // Absorb whatever it runs over.
        const gx = (d.x / CELL) | 0;
        const gy = (d.y / CELL) | 0;
        for (let ox = -1; ox <= 1; ox++) {
          for (let oy = -1; oy <= 1; oy++) {
            const cell = grid.get(gridKey(gx + ox, gy + oy));
            if (!cell) continue;
            for (let n = 0; n < cell.length; n++) {
              const o = cell[n];
              if (o.dead || o === d) continue;
              const ddx = o.x - d.x;
              const ddy = o.y - d.y;
              const reach = d.r + o.r * 0.55;
              if (ddx * ddx + ddy * ddy < reach * reach) {
                d.r = Math.sqrt(d.r * d.r + o.r * o.r);
                d.vy += o.r * 2.4;
                o.dead = true;
              }
            }
          }
        }

        // Shed part of itself as a trail.
        const gap = d.r * 2 + 4.5;
        if (d.travel >= gap) {
          d.travel = 0;
          const leftR = d.r * (0.14 + Math.random() * 0.1);
          if (drops.length < MAX_DROPS) {
            drops.push(
              makeDrop(d.x + (Math.random() - 0.5) * d.r * 0.5, d.y, leftR)
            );
          }
          d.r = Math.sqrt(Math.max(0, d.r * d.r - leftR * leftR)) * 0.995;
        }

        if (d.r < 0.3 || d.y - d.r > h || d.x < -40 || d.x > w + 40) {
          d.dead = true;
        }
      }

      if (drops.length > 0) drops = drops.filter((d) => !d.dead);
    };

    /* ── drawing ───────────────────────────────────────────────────────── */

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Rain falling behind the pane.
      ctx.strokeStyle = "rgba(214,232,248,1)";
      ctx.lineCap = "round";
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        ctx.globalAlpha = s.alpha;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len * 0.07, s.y - s.len);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Condensation.
      ctx.globalAlpha = FOG_STRENGTH;
      ctx.drawImage(fog, 0, 0, w, h);
      ctx.globalAlpha = 1;

      // Impact rings.
      for (let i = 0; i < splashes.length; i++) {
        const s = splashes[i];
        const t = 1 - s.life / SPLASH_LIFE;
        ctx.globalAlpha = 0.24 * (1 - t);
        ctx.strokeStyle = "rgba(226,240,255,1)";
        ctx.lineWidth = 1.2 * (1 - t);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 + t * 15, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Water on the pane.
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        if (d.r <= 0.1) continue;
        const size = d.r * 2 * SPRITE_PAD;
        // Running drops stretch out behind themselves.
        const stretch = d.sliding ? 1 + Math.min(d.vy / 640, 0.5) : 1;
        ctx.drawImage(
          sprites[d.sprite][pickMip(size * stretch)],
          d.x - size / 2,
          d.y - (size * stretch) / 2,
          size,
          size * stretch
        );
      }

      applyMask();
    };

    /* ── loop ──────────────────────────────────────────────────────────── */

    if (reduced) {
      draw();
      const onResizeStatic = () => {
        resize();
        draw();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => {
        window.removeEventListener("resize", onResizeStatic);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerout", onPointerOut);
        window.removeEventListener("blur", onBlur);
      };
    }

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      // Clamped so a backgrounded tab does not resume with a giant timestep.
      const dt = Math.min((now - last) / 1000, 1 / 20);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intensity, isActive, glass]);

  if (!isActive) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[45] pointer-events-none overflow-hidden",
        className
      )}
    >
      {/* The pane itself: everything behind it is refracted, except the patch
          under the cursor, which the mask keeps sharp. */}
      {/* The mask that opens the clear patch is applied imperatively, so React
          never re-renders this node mid-animation. */}
      {glass ? (
        <div
          ref={glassRef}
          className="absolute inset-0 backdrop-blur-[2px] backdrop-saturate-[1.15] bg-[#0b1622]/10"
        />
      ) : null}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
