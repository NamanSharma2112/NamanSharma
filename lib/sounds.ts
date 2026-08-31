/**
 * Genuine Mechanical Keyboard click sounds.
 * Sharp plastic clack with a bottoming-out thud.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Mechanical keyboard click (downstroke).
 * Sharp high-frequency transient + bottoming out thock.
 */
export function playTap() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // The sharp plastic click mechanism (high frequency click/snap)
  const click = ctx.createOscillator();
  const clickGain = ctx.createGain();
  click.type = "square";
  click.frequency.setValueAtTime(2000, now);
  click.frequency.exponentialRampToValueAtTime(400, now + 0.015);
  clickGain.gain.setValueAtTime(0.1, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
  click.connect(clickGain);
  clickGain.connect(ctx.destination);
  click.start(now);
  click.stop(now + 0.03);

  // Bottoming out thud (low-mid resonance of the keycap hitting the switch housing)
  const thud = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thud.type = "sine";
  thud.frequency.setValueAtTime(150, now);
  thud.frequency.exponentialRampToValueAtTime(50, now + 0.05);
  thudGain.gain.setValueAtTime(0.3, now);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  thud.connect(thudGain);
  thudGain.connect(ctx.destination);
  thud.start(now);
  thud.stop(now + 0.06);

  // Keycap resonance (mid-high ringing of the plastic)
  const ring = ctx.createOscillator();
  const ringGain = ctx.createGain();
  ring.type = "sine";
  ring.frequency.setValueAtTime(800, now);
  ring.frequency.exponentialRampToValueAtTime(400, now + 0.04);
  ringGain.gain.setValueAtTime(0.04, now);
  ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  ring.connect(ringGain);
  ringGain.connect(ctx.destination);
  ring.start(now);
  ring.stop(now + 0.06);
}

/**
 * Mechanical keyboard release (upstroke).
 * Used for toggles to give that satisfying "click-clack" feeling.
 */
export function playToggle() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Downstroke (playTap)
  playTap();

  // Upstroke (delayed to simulate switch release)
  const upNow = now + 0.06;

  // Upstroke clack (higher pitch, less bass since it's hitting the top housing)
  const clack = ctx.createOscillator();
  const clackGain = ctx.createGain();
  clack.type = "square";
  clack.frequency.setValueAtTime(2500, upNow);
  clack.frequency.exponentialRampToValueAtTime(800, upNow + 0.02);
  clackGain.gain.setValueAtTime(0.06, upNow);
  clackGain.gain.exponentialRampToValueAtTime(0.001, upNow + 0.03);
  clack.connect(clackGain);
  clackGain.connect(ctx.destination);
  clack.start(upNow);
  clack.stop(upNow + 0.04);
  
  // High resonance for the top housing impact
  const ring = ctx.createOscillator();
  const ringGain = ctx.createGain();
  ring.type = "sine";
  ring.frequency.setValueAtTime(1200, upNow);
  ring.frequency.exponentialRampToValueAtTime(600, upNow + 0.03);
  ringGain.gain.setValueAtTime(0.03, upNow);
  ringGain.gain.exponentialRampToValueAtTime(0.001, upNow + 0.04);
  ring.connect(ringGain);
  ringGain.connect(ctx.destination);
  ring.start(upNow);
  ring.stop(upNow + 0.05);
}

/* ── the cabin ──────────────────────────────────────────────────────────────
   Everything below is synthesised rather than loaded, so the whole cabin costs
   no bytes and never waits on a file. Each of these only ever fires from a
   real interaction, which is also what unlocks the audio context. */

/** Filtered noise — the body of any sliding or rushing sound. */
function noise(
  ctx: AudioContext,
  start: number,
  duration: number,
  {
    gain = 0.08,
    from = 900,
    to = 500,
    q = 1,
    type = "bandpass" as BiquadFilterType,
  } = {}
) {
  const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.setValueAtTime(from, start);
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), start + duration);
  filter.Q.value = q;

  const envelope = ctx.createGain();
  // Swells in and dies away, so a slide reads as a slide rather than a burst.
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(gain, start + duration * 0.28);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  source.connect(filter);
  filter.connect(envelope);
  envelope.connect(ctx.destination);
  source.start(start);
  source.stop(start + duration);
}

/** A short knock — the shade meeting the frame, or a card meeting a stop. */
function knock(ctx: AudioContext, start: number, frequency = 180, gain = 0.16) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(frequency, start);
  osc.frequency.exponentialRampToValueAtTime(frequency * 0.45, start + 0.06);
  env.gain.setValueAtTime(gain, start);
  env.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + 0.09);
}

/** Pulling the shade down: a long plastic slide that lands on the sill. */
export function playShadeClose() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  noise(ctx, now, 0.34, { gain: 0.05, from: 1400, to: 420, q: 0.8 });
  knock(ctx, now + 0.33, 165, 0.14);
}

/** Letting it up: the same slide, running the other way, ending lighter. */
export function playShadeOpen() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  noise(ctx, now, 0.3, { gain: 0.045, from: 520, to: 1500, q: 0.8 });
  knock(ctx, now + 0.29, 240, 0.09);
}

/** A card dragged through a reader — grain, then the stop at the end. */
export function playSwipe() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  noise(ctx, now, 0.22, { gain: 0.06, from: 2200, to: 700, q: 0.6 });
  knock(ctx, now + 0.2, 210, 0.1);
}

/** The reader accepting: the two-tone chime every gate in the world makes. */
export function playAccept() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  [
    { at: now, hz: 880 },
    { at: now + 0.13, hz: 1320 },
  ].forEach(({ at, hz }) => {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(hz, at);
    env.gain.setValueAtTime(0.0001, at);
    env.gain.exponentialRampToValueAtTime(0.13, at + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    osc.connect(env);
    env.connect(ctx.destination);
    osc.start(at);
    osc.stop(at + 0.24);
  });
}

/** A window opening: a short rising sweep that lands on a soft click. */
export function playWindowOpen() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  noise(ctx, now, 0.16, { gain: 0.035, from: 400, to: 1600, q: 0.7 });
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}

/** Closing: the same shape upside down, ending in a small wooden knock. */
export function playWindowClose() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  noise(ctx, now, 0.13, { gain: 0.03, from: 1500, to: 380, q: 0.7 });
  knock(ctx, now + 0.1, 200, 0.09);
}

/** Folding away: a quick downward sweep, quieter than closing outright. */
export function playMinimise() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(620, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.14);
  env.gain.setValueAtTime(0.0001, now);
  env.gain.exponentialRampToValueAtTime(0.045, now + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(env);
  env.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}
