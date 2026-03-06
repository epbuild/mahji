/**
 * Mahji Voice Clips — Pre-recorded TTS playback
 *
 * Plays pre-generated voice clips from public/audio/voice/.
 * Falls back to browser SpeechSynthesis if audio files aren't available yet.
 * All clips respect the global sound toggle.
 */

import { isSoundOn } from './sounds';

/** Cache loaded audio buffers to avoid re-fetching */
const audioCache = new Map<string, HTMLAudioElement>();

/** All available voice clip names */
export type VoiceClip =
  /* Game phases */
  | 'first-charleston' | 'second-charleston' | 'courtesy-pass'
  | 'joker-swap' | 'mahjong' | 'call' | 'wall'
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

/** Map voice clip names to spoken text (for SpeechSynthesis fallback) */
const SPOKEN_TEXT: Record<VoiceClip, string> = {
  'first-charleston': 'First Charleston',
  'second-charleston': 'Second Charleston',
  'courtesy-pass': 'Courtesy Pass',
  'joker-swap': 'Joker Swap',
  'mahjong': 'Mahjong!',
  'call': 'Call!',
  'wall': 'Wall!',
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

/**
 * Play a voice clip. Tries pre-recorded audio first, falls back to browser TTS.
 */
export async function playVoice(clip: VoiceClip): Promise<void> {
  if (!isSoundOn()) return;

  // Try pre-recorded audio file
  const path = `/audio/voice/${clip}.mp3`;

  if (audioCache.has(clip)) {
    const audio = audioCache.get(clip)!;
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
    audioCache.set(clip, audio);
    await audio.play();
    return;
  } catch {
    // File not found or failed — fall back to browser TTS
  }

  // Fallback: browser SpeechSynthesis
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(SPOKEN_TEXT[clip]);
    utterance.rate = 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  }
}

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

/**
 * Preload all voice clips (call on app startup for faster playback).
 */
export function preloadVoices(): void {
  const clips = Object.keys(SPOKEN_TEXT) as VoiceClip[];
  clips.forEach(clip => {
    const audio = new Audio(`/audio/voice/${clip}.mp3`);
    audio.volume = 0.7;
    audio.preload = 'auto';
    // Don't cache failures — they'll fall back to TTS
    audio.oncanplaythrough = () => audioCache.set(clip, audio);
  });
}
