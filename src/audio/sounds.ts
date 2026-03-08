/**
 * Mahji Sound Effects — Web Audio API + MP3
 *
 * Programmatic SFX for clicks, errors, celebration.
 * MP3 files for tile receive, charleston receive, mahjong cheer.
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

/* ── MP3 Playback Helper ─────────────────────────────────────── */

const sfxCache = new Map<string, HTMLAudioElement>();

/** Play an MP3 from public/audio/sfx/. Returns a promise that resolves when done. */
function playSfxFile(filename: string, volume = 0.7): Promise<void> {
  if (!isSoundOn()) return Promise.resolve();
  const path = `/audio/sfx/${filename}`;
  const cached = sfxCache.get(filename);
  if (cached) {
    cached.currentTime = 0;
    cached.volume = volume;
    return cached.play().catch(() => {});
  }
  const audio = new Audio(path);
  audio.volume = volume;
  return new Promise<void>((resolve) => {
    audio.oncanplaythrough = () => {
      sfxCache.set(filename, audio);
      audio.play().then(resolve).catch(resolve);
    };
    audio.onerror = () => resolve();
    setTimeout(() => resolve(), 500);
  });
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

/* ── Whoosh (backup) ─────────────────────────────────────────── *
 * Filtered noise sweep — kept as backup option                   */
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
 * Ascending major arpeggio — chime before Mahjong declared       */
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

/* ── Ping E (Glass Tap) ──────────────────────────────────────── *
 * Clear glass tone — tile received in charleston                 */
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
  osc.frequency.exponentialRampToValueAtTime(1800, t + 0.15);
  gain.gain.setValueAtTime(0.2, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.start(t);
  osc.stop(t + 0.15);
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

/* ── MP3 Sound Effects ───────────────────────────────────────── */

/** Tile received / drawn — warm rack-up sound */
export function playTileReceive(): void {
  playSfxFile('tile-receive.mp3', 0.7);
}

/** Charleston pass exchange — tiles sliding to other players */
export function playCharlestonReceive(): void {
  playSfxFile('charleston-receive.mp3', 0.7);
}

/** Mahjong cheer — crowd celebration after win */
export function playMahjongCheer(): void {
  playSfxFile('mahjong-cheer.mp3', 0.7);
}

/* ── Win Sequence ────────────────────────────────────────────── *
 * Full winner celebration:
 *   1. Celebration chime (ascending arpeggio)
 *   2. Voice says "Mahjong!"
 *   3. Mahjong cheer (crowd celebration)                         */
export async function playWinSequence(): Promise<void> {
  if (!isSoundOn()) return;

  // Import voice dynamically to avoid circular dependency
  const { playVoice } = await import('./voice');

  // 1. Celebration chime
  playCelebration();

  // Wait for arpeggio to finish (~0.85s = 5 notes × 0.1s gap + 0.45s ring)
  await new Promise(r => setTimeout(r, 850));

  // 2. Voice says "Mahjong!"
  await playVoice('mahjong');

  // Brief pause before cheer
  await new Promise(r => setTimeout(r, 400));

  // 3. Crowd cheer
  await playSfxFile('mahjong-cheer.mp3', 0.8);
}
