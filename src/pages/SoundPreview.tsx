/**
 * Sound Preview Page — temporary dev page for auditioning sounds
 * Access at #/sounds
 */
import { C, getThemeColors } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';
import { playClick, playDeselect, playWhoosh, playPing, playPingB, playPingC, playPingD, playPingE, playPingF, playPingG, playPingH, playError, playCelebration, playPlace } from '../audio/sounds';
import { playVoice, VoiceClip } from '../audio/voice';

const SFX_GROUPS: { title: string; items: { label: string; fn: () => void }[] }[] = [
  {
    title: 'Ping Options (tile receive / draw)',
    items: [
      { label: 'Ping A — bright', fn: playPing },
      { label: 'Ping B — low bell', fn: playPingB },
      { label: 'Ping C — high ding', fn: playPingC },
      { label: 'Ping D — triangle tap', fn: playPingD },
      { label: 'Ping E — glass tap', fn: playPingE },
      { label: 'Ping F — short chime', fn: playPingF },
      { label: 'Ping G — metallic chime', fn: playPingG },
      { label: 'Ping H — tile clack', fn: playPingH },
    ],
  },
  {
    title: 'Other Effects',
    items: [
      { label: 'Click (tile select)', fn: playClick },
      { label: 'Deselect', fn: playDeselect },
      { label: 'Whoosh (pass)', fn: playWhoosh },
      { label: 'Error (invalid)', fn: playError },
      { label: 'Place (snap)', fn: playPlace },
      { label: 'Celebration', fn: playCelebration },
    ],
  },
];

const VOICE_GROUPS: { title: string; clips: { label: string; clip: VoiceClip }[] }[] = [
  {
    title: 'Game Phases',
    clips: [
      { label: 'First Charleston', clip: 'first-charleston' },
      { label: 'Second Charleston', clip: 'second-charleston' },
      { label: 'Courtesy Pass', clip: 'courtesy-pass' },
      { label: 'Joker Swap', clip: 'joker-swap' },
      { label: 'Mahjong!', clip: 'mahjong' },
      { label: 'Call!', clip: 'call' },
      { label: 'Wall!', clip: 'wall' },
    ],
  },
  {
    title: 'Bams',
    clips: [1,2,3,4,5,6,7,8,9].map(n => ({ label: `${n} Bam`, clip: `${n}-bam` as VoiceClip })),
  },
  {
    title: 'Dots',
    clips: [1,2,3,4,5,6,7,8,9].map(n => ({ label: `${n} Dot`, clip: `${n}-dot` as VoiceClip })),
  },
  {
    title: 'Craks',
    clips: [1,2,3,4,5,6,7,8,9].map(n => ({ label: `${n} Crak`, clip: `${n}-crak` as VoiceClip })),
  },
  {
    title: 'Winds',
    clips: [
      { label: 'North', clip: 'north' },
      { label: 'South', clip: 'south' },
      { label: 'East', clip: 'east' },
      { label: 'West', clip: 'west' },
    ],
  },
  {
    title: 'Dragons',
    clips: [
      { label: 'Red Dragon', clip: 'red-dragon' },
      { label: 'Green Dragon', clip: 'green-dragon' },
      { label: 'Soap', clip: 'soap' },
    ],
  },
  {
    title: 'Special',
    clips: [
      { label: 'Flower', clip: 'flower' },
      { label: 'Joker', clip: 'joker' },
    ],
  },
];

export default function SoundPreview() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  const btnStyle = (color: string): React.CSSProperties => ({
    padding: '10px 16px',
    borderRadius: 10,
    border: 'none',
    background: color,
    color: '#fff',
    fontSize: 12,
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  return (
    <>
      <PT>Sound Preview</PT>
      <Cnt>
        <p style={{ fontSize: 12, color: t.mid, lineHeight: 1.5, marginBottom: 16, fontFamily: "'Outfit',sans-serif" }}>
          Tap any button to hear the sound. SFX are generated via Web Audio API.
          Voice clips will use browser TTS as a fallback until ElevenLabs MP3s are added to <code style={{ fontSize: 11, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', padding: '2px 5px', borderRadius: 4 }}>public/audio/voice/</code>.
        </p>

        {/* Sound Effects */}
        <div style={{
          fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 10,
        }}>Sound Effects</div>
        {SFX_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600,
              color: isDark ? t.cerulean : C.dark, letterSpacing: 0.3, marginBottom: 6,
            }}>{group.title}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {group.items.map(s => (
                <button key={s.label} onClick={s.fn} style={btnStyle(C.cherry)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginBottom: 8 }} />

        {/* Voice Clips */}
        {VOICE_GROUPS.map(group => (
          <div key={group.title} style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600,
              color: isDark ? t.cerulean : C.dark, letterSpacing: 0.3, marginBottom: 8,
            }}>{group.title}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {group.clips.map(v => (
                <button
                  key={v.clip}
                  onClick={() => playVoice(v.clip)}
                  style={btnStyle(isDark ? 'rgba(107,63,160,0.7)' : C.lavDeep)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.lavBorder}, transparent)`, margin: '16px 0' }} />
        <p style={{ fontSize: 10, color: t.light, fontStyle: 'italic', fontFamily: "'Outfit',sans-serif" }}>
          Dev-only page. Remove before production.
        </p>
      </Cnt>
    </>
  );
}
