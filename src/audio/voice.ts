/**
 * Mahji Voice Clips — Multi-narrator playback
 *
 * Supports three voice packs:
 *   - melina  → American accent (ElevenLabs), files in public/audio/voice/melina/
 *   - abby    → British accent (ElevenLabs), files in public/audio/voice/abby/
 *   - robotic → Browser SpeechSynthesis (no files needed)
 *
 * Falls back to browser TTS if an MP3 file isn't available yet.
 * All clips respect the global sound toggle.
 */

import { isSoundOn } from './sounds';

/* ── Voice Pack Types ─────────────────────────────────────────── */

export type VoicePack = 'melina' | 'abby' | 'robotic';

export const VOICE_PACKS: { id: VoicePack; label: string }[] = [
  { id: 'melina', label: 'American' },
  { id: 'abby', label: 'British' },
  { id: 'robotic', label: 'Robotic' },
];

const LS_KEY = 'mahji_voice_pack';

/** Get the currently selected voice pack */
export function getVoicePack(): VoicePack {
  const stored = localStorage.getItem(LS_KEY);
  if (stored === 'melina' || stored === 'abby' || stored === 'robotic') return stored;
  return 'melina'; // default
}

/** Set the voice pack and persist to localStorage */
export function setVoicePack(pack: VoicePack): void {
  localStorage.setItem(LS_KEY, pack);
}

/* ── Audio Cache ──────────────────────────────────────────────── */

/** Cache key includes pack name so switching packs loads fresh audio */
const audioCache = new Map<string, HTMLAudioElement>();

function cacheKey(pack: VoicePack, clip: VoiceClip): string {
  return `${pack}:${clip}`;
}

/* ── Voice Clip Types ─────────────────────────────────────────── */

/** All available voice clip names */
export type VoiceClip =
  /* Game phases */
  | 'first-charleston' | 'second-charleston' | 'courtesy-pass'
  | 'joker-swap' | 'mahjong' | 'call'
  | 'stop' | 'draw' | 'invalid' | 'dead-hand'
  /* Bams */
  | '1-bam' | '2-bam' | '3-bam' | '4-bam' | '5-bam'
  | '6-bam' | '7-bam' | '8-bam' | '9-bam'
  /* Dots */
  | '1-dot' | '2-dot' | '3-dot' | '4-dot' | '5-dot'
  | '6-dot' | '7-dot' | '8-dot' | '9-dot'
  /* Craks */
  | '1-crak' | '2-crak' | '3-crak' | '4-crak' | '5-crak'
  | '6-crak' | '7-crak' | '8-crak' | '9-crak'
  /* Winds */
  | 'north' | 'south' | 'east' | 'west'
  /* Dragons */
  | 'red-dragon' | 'green-dragon' | 'soap'
  /* Special */
  | 'flower' | 'joker';

/** Map voice clip names to spoken text (for SpeechSynthesis / robotic fallback) */
const SPOKEN_TEXT: Record<VoiceClip, string> = {
  'first-charleston': 'First Charleston',
  'second-charleston': 'Second Charleston',
  'courtesy-pass': 'Courtesy Pass',
  'joker-swap': 'Joker Swap',
  'mahjong': 'Mahjong!',
  'call': 'Call!',
  'stop': 'Stop',
  'draw': "It's a draw!",
  'invalid': 'Invalid',
  'dead-hand': 'Dead hand',
  '1-bam': '1 Bam', '2-bam': '2 Bam', '3-bam': '3 Bam',
  '4-bam': '4 Bam', '5-bam': '5 Bam', '6-bam': '6 Bam',
  '7-bam': '7 Bam', '8-bam': '8 Bam', '9-bam': '9 Bam',
  '1-dot': '1 Dot', '2-dot': '2 Dot', '3-dot': '3 Dot',
  '4-dot': '4 Dot', '5-dot': '5 Dot', '6-dot': '6 Dot',
  '7-dot': '7 Dot', '8-dot': '8 Dot', '9-dot': '9 Dot',
  '1-crak': '1 Crak', '2-crak': '2 Crak', '3-crak': '3 Crak',
  '4-crak': '4 Crak', '5-crak': '5 Crak', '6-crak': '6 Crak',
  '7-crak': '7 Crak', '8-crak': '8 Crak', '9-crak': '9 Crak',
  'north': 'North', 'south': 'South', 'east': 'East', 'west': 'West',
  'red-dragon': 'Red Dragon', 'green-dragon': 'Green Dragon', 'soap': 'Soap',
  'flower': 'Flower', 'joker': 'Joker',
};

/* ── Playback ─────────────────────────────────────────────────── */

/** Play browser SpeechSynthesis for a clip */
function speakTTS(clip: VoiceClip): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(SPOKEN_TEXT[clip]);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Play a voice clip using the currently selected voice pack.
 * ElevenLabs packs try MP3 first, fall back to TTS.
 * Robotic pack goes straight to browser TTS.
 */
export async function playVoice(clip: VoiceClip): Promise<void> {
  if (!isSoundOn()) return;

  const pack = getVoicePack();

  // Robotic → straight to browser TTS
  if (pack === 'robotic') {
    speakTTS(clip);
    return;
  }

  // ElevenLabs packs → try MP3
  const key = cacheKey(pack, clip);
  const path = `/audio/voice/${pack}/${clip}.mp3`;

  // Check cache first
  if (audioCache.has(key)) {
    const audio = audioCache.get(key)!;
    audio.currentTime = 0;
    try {
      await audio.play();
      return;
    } catch {
      // File failed, fall through to TTS
    }
  }

  // Try loading the audio file
  try {
    const audio = new Audio(path);
    audio.volume = 0.7;
    await new Promise<void>((resolve, reject) => {
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject();
      // Timeout after 500ms — don't wait forever for missing files
      setTimeout(() => reject(), 500);
    });
    audioCache.set(key, audio);
    await audio.play();
    return;
  } catch {
    // File not found or failed — fall back to browser TTS
  }

  speakTTS(clip);
}

/* ── Tile Conversion ──────────────────────────────────────────── */

/**
 * Convert a GameTile to its voice clip name for discard announcements.
 */
export function tileToVoiceClip(tile: { suit: string; value: number | string; name?: string }): VoiceClip | null {
  const { suit, value } = tile;

  if (suit === 'bamboo') return `${value}-bam` as VoiceClip;
  if (suit === 'dots') return `${value}-dot` as VoiceClip;
  if (suit === 'characters') return `${value}-crak` as VoiceClip;
  if (suit === 'winds') {
    const w = String(value).toLowerCase();
    if (w === 'n' || w === 'north') return 'north';
    if (w === 's' || w === 'south') return 'south';
    if (w === 'e' || w === 'east') return 'east';
    if (w === 'w' || w === 'west') return 'west';
  }
  if (suit === 'dragons') {
    const d = String(value).toLowerCase();
    if (d === 'red') return 'red-dragon';
    if (d === 'green') return 'green-dragon';
    if (d === 'white') return 'soap';
  }
  if (suit === 'flowers') return 'flower';
  if (suit === 'jokers') return 'joker';

  return null;
}

/* ── Preloading ───────────────────────────────────────────────── */

/**
 * Preload all voice clips for the current pack (call on app startup).
 * Skips preloading for robotic pack (no files to load).
 */
export function preloadVoices(): void {
  const pack = getVoicePack();
  if (pack === 'robotic') return;

  const clips = Object.keys(SPOKEN_TEXT) as VoiceClip[];
  clips.forEach(clip => {
    const key = cacheKey(pack, clip);
    if (audioCache.has(key)) return; // Already cached
    const audio = new Audio(`/audio/voice/${pack}/${clip}.mp3`);
    audio.volume = 0.7;
    audio.preload = 'auto';
    // Don't cache failures — they'll fall back to TTS
    audio.oncanplaythrough = () => audioCache.set(key, audio);
  });
}
