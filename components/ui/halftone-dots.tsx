'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/lib/utils'

type Field = {
  r: Float32Array
  rgb: Float32Array
  alpha: Float32Array
  reveal: Float32Array
}

const hexRgb = (hex: string): [number, number, number] => {
  const n = hex.replace('#', '')
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)]
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

const MORPH = 200
const MORPH_STAGGER = 220
const MORPH_DIP = 0.5

/* Default grid pitch. Overridable per instance through the `cell` prop: at a
   small rendered size a 6px cell leaves a whole face as a few dozen dots. */
const CELL = 6
const SUP = 4
const SPILL = 72

const DOT_FLOOR = 0.22
const DOT_COVERAGE = 0.18
const DOT_TONE = 0.52

const TONE_CONTRAST = 1.6
const COLOR_CONTRAST = 1.25
const PAPER_R = 0.3
const PAPER_ALPHA = 0.28

const LATENT_FLOOR = 0.14
const LATENT_COVERAGE = 0.1
const LATENT_TONE = 0.26

const LATENT_ALPHA = 0.2

const LATENT_BOOST = 0.45
const LATENT_LIFT = 210
const MARK_INSET = 24
const MARK_CLEAR = CELL * 2 + 6
const MARK_R = 0.7

const FULL_FROM = 0.8
const FULL_CORNER = 0.82
const FULL_GROW = 1.05

/* How the dots answer a pointer. These were tuned on a small picture: on a
   large one a 64px reach is a coin on a dinner plate, and the lag between the
   cursor and the swell read as the whole thing being slow rather than as a
   pointer being followed. Wider, and it arrives when you do. */
const LENS_RADIUS = 86
const LENS_BOOST = 0.72
const LENS_FOLLOW = 22
const LENS_FADE_IN = 60
const LENS_FADE_OUT = 220
const LENS_WOBBLE = 0.22
const LENS_DRIFT = 0.0011
const LENS_ATTACK = 26
const LENS_RELEASE = 420

const LENS_PUSH = 4.5
const SPRING_STIFFNESS = 1600
const SPRING_DAMPING = 68
const SPRING_STEP = 8
const RIPPLE_SPEED = 0.75
const RIPPLE_WIDTH = 30
const RIPPLE_PUSH = 5.8
const RIPPLE_LIFE = 400

const BURST_PRESSES = 7
const BURST_GAP = 500

const BURST_MAX = 2600

type BurstDot = {
  x: number
  y: number
  r: number
  color: string
  vx: number
  vy: number
  spin: number
}

const BURST_SPEED = 800

const BURST_GRAVITY = 850

const BURST_DRAG = 0.72
const BURST_BOUNCE = 0.34
const BURST_FRICTION = 0.82
const BURST_REST = 90

const SOLID = '[data-halftone-solid]'

function scatter(
  lat: {
    x: Float32Array
    y: Float32Array
    width: number
    height: number
    now: { r: Float32Array; rgb: Float32Array; alpha: Float32Array }
  },
  rect: DOMRect,
  from: { clientX: number; clientY: number },
): BurstDot[] {

  const scale = rect.width / lat.width
  const dots: BurstDot[] = []

  const stride = Math.max(1, Math.ceil(lat.x.length / (BURST_MAX * 2)))

  for (let i = 0; i < lat.x.length; i += stride) {

    const alpha = lat.now.alpha[i]!
    if (lat.now.r[i]! <= 0.06 || alpha <= 0.004) continue
    const r = lat.now.r[i]! * scale

    const x = rect.left + lat.x[i]! * scale
    const y = rect.top + lat.y[i]! * scale

    const dx = x - from.clientX
    const dy = y - from.clientY
    const reach = Math.max(40, Math.hypot(rect.width, rect.height) / 2)

    const near = Math.max(0.55, 1 - Math.hypot(dx, dy) / reach)
    const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 2
    const speed = BURST_SPEED * near * (0.35 + Math.random() * 1.1)

    dots.push({
      x,
      y,
      r,
      color: `rgb(${String(Math.round(lat.now.rgb[i * 3]!))} ${String(
        Math.round(lat.now.rgb[i * 3 + 1]!),
      )} ${String(Math.round(lat.now.rgb[i * 3 + 2]!))} / ${alpha.toFixed(2)})`,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 200 * near,
      spin: 0,
    })
  }

  return dots
}

function BurstLayer({ dots, onDone }: { dots: BurstDot[]; onDone: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const surface = canvas.current
    const ctx = surface?.getContext('2d')
    if (!surface || !ctx) return

    const ss = Math.min(2, window.devicePixelRatio || 1)
    const size = () => {
      surface.width = Math.round(window.innerWidth * ss)
      surface.height = Math.round(window.innerHeight * ss)
    }
    size()

    const flying = dots.map((dot) => ({ ...dot, life: 1 }))
    const solids = [...document.querySelectorAll(SOLID)].map((element) =>
      element.getBoundingClientRect(),
    )
    let raf = 0
    let last = 0
    let gone = false

    const frame = (now: number) => {
      if (gone) return
      const dt = Math.min(64, last ? now - last : 16) / 1000
      last = now
      ctx.setTransform(ss, 0, 0, ss, 0, 0)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      let alive = 0
      for (const dot of flying) {
        dot.vy += BURST_GRAVITY * dt

        const drag = Math.pow(BURST_DRAG, dt)
        dot.vx *= drag
        dot.vy *= drag
        dot.x += dot.vx * dt
        dot.y += dot.vy * dt

        for (const box of solids) {
          if (dot.x < box.left - dot.r || dot.x > box.right + dot.r) continue
          if (dot.vy <= 0 || dot.y < box.top || dot.y > box.bottom) continue
          dot.y = box.top
          dot.vy = -dot.vy * BURST_BOUNCE
          dot.vx *= BURST_FRICTION

          if (Math.abs(dot.vy) < BURST_REST) dot.vy = 0
          dot.vx += (dot.x < (box.left + box.right) / 2 ? -1 : 1) * 40
        }
        dot.life = Math.max(0, dot.life - dt * 0.26)
        if (dot.life <= 0) continue
        const onScreen =
          dot.x > -40 && dot.x < window.innerWidth + 40 && dot.y < window.innerHeight + 40
        if (!onScreen) continue
        alive += 1
        ctx.globalAlpha = dot.life
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.r * (0.4 + dot.life * 0.6), 0, Math.PI * 2)
        ctx.fillStyle = dot.color
        ctx.fill()
      }
      ctx.globalAlpha = 1

      if (alive === 0) {
        done.current()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    window.addEventListener('resize', size)
    return () => {
      gone = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [dots])

  return (
    <canvas
      ref={canvas}
      aria-hidden
      data-slot="halftone-burst"
      className="pointer-events-none fixed inset-0 z-50 block size-full"
    />
  )
}

export function HalftoneDots({
  src,
  backdrop,
  gradient,
  accent = '#2563eb',
  cell = CELL,
  spill = SPILL,
  displace = false,
  onBurst,
  className,
  style,
}: {
  src: string
  backdrop?: string
  gradient?: [string, string]
  accent?: string
  /** Grid pitch in CSS pixels. Lower is finer, and costs cells squared. */
  cell?: number
  /**
   * How far outside its own box the canvas paints, in CSS pixels, so dots can
   * swell and scatter past the edge. The grid fills all of it — a wide margin
   * on a fine grid is thousands of cells a frame drawn outside the picture, so
   * keep it near the largest displacement rather than at the default.
   */
  spill?: number
  displace?: boolean
  onBurst?: (presses: readonly number[]) => void
  className?: string
  style?: CSSProperties
}) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const lattice = useRef<{
    cols: number
    rows: number
    x: Float32Array
    y: Float32Array
    w: Float32Array
    maxR: number
    width: number
    height: number
    now: Field
    from: Field
    to: Field
    /** Indices of the cells worth drawing — see where it is built. */
    live: Int32Array
    started: number
    settled: boolean
  } | null>(null)
  const lens = useRef({ x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 })
  const swells = useRef(new Float32Array(0))

  const parting = useRef(displace)
  parting.current = displace
  const springs = useRef({
    ox: new Float32Array(0),
    oy: new Float32Array(0),
    vx: new Float32Array(0),
    vy: new Float32Array(0),
  })
  const ripples = useRef<Array<{ x: number; y: number; at: number }>>([])
  const [burst, setBurst] = useState<BurstDot[] | null>(null)

  const exploded = useRef(false)
  const presses = useRef<number[]>([])

  const gradientKey = gradient ? gradient.join('|') : ''

  const announce = useRef(onBurst)
  announce.current = onBurst
  const told = useRef(false)
  useEffect(() => {
    if (!burst || told.current) return
    told.current = true
    announce.current?.([...presses.current])
  }, [burst])

  useEffect(() => {
    const frame_ = box.current
    const surface = canvas.current
    if (!frame_ || !surface) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let gone = false
    let running = false
    let last = 0

    let image: HTMLImageElement | null = null
    let scene: HTMLImageElement | null = null
    let crop = { sx: 0, sy: 0, sw: 1, sh: 1 }

    const blank = (n: number): Field => ({
      r: new Float32Array(n),
      rgb: new Float32Array(n * 3),
      alpha: new Float32Array(n),
      reveal: new Float32Array(n),
    })

    const paperRgb = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = getComputedStyle(frame_).color
      return hexRgb(String(ctx.fillStyle).slice(0, 7))
    }

    const sample = (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => {
      const boxW = frame_.clientWidth
      const boxH = frame_.clientHeight
      const width = boxW + spill * 2
      const height = boxH + spill * 2
      const cols = Math.max(1, Math.round(width / cell))
      const rows = Math.max(1, Math.round(height / cell))
      const cw = width / cols
      const ch = height / rows
      const maxR = Math.min(cw, ch) / 2
      const n = cols * rows

      // The corner marks sit outside the picture, so they can only sit as far
      // out as the canvas reaches. On a narrow spill they come in to meet it
      // rather than being drawn off the edge.
      const out = Math.min(MARK_INSET, spill)
      const frameX = spill - out + MARK_CLEAR
      const frameY = spill - out + MARK_CLEAR
      const frameW = boxW + out * 2 - MARK_CLEAR * 2
      const frameH = boxH + out * 2 - MARK_CLEAR * 2
      const fadeX = spill - out
      const fadeY = spill - out
      const fadeW = boxW + out * 2
      const fadeH = boxH + out * 2
      const fadeReach = Math.max(1, spill - out)

      const bw = cols * SUP
      const bh = rows * SUP
      const px = bw / width
      const { sx, sy, sw, sh } = crop
      const fit = Math.min((frameW * px) / sw, (frameH * px) / sh)
      const dw = sw * fit
      const dh = sh * fit
      const dx0 = (frameX + frameW / 2) * px - dw / 2
      const dy0 = (frameY + frameH) * px - dh
      const buffer = () => {
        const sampler = document.createElement('canvas')
        sampler.width = bw
        sampler.height = bh
        return sampler.getContext('2d')
      }
      const sctx = buffer()
      if (!sctx) return null
      sctx.drawImage(img, sx, sy, sw, sh, dx0, dy0, dw, dh)
      const data = sctx.getImageData(0, 0, bw, bh).data

      let behind: Uint8ClampedArray | null = null
      if (scene) {
        const bctx = buffer()
        if (bctx) {
          bctx.beginPath()
          bctx.rect(frameX * px, frameY * px, frameW * px, frameH * px)
          bctx.clip()
          bctx.drawImage(
            scene,
            dx0 - sx * fit,
            dy0 - sy * fit,
            scene.width * fit,
            scene.height * fit,
          )
          behind = bctx.getImageData(0, 0, bw, bh).data
        }
      }

      const paper = paperRgb(ctx)

      const darkPaper = (0.299 * paper[0] + 0.587 * paper[1] + 0.114 * paper[2]) / 255 > 0.5
      const ink = hexRgb(accent)
      const top = gradient ? hexRgb(gradient[0]) : null
      const bottom = gradient ? hexRgb(gradient[1]) : null
      const rowTop = frameY / ch
      const rowSpan = frameH / ch

      const x = new Float32Array(n)
      const y = new Float32Array(n)
      const w = new Float32Array(n)
      const field = blank(n)
      const coverage = new Float32Array(n)
      const lum = new Float32Array(n)
      let darkest = 1
      let lightest = 0

      const latent = new Uint8Array(n)
      let sceneDarkest = 1
      let sceneLightest = 0
      const cx = width / 2
      const cy = height / 2
      const reachOut = Math.hypot(frameW / 2, frameH / 2) || 1

      for (let yy = 0; yy < rows; yy += 1) {
        for (let xx = 0; xx < cols; xx += 1) {
          const i = yy * cols + xx
          x[i] = (xx + 0.5) * cw
          y[i] = (yy + 0.5) * ch
          w[i] = Math.min(1, Math.hypot(x[i]! - cx, y[i]! - cy) / reachOut)
          let cr = 0
          let cg = 0
          let cb = 0
          let ink = 0
          const read = (pixels: Uint8ClampedArray) => {
            for (let sy2 = 0; sy2 < SUP; sy2 += 1) {
              for (let sx2 = 0; sx2 < SUP; sx2 += 1) {
                const k = ((yy * SUP + sy2) * bw + (xx * SUP + sx2)) * 4
                if (pixels[k + 3]! < 24) continue
                const r0 = pixels[k]!
                const g0 = pixels[k + 1]!
                const b0 = pixels[k + 2]!

                if ((0.299 * r0 + 0.587 * g0 + 0.114 * b0) / 255 > 0.92) continue
                cr += r0
                cg += g0
                cb += b0
                ink += 1
              }
            }
          }
          const color = () => {
            if (top && bottom) {
              const t = Math.min(1, Math.max(0, (yy - rowTop) / (rowSpan || 1)))
              field.rgb[i * 3] = top[0] + (bottom[0] - top[0]) * t
              field.rgb[i * 3 + 1] = top[1] + (bottom[1] - top[1]) * t
              field.rgb[i * 3 + 2] = top[2] + (bottom[2] - top[2]) * t
            } else {
              field.rgb[i * 3] = cr / ink
              field.rgb[i * 3 + 1] = cg / ink
              field.rgb[i * 3 + 2] = cb / ink
            }
          }
          read(data)
          if (ink === 0 && behind) {
            read(behind)
            if (ink > 0) {
              latent[i] = 1
              coverage[i] = ink / (SUP * SUP)
              lum[i] = (0.299 * cr + 0.587 * cg + 0.114 * cb) / ink / 255
              if (lum[i]! < sceneDarkest) sceneDarkest = lum[i]!
              if (lum[i]! > sceneLightest) sceneLightest = lum[i]!
              field.alpha[i] = LATENT_ALPHA
              field.reveal[i] = 1 - LATENT_ALPHA
              color()
              if (!top || !bottom) {

                const peak = Math.max(
                  field.rgb[i * 3]!,
                  field.rgb[i * 3 + 1]!,
                  field.rgb[i * 3 + 2]!,
                )
                if (peak > 0 && peak < LATENT_LIFT) {
                  const lift = LATENT_LIFT / peak
                  field.rgb[i * 3] = field.rgb[i * 3]! * lift
                  field.rgb[i * 3 + 1] = field.rgb[i * 3 + 1]! * lift
                  field.rgb[i * 3 + 2] = field.rgb[i * 3 + 2]! * lift
                }
              }
              continue
            }
          }
          if (ink === 0) {
            const dx = Math.max(fadeX - x[i]!, 0, x[i]! - (fadeX + fadeW))
            const dy = Math.max(fadeY - y[i]!, 0, y[i]! - (fadeY + fadeH))
            const out = Math.hypot(dx, dy) / fadeReach
            const fade = out >= 1 ? 0 : (1 - out) * (1 - out)
            field.r[i] = fade > 0 ? maxR * PAPER_R : 0
            field.alpha[i] = PAPER_ALPHA * fade
            field.rgb[i * 3] = paper[0]
            field.rgb[i * 3 + 1] = paper[1]
            field.rgb[i * 3 + 2] = paper[2]
            continue
          }
          coverage[i] = ink / (SUP * SUP)
          lum[i] = (0.299 * cr + 0.587 * cg + 0.114 * cb) / ink / 255
          if (lum[i]! < darkest) darkest = lum[i]!
          if (lum[i]! > lightest) lightest = lum[i]!
          field.alpha[i] = 1
          color()
        }
      }

      const range = lightest - darkest || 1
      let inked = 0
      const mean = [0, 0, 0]
      for (let i = 0; i < n; i += 1) {
        if (field.alpha[i] !== 1) continue
        inked += 1
        mean[0]! += field.rgb[i * 3]!
        mean[1]! += field.rgb[i * 3 + 1]!
        mean[2]! += field.rgb[i * 3 + 2]!
      }
      for (let k = 0; k < 3; k += 1) mean[k]! /= inked || 1
      const spread = (t: number) => {
        const c = t - 0.5
        return Math.min(
          1,
          Math.max(0, 0.5 + Math.sign(c) * Math.pow(Math.abs(c) * 2, 1 / TONE_CONTRAST) * 0.5),
        )
      }
      const sceneRange = sceneLightest - sceneDarkest || 1
      for (let i = 0; i < n; i += 1) {
        if (latent[i]) {

          const tone = spread(
            (darkPaper ? lum[i]! - sceneDarkest : sceneLightest - lum[i]!) / sceneRange,
          )
          field.r[i] = maxR * (LATENT_FLOOR + coverage[i]! * LATENT_COVERAGE + tone * LATENT_TONE)
          continue
        }
        if (field.alpha[i] !== 1) continue
        const tone = spread((lightest - lum[i]!) / range)
        field.r[i] =
          maxR * Math.min(0.92, DOT_FLOOR + coverage[i]! * DOT_COVERAGE + tone * DOT_TONE)
        if (!top || !bottom) {
          for (let k = 0; k < 3; k += 1) {
            const v = mean[k]! + (field.rgb[i * 3 + k]! - mean[k]!) * COLOR_CONTRAST
            field.rgb[i * 3 + k] = Math.min(255, Math.max(0, v))
          }
        }
      }

      const setMark = (col: number, row: number) => {
        if (col < 0 || row < 0 || col >= cols || row >= rows) return
        const i = row * cols + col
        field.r[i] = maxR * MARK_R
        field.alpha[i] = 1
        field.rgb[i * 3] = ink[0]
        field.rgb[i * 3 + 1] = ink[1]
        field.rgb[i * 3 + 2] = ink[2]
      }
      const colA = Math.round(fadeX / cw)
      const colB = Math.round((fadeX + fadeW) / cw) - 1
      const rowA = Math.round(fadeY / ch)
      const rowB = Math.round((fadeY + fadeH) / ch) - 1
      for (const [col, row, dc, dr] of [
        [colA, rowA, 1, 1],
        [colB, rowA, -1, 1],
        [colA, rowB, 1, -1],
        [colB, rowB, -1, -1],
      ] as const) {
        setMark(col + dc, row)
        setMark(col, row + dr)
        setMark(col + dc, row + dr)
      }

      return { cols, rows, x, y, w, maxR, width, height, field }
    }

    const render = (animate: boolean) => {
      const ctx = surface.getContext('2d')
      if (!image || !ctx || gone) return
      const laid = sample(ctx, image)
      if (!laid) return
      const { cols, rows, x, y, w, maxR, width, height, field } = laid
      const n = cols * rows

      // One canvas pixel per screen pixel, no more. These are dots: the extra
      // half-ratio bought nothing an eye can find on them, and cost every
      // frame more than twice the fill.
      const ss = Math.min(2, window.devicePixelRatio || 1)
      surface.width = Math.round(width * ss)
      surface.height = Math.round(height * ss)
      ctx.setTransform(ss, 0, 0, ss, 0, 0)

      const previous = lattice.current
      const sameGrid = previous !== null && previous.cols === cols && previous.rows === rows
      const morph = animate && !still && sameGrid
      const from = blank(n)
      if (sameGrid && previous) {
        from.r.set(previous.now.r)
        from.rgb.set(previous.now.rgb)
        from.alpha.set(previous.now.alpha)
        from.reveal.set(previous.now.reveal)
      } else {
        from.r.set(field.r)
        from.rgb.set(field.rgb)
        from.alpha.set(field.alpha)
        from.reveal.set(field.reveal)
      }
      const now = blank(n)
      now.r.set(from.r)
      now.rgb.set(from.rgb)
      now.alpha.set(from.alpha)
      now.reveal.set(from.reveal)

      // The cells that will ever put ink down. A masked image is mostly empty
      // — the canvas is square, the picture inside it is a circle, and it
      // paints a margin outside itself so dots can burst past the edge — so
      // better than half of this grid is blank. Walking it anyway cost a
      // distance check, a spring step and a lens lookup per cell per frame,
      // all to decide not to draw. Collected once per layout instead, and the
      // frame walks only these.
      const alive: number[] = []
      for (let i = 0; i < n; i += 1) {
        const drawn = (r: Float32Array, a: Float32Array) => r[i]! > 0.06 && a[i]! > 0.004
        if (drawn(field.r, field.alpha) || drawn(from.r, from.alpha) || field.reveal[i]! > 0.004) {
          alive.push(i)
        }
      }

      lattice.current = {
        cols,
        rows,
        x,
        y,
        w,
        maxR,
        width,
        height,
        now,
        from,
        to: field,
        live: Int32Array.from(alive),
        started: performance.now(),
        settled: !morph,
      }
      // Laid out again, so whatever was kept of the old picture is stale.
      restReady = false
      if (!sameGrid) {
        swells.current = new Float32Array(n)
        springs.current = {
          ox: new Float32Array(n),
          oy: new Float32Array(n),
          vx: new Float32Array(n),
          vy: new Float32Array(n),
        }
      }
      ensureLoop()
    }

    /* ── drawing the dots in groups ───────────────────────────────────────
       A `fill()` per dot is what makes this expensive: a picture this size is
       ten thousand of them, and ten thousand fills do not fit in a frame. But
       a halftone of one photograph is not ten thousand different colours — it
       is a few dozen, each used hundreds of times. So the dots are sorted into
       buckets by colour and opacity, every dot in a bucket is added to one
       path, and the bucket is filled once. Same picture, two orders of
       magnitude fewer calls.

       Opacity is rounded to a thirty-second, which is finer than an eye
       resolves on a 3px dot and is what keeps the bucket count down. The
       buffers are kept between frames and refilled, so a frame allocates
       nothing. */
    type Clump = { style: string; alpha: number; n: number; xs: Float32Array; ys: Float32Array; rs: Float32Array; fs: Float32Array }
    const clumps = new Map<number, Clump>()
    let clumpList: Clump[] = []

    const batch = (red: number, green: number, blue: number, alpha: number, cx: number, cy: number, r: number, full: number) => {
      const rr = Math.round(red)
      const gg = Math.round(green)
      const bb = Math.round(blue)
      // One integer, built with shifts — a string key here would be an
      // allocation per dot per frame, which is thousands of short-lived
      // strings a second and a collector running through the animation.
      // Coarse on purpose. A halftone carries its tone in the size of the dot,
      // not in the exact colour of it, so rounding the colour to 32 levels a
      // channel and the opacity to sixteenths costs nothing an eye can find —
      // and it is the difference between a few hundred groups and a few
      // thousand, which is the difference between batching and not.
      const step = Math.max(1, Math.min(16, Math.round(alpha * 16)))
      const key = (((rr >> 3) << 14) | ((gg >> 3) << 9) | ((bb >> 3) << 4) | (step - 1)) >>> 0
      let c = clumps.get(key)
      if (!c) {
        c = {
          style: `rgb(${String(rr)} ${String(gg)} ${String(bb)})`,
          alpha: step / 16,
          n: 0,
          xs: new Float32Array(256),
          ys: new Float32Array(256),
          rs: new Float32Array(256),
          fs: new Float32Array(256),
        }
        clumps.set(key, c)
        clumpList.push(c)
      }
      if (c.n === c.xs.length) {
        const grow = (a: Float32Array) => {
          const b = new Float32Array(a.length * 2)
          b.set(a)
          return b
        }
        c.xs = grow(c.xs)
        c.ys = grow(c.ys)
        c.rs = grow(c.rs)
        c.fs = grow(c.fs)
      }
      c.xs[c.n] = cx
      c.ys[c.n] = cy
      c.rs[c.n] = r
      c.fs[c.n] = full
      c.n += 1
    }

    const flush = (ctx: CanvasRenderingContext2D) => {
      for (let k = 0; k < clumpList.length; k += 1) {
        const c = clumpList[k]!
        if (c.n === 0) continue
        ctx.globalAlpha = c.alpha
        ctx.fillStyle = c.style
        ctx.beginPath()
        for (let j = 0; j < c.n; j += 1) {
          const cx = c.xs[j]!
          const cy = c.ys[j]!
          const r = c.rs[j]!
          const full = c.fs[j]!
          if (full > 0) {
            const corner = r * (1 - (1 - FULL_CORNER) * full)
            ctx.roundRect(cx - r, cy - r, r * 2, r * 2, corner)
          } else {
            ctx.moveTo(cx + r, cy)
            ctx.arc(cx, cy, r, 0, Math.PI * 2)
          }
        }
        ctx.fill()
        c.n = 0
      }
      // A bucket nobody used this frame is a colour that has left the picture.
      // Dropped, so a long-lived canvas does not accumulate every shade it has
      // ever drawn and walk them all every frame.
      if (clumpList.length > 512) {
        clumps.clear()
        clumpList = []
      }
    }

    /* The picture standing still, drawn once and blitted every frame after.
       Rebuilt whenever the dots are relaid — a resize, a theme, a new image —
       and whenever the picture next comes to rest. */
    let rest: HTMLCanvasElement | null = null
    let restReady = false
    let residueLast = 0
    const hole = new Float32Array(4)
    const holeLast = new Float32Array(4)

    const paintRest = (lat: NonNullable<typeof lattice.current>) => {
      rest ??= document.createElement('canvas')
      const scale = surface.width / lat.width
      rest.width = surface.width
      rest.height = surface.height
      const rctx = rest.getContext('2d')
      if (!rctx) return
      rctx.setTransform(scale, 0, 0, scale, 0, 0)
      rctx.clearRect(0, 0, lat.width, lat.height)
      const { x, y, maxR, now: cur, live } = lat
      for (let li = 0; li < live.length; li += 1) {
        const i = live[li]!
        const r = cur.r[i]!
        const a = cur.alpha[i]!
        if (r <= 0.06 || a <= 0.004) continue
        const full = Math.min(1, Math.max(0, (r / maxR - FULL_FROM) / (1 - FULL_FROM)))
        batch(cur.rgb[i * 3]!, cur.rgb[i * 3 + 1]!, cur.rgb[i * 3 + 2]!, a, x[i]!, y[i]!, r, full)
      }
      flush(rctx)
      rctx.globalAlpha = 1
      restReady = true
    }

    const reach = (angle: number, now: number) =>
      LENS_RADIUS *
      (1 +
        LENS_WOBBLE *
          (0.5 * Math.sin(3 * angle + now * LENS_DRIFT) +
            0.32 * Math.sin(5 * angle - now * LENS_DRIFT * 1.7) +
            0.18 * Math.sin(2 * angle + now * LENS_DRIFT * 0.6)))
    let pushX = 0
    let pushY = 0
    const ask = (x: number, y: number, now: number) => {
      pushX = 0
      pushY = 0
      const l = lens.current
      if (l.strength <= 0.001) return 0
      const dx = x - l.x
      const dy = y - l.y
      const d2 = dx * dx + dy * dy
      // Squared first: most dots are outside the lens, and this turns the
      // common answer into a multiply and a compare instead of a square root.
      const edge = LENS_RADIUS * (1 + LENS_WOBBLE)
      if (d2 >= edge * edge) return 0
      const dist = Math.sqrt(d2)
      const d = dist / reach(Math.atan2(dy, dx), now)
      if (d >= 1) return 0
      const falloff = (1 - d * d) * (1 - d * d)

      if (parting.current) {
        const shove = (l.strength * LENS_PUSH * 6.75 * d * (1 - d) * (1 - d)) / (dist || 1)
        pushX = dx * shove
        pushY = dy * shove
      }
      return l.strength * falloff
    }

    const frame = (now: number) => {
      const ctx = surface.getContext('2d')
      const lat = lattice.current
      if (!ctx || !lat || gone) return
      if (exploded.current) {
        ctx.clearRect(0, 0, lat.width, lat.height)
        running = false
        last = 0
        return
      }
      const dt = last ? Math.min(64, now - last) : 16
      last = now

      const l = lens.current
      const follow = 1 - Math.exp(-dt / LENS_FOLLOW)
      l.x += (l.tx - l.x) * follow
      l.y += (l.ty - l.y) * follow
      const fade = 1 - Math.exp(-dt / (l.target > l.strength ? LENS_FADE_IN : LENS_FADE_OUT))
      l.strength += (l.target - l.strength) * fade
      if (Math.abs(l.target - l.strength) < 0.002) l.strength = l.target
      const up = 1 - Math.exp(-dt / LENS_ATTACK)
      const down = 1 - Math.exp(-dt / LENS_RELEASE)
      const held = swells.current
      const { ox, oy, vx, vy } = springs.current

      const pieces = Math.max(1, Math.ceil(dt / SPRING_STEP))
      const step = dt / pieces / 1000
      let residue = 0

      const rings = ripples.current
      for (let k = rings.length - 1; k >= 0; k -= 1) {
        if (now - rings[k]!.at > RIPPLE_LIFE * 2.5) rings.splice(k, 1)
      }
      const ringR = rings.map((ring) => (now - ring.at) * RIPPLE_SPEED)
      const ringAmp = rings.map((ring) => Math.exp(-(now - ring.at) / RIPPLE_LIFE))

      const el = now - lat.started
      let settled = true
      const { x, y, w, maxR, now: cur, from, to, live } = lat

      /* Only the dots the pointer is actually touching are redrawn.

         Everything else is already on a second canvas, painted once, sitting
         exactly as it will sit until something disturbs it — so a frame is a
         blit of that, a hole punched where the pointer is, and a few thousand
         dots drawn back into the hole. It used to be every dot in the picture,
         every frame, which is tens of thousands of antialiased circles a
         second for a picture that is standing still everywhere but one spot.

         The hole is the lens and any ripple, grown by the furthest a dot can
         be shoved, and joined with where the hole was last frame — otherwise a
         quick drag leaves the dots it has just passed frozen mid-flinch. */
      // The shove is a fraction of LENS_PUSH once the falloff has had its say,
      // so three times it is already generous. Padding it by ten put the hole
      // across most of the picture, which is the thing this is avoiding.
      const reachNow = LENS_RADIUS * (1 + LENS_WOBBLE) + LENS_PUSH * 3
      let hx0 = Infinity
      let hy0 = Infinity
      let hx1 = -Infinity
      let hy1 = -Infinity
      const touch = (cx: number, cy: number, r: number) => {
        if (cx - r < hx0) hx0 = cx - r
        if (cy - r < hy0) hy0 = cy - r
        if (cx + r > hx1) hx1 = cx + r
        if (cy + r > hy1) hy1 = cy + r
      }
      if (l.strength > 0.001 || residueLast > 0) touch(l.x, l.y, reachNow)
      for (let k = 0; k < rings.length; k += 1) {
        touch(rings[k]!.x, rings[k]!.y, ringR[k]! + RIPPLE_WIDTH * 2.5 + RIPPLE_PUSH * 3)
      }

      const partial = restReady && lat.settled && hx1 > hx0
      if (partial && rest) {
        const px0 = Math.max(0, Math.min(hx0, holeLast[0]))
        const py0 = Math.max(0, Math.min(hy0, holeLast[1]))
        const px1 = Math.min(lat.width, Math.max(hx1, holeLast[2]))
        const py1 = Math.min(lat.height, Math.max(hy1, holeLast[3]))
        ctx.clearRect(0, 0, lat.width, lat.height)
        ctx.drawImage(rest, 0, 0, lat.width, lat.height)
        ctx.clearRect(px0, py0, px1 - px0, py1 - py0)
        hole[0] = px0
        hole[1] = py0
        hole[2] = px1
        hole[3] = py1
      } else {
        ctx.clearRect(0, 0, lat.width, lat.height)
        hole[0] = 0
        hole[1] = 0
        hole[2] = lat.width
        hole[3] = lat.height
      }
      holeLast[0] = hx0 === Infinity ? 0 : hx0
      holeLast[1] = hy0 === Infinity ? 0 : hy0
      holeLast[2] = hx1 === -Infinity ? 0 : hx1
      holeLast[3] = hy1 === -Infinity ? 0 : hy1

      for (let li = 0; li < live.length; li += 1) {
        const i = live[li]!
        // Outside the hole the dot is already on screen, from the blit.
        if (partial) {
          const bx = x[i]!
          const by = y[i]!
          if (bx < hole[0] || bx > hole[2] || by < hole[1] || by > hole[3]) continue
        }
        if (!lat.settled) {
          const t = Math.min(1, Math.max(0, (el - w[i]! * MORPH_STAGGER) / MORPH))
          if (t < 1) settled = false
          const e = easeInOut(t)

          const dip = 1 - MORPH_DIP * Math.sin(Math.PI * t)
          cur.r[i] = (from.r[i]! + (to.r[i]! - from.r[i]!) * e) * dip
          cur.alpha[i] = from.alpha[i]! + (to.alpha[i]! - from.alpha[i]!) * e
          cur.reveal[i] = from.reveal[i]! + (to.reveal[i]! - from.reveal[i]!) * e
          cur.rgb[i * 3] = from.rgb[i * 3]! + (to.rgb[i * 3]! - from.rgb[i * 3]!) * e
          cur.rgb[i * 3 + 1] =
            from.rgb[i * 3 + 1]! + (to.rgb[i * 3 + 1]! - from.rgb[i * 3 + 1]!) * e
          cur.rgb[i * 3 + 2] =
            from.rgb[i * 3 + 2]! + (to.rgb[i * 3 + 2]! - from.rgb[i * 3 + 2]!) * e
        }
        const want = ask(x[i]!, y[i]!, now)

        let ring = 0
        for (let k = 0; k < rings.length; k += 1) {
          const dx = x[i]! - rings[k]!.x
          const dy = y[i]! - rings[k]!.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const u = (dist - ringR[k]!) / RIPPLE_WIDTH
          if (u < -2.5 || u > 2.5) continue
          const bell = Math.exp(-u * u) * ringAmp[k]!
          if (bell > ring) ring = bell
          const shove = (RIPPLE_PUSH * bell) / (dist || 1)
          pushX += dx * shove
          pushY += dy * shove
        }
        const have = held[i]!
        const next = have + (want - have) * (want > have ? up : down)
        held[i] = next < 0.002 && want === 0 ? 0 : next
        if (held[i]! > residue) residue = held[i]!
        for (let p = 0; p < pieces; p += 1) {
          vx[i] = vx[i]! + (SPRING_STIFFNESS * (pushX - ox[i]!) - SPRING_DAMPING * vx[i]!) * step
          vy[i] = vy[i]! + (SPRING_STIFFNESS * (pushY - oy[i]!) - SPRING_DAMPING * vy[i]!) * step
          ox[i] = ox[i]! + vx[i]! * step
          oy[i] = oy[i]! + vy[i]! * step
        }
        const moving = Math.abs(ox[i]!) + Math.abs(oy[i]!) + Math.abs(vx[i]!) + Math.abs(vy[i]!)
        if (moving < 0.02 && pushX === 0 && pushY === 0) {
          ox[i] = oy[i] = vx[i] = vy[i] = 0
        } else if (moving > residue) {
          residue = moving
        }
        const lift = Math.max(held[i]!, ring)

        const boost = cur.reveal[i]! > 0 ? LENS_BOOST * LATENT_BOOST : LENS_BOOST
        const r = Math.min(maxR * FULL_GROW, cur.r[i]! * (1 + boost * lift))
        const a = cur.alpha[i]! + cur.reveal[i]! * lift
        if (r <= 0.06 || a <= 0.004) continue

        const cx = x[i]! + ox[i]!
        const cy = y[i]! + oy[i]!
        const full = Math.min(1, Math.max(0, (r / maxR - FULL_FROM) / (1 - FULL_FROM)))
        batch(
          cur.rgb[i * 3]!,
          cur.rgb[i * 3 + 1]!,
          cur.rgb[i * 3 + 2]!,
          a,
          cx,
          cy,
          r,
          full,
        )
      }
      flush(ctx)
      ctx.globalAlpha = 1
      if (settled) lat.settled = true
      residueLast = residue

      // The picture has arrived and nothing is touching it: this is what it
      // looks like at rest, so keep a copy to blit from here on.
      if (lat.settled && !restReady && l.strength <= 0.001 && residue === 0 && rings.length === 0) {
        paintRest(lat)
      }

      if (!lat.settled || l.strength > 0 || residue > 0 || rings.length > 0) {
        raf.current = requestAnimationFrame(frame)
      } else {
        running = false
        last = 0
      }
    }

    const ensureLoop = () => {
      if (running) return
      running = true
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(frame)
    }

    const hoverable = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !still
    const aim = (event: PointerEvent) => {
      const lat = lattice.current
      if (!lat) return
      const rect = surface.getBoundingClientRect()
      const l = lens.current
      const px = ((event.clientX - rect.left) / rect.width) * lat.width
      const py = ((event.clientY - rect.top) / rect.height) * lat.height
      if (l.target === 0) {
        l.x = px
        l.y = py
      }
      l.tx = px
      l.ty = py
      l.target = 1
      ensureLoop()
    }
    const leave = () => {
      lens.current.target = 0
      ensureLoop()
    }
    const drop = (event: PointerEvent) => {
      const lat = lattice.current
      if (!lat) return

      if (!still && !exploded.current) {
        const at = performance.now()
        const previous = presses.current.at(-1) ?? 0
        presses.current = at - previous < BURST_GAP ? [...presses.current, at] : [at]
        if (presses.current.length >= BURST_PRESSES) {
          const dots = scatter(lat, surface.getBoundingClientRect(), event)

          if (dots.length > 0) {
            exploded.current = true
            setBurst(dots)
            ensureLoop()
            return
          }
        }
      }

      if (still) return
      const rect = surface.getBoundingClientRect()
      ripples.current.push({
        x: ((event.clientX - rect.left) / rect.width) * lat.width,
        y: ((event.clientY - rect.top) / rect.height) * lat.height,
        at: performance.now(),
      })
      ensureLoop()
    }
    frame_.addEventListener('pointerdown', drop)
    if (hoverable) {
      frame_.addEventListener('pointermove', aim)
      frame_.addEventListener('pointerleave', leave)
    }

    const measure = (img: HTMLImageElement) => {
      const scale = Math.min(1, 256 / Math.max(img.width, img.height))
      const w = Math.max(1, Math.round(img.width * scale))
      const h = Math.max(1, Math.round(img.height * scale))
      const probe = document.createElement('canvas')
      probe.width = w
      probe.height = h
      const pctx = probe.getContext('2d')
      if (!pctx) return { sx: 0, sy: 0, sw: img.width, sh: img.height }
      pctx.drawImage(img, 0, 0, w, h)
      const { data } = pctx.getImageData(0, 0, w, h)
      let left = w
      let right = -1
      let top = h
      let bottom = -1
      for (let yy = 0; yy < h; yy += 1) {
        for (let xx = 0; xx < w; xx += 1) {
          const i = (yy * w + xx) * 4
          if (data[i + 3]! < 24) continue
          if ((0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!) / 255 > 0.92)
            continue
          if (xx < left) left = xx
          if (xx > right) right = xx
          if (yy < top) top = yy
          if (yy > bottom) bottom = yy
        }
      }
      if (right < left) return { sx: 0, sy: 0, sw: img.width, sh: img.height }
      return {
        sx: left / scale,
        sy: top / scale,
        sw: (right - left + 1) / scale,
        sh: (bottom - top + 1) / scale,
      }
    }

    let waiting = backdrop ? 2 : 1
    const arrived = () => {
      waiting -= 1
      if (waiting > 0 || gone || !image) return
      crop = measure(image)
      render(true)
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      image = img
      arrived()
    }
    img.src = src
    if (backdrop) {
      const behind = new Image()
      behind.crossOrigin = 'anonymous'
      behind.onload = () => {
        scene = behind
        arrived()
      }
      behind.onerror = arrived
      behind.src = backdrop
    }

    const watcher = new ResizeObserver(() => render(false))
    watcher.observe(frame_)

    const themed = new MutationObserver(() => render(false))
    themed.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => {
      gone = true
      cancelAnimationFrame(raf.current)
      watcher.disconnect()
      themed.disconnect()
      frame_.removeEventListener('pointermove', aim)
      frame_.removeEventListener('pointerleave', leave)
      frame_.removeEventListener('pointerdown', drop)
    }

  }, [src, backdrop, gradientKey, accent])

  return (
    <div ref={box} data-slot="halftone-dots" className={cn('relative', className)} style={style}>

      <canvas
        ref={canvas}
        aria-hidden
        className="pointer-events-none absolute block"
        style={{
          inset: -spill,
          width: `calc(100% + ${String(spill * 2)}px)`,
          height: `calc(100% + ${String(spill * 2)}px)`,
        }}
      />

      {burst
        ? createPortal(<BurstLayer dots={burst} onDone={() => setBurst(null)} />, document.body)
        : null}
    </div>
  )
}
