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
