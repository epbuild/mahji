/**
 * Mahji Sound Effects — Web Audio API
 *
 * Lightweight, programmatic sound effects. No audio files needed.
 * All sounds respect the global sound toggle in localStorage.
 */

let _ctx: AudioContext | null = null;

/** Lazily create / resume the AudioContext (iOS requires user gesture) */
function ctx(): AudioContext {
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

/** Check if sound is enabled */
export function isSoundOn(): boolean {
  return localStorage.getItem('mahji_sound') !== 'off';
}

/** Toggle sound on/off, returns new state */
export function toggleSound(): boolean {
  const next = !isSoundOn();
  localStorage.setItem('mahji_sound', next ? 'on' : 'off');
  return next;
}

/* ── Click ────────────────────────────────────────────────────── *
 * Short percussive tap — tile selection, button press            */
export function playClick(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(800, t);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
  osc.start(t);
  osc.stop(t + 0.08);
}

/* ── Click B — softer, woodblock-style ────────────────────────── *
 * Muted tap — alternative tile selection                         */
export function playClickB(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'triangle';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);
  gain.gain.setValueAtTime(0.3, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.start(t);
  osc.stop(t + 0.06);
}

/* ── Click C — crisp snap ─────────────────────────────────────── *
 * Sharp, bright snap — more tactile feel                         */
export function playClickC(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
  osc.start(t);
  osc.stop(t + 0.05);
}

/* ── Deselect ─────────────────────────────────────────────────── *
 * Softer inverse click — tile deselection                        */
export function playDeselect(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.start(t);
  osc.stop(t + 0.06);
}

/* ── Whoosh ───────────────────────────────────────────────────── *
 * Filtered noise sweep — charleston pass animation               */
export function playWhoosh(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const dur = 0.35;
  const bufLen = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * i / bufLen);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;

  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(200, t);
  bp.frequency.exponentialRampToValueAtTime(2000, t + dur * 0.4);
  bp.frequency.exponentialRampToValueAtTime(400, t + dur);
  bp.Q.value = 1.5;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.4, t + dur * 0.2);
  gain.gain.linearRampToValueAtTime(0, t + dur);

  src.connect(bp);
  bp.connect(gain);
  gain.connect(c.destination);
  src.start(t);
}

/* ── Ping ─────────────────────────────────────────────────────── *
 * Bright chime — tiles received, tile drawn                      */
export function playPing(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(1200, t);
  osc.frequency.exponentialRampToValueAtTime(800, t + 0.15);
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
  osc.start(t);
  osc.stop(t + 0.3);
}

/* ── Ping B — low bell ────────────────────────────────────────── *
 * Single warm tone — lower, rounder                              */
export function playPingB(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(680, t);
  osc.frequency.exponentialRampToValueAtTime(520, t + 0.12);
  gain.gain.setValueAtTime(0.22, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  osc.start(t);
  osc.stop(t + 0.25);
}

/* ── Ping C — high ding ──────────────────────────────────────── *
 * Single bright tone — higher, crisp                             */
export function playPingC(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(1600, t);
  osc.frequency.exponentialRampToValueAtTime(1100, t + 0.1);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.start(t);
  osc.stop(t + 0.2);
}

/* ── Ping D — triangle tap ───────────────────────────────────── *
 * Single mellow tone — softer, triangle wave                     */
export function playPingD(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'triangle';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(1000, t);
  osc.frequency.exponentialRampToValueAtTime(700, t + 0.1);
  gain.gain.setValueAtTime(0.25, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc.start(t);
  osc.stop(t + 0.22);
}

/* ── Ping E — glass tap ──────────────────────────────────────── *
 * Single clear tone — short, glassy                              */
export function playPingE(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(2200, t);
  osc.frequency.exponentialRampToValueAtTime(1800, t + 0.06);
  gain.gain.setValueAtTime(0.14, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.start(t);
  osc.stop(t + 0.15);
}

/* ── Ping F — short chime ────────────────────────────────────── *
 * Like Ping E but with harmonic overtone for chime quality       */
export function playPingF(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const osc2 = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc2.type = 'sine';
  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(c.destination);
  // Fundamental
  osc.frequency.setValueAtTime(2100, t);
  osc.frequency.exponentialRampToValueAtTime(1900, t + 0.05);
  // Overtone at ~3x for bell/chime character
  osc2.frequency.setValueAtTime(6300, t);
  osc2.frequency.exponentialRampToValueAtTime(5700, t + 0.04);
  gain.gain.setValueAtTime(0.16, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  osc.start(t);
  osc2.start(t);
  osc.stop(t + 0.12);
  osc2.stop(t + 0.12);
}

/* ── Ping G — metallic chime ─────────────────────────────────── *
 * Staccato chime with inharmonic overtone for metallic ring      */
export function playPingG(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const osc2 = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc2.type = 'sine';
  osc.connect(gain);
  osc2.connect(gain);
  gain.connect(c.destination);
  // Fundamental
  osc.frequency.setValueAtTime(1800, t);
  osc.frequency.exponentialRampToValueAtTime(1650, t + 0.04);
  // Slightly inharmonic overtone (2.76x) for bell character
  osc2.frequency.setValueAtTime(4970, t);
  osc2.frequency.exponentialRampToValueAtTime(4550, t + 0.03);
  gain.gain.setValueAtTime(0.15, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.start(t);
  osc2.start(t);
  osc.stop(t + 0.1);
  osc2.stop(t + 0.1);
}

/* ── Ping H — bamboo clack ──────────────────────────────────── *
 * Warm woody clack — like bamboo mahjong tiles tapping together  */
export function playPingH(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;

  // Woody body — triangle wave for warm, hollow tone
  const body = c.createOscillator();
  const bodyGain = c.createGain();
  body.type = 'triangle';
  body.connect(bodyGain);
  bodyGain.connect(c.destination);
  body.frequency.setValueAtTime(800, t);
  body.frequency.exponentialRampToValueAtTime(280, t + 0.03);
  bodyGain.gain.setValueAtTime(0.25, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  body.start(t);
  body.stop(t + 0.09);

  // Resonant knock — slight hollow ring like bamboo
  const knock = c.createOscillator();
  const knockGain = c.createGain();
  knock.type = 'sine';
  knock.connect(knockGain);
  knockGain.connect(c.destination);
  knock.frequency.setValueAtTime(520, t);
  knock.frequency.exponentialRampToValueAtTime(350, t + 0.04);
  knockGain.gain.setValueAtTime(0.12, t);
  knockGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  knock.start(t);
  knock.stop(t + 0.12);

  // Noise transient — midrange band for wood texture (not metallic)
  const bufLen = Math.floor(c.sampleRate * 0.02);
  const buffer = c.createBuffer(1, bufLen, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen) * (1 - i / bufLen);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const bp = c.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 1800;
  bp.Q.value = 1.2;
  const nGain = c.createGain();
  nGain.gain.setValueAtTime(0.18, t);
  nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
  src.connect(bp);
  bp.connect(nGain);
  nGain.connect(c.destination);
  src.start(t);
}

/* ── Error ────────────────────────────────────────────────────── *
 * Low buzz — invalid action (e.g. selecting a joker)             */
export function playError(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.setValueAtTime(120, t + 0.1);
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  osc.start(t);
  osc.stop(t + 0.2);
}

/* ── Celebration ──────────────────────────────────────────────── *
 * Ascending major arpeggio — Mahjong declared!                   */
export function playCelebration(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const notes = [523, 659, 784, 1047, 1319]; // C5 E5 G5 C6 E6
  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(c.destination);
    const start = t + i * 0.1;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);
    osc.start(start);
    osc.stop(start + 0.45);
  });
}

/* ── Place / Snap ─────────────────────────────────────────────── *
 * Soft thud — tile placed into a slot                            */
export function playPlace(): void {
  if (!isSoundOn()) return;
  const c = ctx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(c.destination);
  osc.frequency.setValueAtTime(300, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.06);
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
  osc.start(t);
  osc.stop(t + 0.1);
}
