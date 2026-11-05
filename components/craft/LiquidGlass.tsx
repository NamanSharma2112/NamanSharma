"use client";

import { useEffect, useRef, useState } from "react";

/* Read once, the way the wheel and the pill nav do. A
   preference, not a live input. */
const stillness = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* The picture under the glass: the finished dialog with its
   measurements drawn on — every gap, height and radius it was
   built to. public/craft/details.jpg, rendered at 4:3. */
const SPEC = "/craft/details.jpg";

/* ══ Glass bubble, liquid ═════════════════════════════════
   A ball of glass you drag over a picture. It bends what is
   under it — bigger in the middle, hard at the rim — splits
   the colour a hair at the very edge, catches the light along
   its top, and can be carried off the picture onto the page,
   where there is nothing to bend and it is only light and
   shadow.

   Here it is a loupe over a spec, so it magnifies more than a
   decorative ball would: 1.3 in the middle, against the
   original's 1.1. Enough to read a 9px measurement, not so
   much that the rim stops reading as glass.

   ── A SHADER, NOT A FILTER ──────────────────────────────
   An SVG displacement map through a backdrop filter cannot
   know where its own edge is: a map is a picture, drawn once,
   so the rim is a band of numbers rather than a surface. Here
   the page is a texture and every pixel asks a signed distance
   function how far it is from the capsule's edge, which is
   what lets the bend, the rim light and the shadow all follow
   the SAME edge exactly — including while the capsule
   stretches under a fast drag.

   ── THE RIM READS OUTWARD ───────────────────────────────
   Near the edge each pixel samples from further out along the
   edge's normal, so the band round the rim shows what is just
   outside it, gathered in. That is what makes text curve at
   the edge of real glass. The middle only magnifies. */

/* ── the picture, and the room round it ─────────────────
   The picture has a margin on every side, so the ball can be
   carried half off it onto the page — the edge is something
   you cross, not a wall. The margin is part of the canvas and
   left clear, so the page itself shows through it. The sizes
   are props, because the column is narrower on a phone. */
const VERT = `
attribute vec2 pos;
varying vec2 vUv;
void main() {
  vUv = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5);
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D tex;
uniform vec2 res;
uniform vec2 c;
uniform vec2 b;
uniform float r;
uniform float bend;
uniform float fringe;
uniform float dark;
varying vec2 vUv;

float sdf(vec2 p) {
  vec2 q = abs(p - c) - b + vec2(r);
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

/* premultiplied: the margin round the picture is transparent,
   so the real page shows through it and the glass over it bends
   nothing — only its light and its shadow are left */
vec4 read(vec2 p) {
  return texture2D(tex, clamp(p / res, 0.0, 1.0));
}

void main() {
  vec2 p = vUv * res;
  float d = sdf(p);
  vec4 col = read(p);

  /* what it casts: soft, a little below. It darkens the picture
     where there is one and is a shadow of its own where there
     is not. */
  float ds = sdf(p - vec2(0.0, 9.0));
  float sh = (1.0 - smoothstep(-8.0, 26.0, ds)) * mix(0.14, 0.3, dark);
  if (d > 0.0) col = vec4(col.rgb * (1.0 - sh), col.a) + vec4(0.0, 0.0, 0.0, sh * (1.0 - col.a));

  if (d < 1.0) {
    float e = 1.5;
    vec2 n = normalize(vec2(
      sdf(p + vec2(e, 0.0)) - sdf(p - vec2(e, 0.0)),
      sdf(p + vec2(0.0, e)) - sdf(p - vec2(0.0, e))
    ) + 1e-5);
    /* the bending band scales with the ball, so a big one is
       still a lens and a small one is not all rim */
    float bevel = min(b.y, max(22.0, b.y * 0.36));
    /* 0 at the rim, 1 once past the bevel */
    float t = clamp(-d / bevel, 0.0, 1.0);
    float edge = pow(1.0 - t, 2.4);

    vec2 mag = c + (p - c) / 1.3;
    vec2 off = n * edge * bevel * 1.1 * bend;
    vec2 q = mag + off;
    vec4 mid = read(q);
    vec4 g = vec4(read(q + off * fringe).r, mid.g, read(q - off * fringe).b, mid.a);

    /* the light: a thin lit band just inside the edge, bright
       where it faces up-left, a weaker catch on the far side
       where light has come through and out again */
    vec2 L = normalize(vec2(-0.55, -0.85));
    float rim = smoothstep(0.0, 1.6, -d) * (1.0 - smoothstep(1.6, 4.5, -d));
    float lit = max(dot(n, L), 0.0);
    float far = max(dot(n, -L), 0.0);
    g.rgb *= mix(1.03, 1.08, dark);
    /* light is added as light: colour and coverage together, so
       it shows on the page as well as on the picture */
    float light = rim * (0.18 + 0.75 * lit) + rim * far * 0.22 + edge * mix(0.05, 0.08, dark);
    g += vec4(vec3(light), light);
    g = clamp(g, 0.0, 1.0);

    float a = 1.0 - smoothstep(-0.6, 0.6, d);
    col = mix(col, g, a);
  }
  gl_FragColor = col;
}`;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/* ── light or dark ───────────────────────────────────────
   This site is dark and only dark (the theme is forced in the
   layout), so the glass is tuned for a dark ground once rather
   than watching the page for a change that never comes. */
const DARK = true;

function compile(gl: WebGLRenderingContext) {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  return prog;
}

export function LiquidGlass({
  /* the picture's size and the margin round it, px */
  picW = 360,
  picH = 270,
  pad = 20,
  /* the ball's diameter, px */
  size = 128,
  /* how hard the rim bends, 0..100 */
  bend = 60,
  /* how far the colours part at the edge, 0..40 */
  fringe = 30,
  /* the picture's corner, px */
  corner = 16,
}: {
  picW?: number;
  picH?: number;
  pad?: number;
  size?: number;
  bend?: number;
  fringe?: number;
  corner?: number;
} = {}) {
  const W = picW + pad * 2;
  const H = picH + pad * 2;
  const cv = useRef<HTMLCanvasElement | null>(null);
  const gl = useRef<{ g: WebGLRenderingContext; prog: WebGLProgram; tex: WebGLTexture } | null>(null);
  const page = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef(0);
  const [failed, setFailed] = useState(false);
  /* it starts on the picture, over the Invite button and its
     measurements */
  const state = useRef({ x: W * 0.68, y: H * 0.44, vx: 0, vy: 0, tx: W * 0.68, ty: H * 0.44 });
  const grab = useRef<{ dx: number; dy: number } | null>(null);
  const knobs = useRef({ size, bend, fringe, still: false });

  /* ── one frame ─────────────────────────────────────────── */
  const draw = () => {
    const G = gl.current;
    const c = cv.current;
    if (!G || !c) return;
    const { g, prog } = G;
    const k = c.width / W;
    const s = state.current;
    const { size: sz, bend: bd, fringe: fr, still } = knobs.current;
    /* a fast drag stretches it along the way it is going and
       thins it across — the same volume, moving */
    const sp = Math.hypot(s.vx, s.vy);
    const stretch = still ? 0 : Math.min(0.14, sp * 0.012);
    const ax = sp > 0.01 ? Math.abs(s.vx) / sp : 1;
    const rad = clamp(sz, 80, 280) / 2;
    const bx = rad * (1 + stretch * ax - stretch * 0.5 * (1 - ax));
    const by = rad * (1 + stretch * (1 - ax) - stretch * 0.5 * ax);
    g.viewport(0, 0, c.width, c.height);
    g.useProgram(prog);
    const u = (n: string) => g.getUniformLocation(prog, n);
    g.uniform2f(u("res"), c.width, c.height);
    g.uniform2f(u("c"), s.x * k, s.y * k);
    g.uniform2f(u("b"), bx * k, by * k);
    g.uniform1f(u("r"), Math.min(bx, by) * k);
    g.uniform1f(u("bend"), clamp(bd, 0, 100) / 100);
    g.uniform1f(u("fringe"), clamp(fr, 0, 40) / 100);
    g.uniform1f(u("dark"), DARK ? 1 : 0);
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
  };

  /* ── the loop: a spring toward the hand, then stop ─────── */
  const run = () => {
    if (raf.current) return;
    let prev = 0;
    const tick = (t: number) => {
      const dt = prev ? clamp((t - prev) / 16.67, 0, 2.5) : 1;
      prev = t;
      const s = state.current;
      if (knobs.current.still) { s.x = s.tx; s.y = s.ty; s.vx = 0; s.vy = 0; }
      else {
        const k = 0.22;
        const d = Math.pow(0.66, dt);
        s.vx = (s.vx + (s.tx - s.x) * k * dt) * d;
        s.vy = (s.vy + (s.ty - s.y) * k * dt) * d;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
      draw();
      const moving = Math.abs(s.tx - s.x) > 0.05 || Math.abs(s.ty - s.y) > 0.05
        || Math.abs(s.vx) > 0.05 || Math.abs(s.vy) > 0.05 || grab.current;
      raf.current = moving ? requestAnimationFrame(tick) : 0;
    };
    raf.current = requestAnimationFrame(tick);
  };

  /* ── the page under the glass ──────────────────────────── */
  const paint = async () => {
    const c = cv.current;
    const G = gl.current;
    if (!c || !G) return;
    const pg = page.current ?? (page.current = document.createElement("canvas"));
    pg.width = c.width;
    pg.height = c.height;
    const x = pg.getContext("2d")!;
    const k = c.width / W;
    /* the margin stays clear: the page behind the canvas is
       the ground, whatever colour it is */
    x.clearRect(0, 0, pg.width, pg.height);
    const im = new Image();
    im.src = SPEC;
    await im.decode().catch(() => {});
    if (!gl.current) return;
    /* the picture, rounded, cropped to fill */
    const px = pad * k;
    const pw = picW * k;
    const ph = picH * k;
    const s = Math.max(pw / im.width, ph / im.height);
    const iw = im.width * s;
    const ih = im.height * s;
    x.save();
    x.beginPath();
    x.roundRect(px, px, pw, ph, clamp(corner, 0, 60) * k);
    x.clip();
    x.drawImage(im, px + (pw - iw) / 2, px + (ph - ih) / 2, iw, ih);
    x.restore();
    const { g, tex } = G;
    g.bindTexture(g.TEXTURE_2D, tex);
    g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, pg);
    draw();
  };

  /* ── set up once ───────────────────────────────────────── */
  useEffect(() => {
    knobs.current = { size, bend, fringe, still: stillness() };
    const c = cv.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    const g = c.getContext("webgl", { antialias: true, premultipliedAlpha: true, alpha: true });
    const prog = g && compile(g);
    if (!g || !prog) {
      /* no WebGL: the spec is still worth seeing, just without
         the glass over it */
      setFailed(true);
      return;
    }
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(prog, "pos");
    g.enableVertexAttribArray(loc);
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const tex = g.createTexture()!;
    g.bindTexture(g.TEXTURE_2D, tex);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
    gl.current = { g, prog, tex };
    paint();
    /* NOT loseContext() here. StrictMode runs this cleanup and
       then the setup again on the SAME canvas, and a context
       that has been lost comes straight back from getContext
       still lost — a sad-face canvas. The browser frees it with
       the element. */
    return () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      gl.current = null;
    };
    // the sizes are fixed for the life of the canvas: the parent
    // remounts it with a new key when the column changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* the glass redraws when a knob moves */
  useEffect(() => {
    knobs.current = { size, bend, fringe, still: knobs.current.still };
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, bend, fringe]);

  /* ── the hand ──────────────────────────────────────────── */
  const at = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const k = r.width / W;
    return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k };
  };
  const onGlass = (p: { x: number; y: number }) => {
    const s = state.current;
    return Math.hypot(p.x - s.x, p.y - s.y) <= clamp(size, 80, 280) / 2 + 4;
  };

  if (failed) {
    return (
      <div className="lqg" style={{ width: W, height: H }}>
        <img src={SPEC} alt="The finished dialog with its measurements drawn on." width={picW} height={picH} style={{ borderRadius: corner }} />
      </div>
    );
  }

  return (
    <div className="lqg">
      <canvas
        ref={cv}
        className="lqg-canvas"
        data-no-swipe=""
        style={{ width: W, height: H }}
        aria-label="A glass lens over the finished dialog, with its measurements drawn on. Drag it."
        role="img"
        onPointerDown={(e) => {
          const p = at(e);
          const s = state.current;
          /* off the glass, the glass comes to the finger, so on a
             phone a tap anywhere is a way in */
          if (onGlass(p)) grab.current = { dx: p.x - s.x, dy: p.y - s.y };
          else {
            grab.current = { dx: 0, dy: 0 };
            s.tx = clamp(p.x, 0, W);
            s.ty = clamp(p.y, 0, H);
          }
          try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* scripted */ }
          run();
        }}
        onPointerMove={(e) => {
          const p = at(e);
          const gr = grab.current;
          e.currentTarget.dataset.over = onGlass(p) || gr ? "true" : "false";
          if (!gr) return;
          const s = state.current;
          s.tx = clamp(p.x - gr.dx, 0, W);
          s.ty = clamp(p.y - gr.dy, 0, H);
          run();
        }}
        onPointerUp={() => {
          if (!grab.current) return;
          grab.current = null;
          run();
        }}
        onPointerCancel={() => { grab.current = null; run(); }}
      />
    </div>
  );
}
