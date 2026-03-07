/**
 * Sound Preview Page — temporary dev page for auditioning sounds
 * Access at #/sounds
 */
import { C, getThemeColors } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { PT, Cnt } from '../components/Layout';
import { playDeselect, playWhoosh, playError, playCelebration, playPlace, playTileReceive, playCharlestonReceive, playMahjongCheer, playWinSequence } from '../audio/sounds';
import { playVoice, VoiceClip } from '../audio/voice';

const SFX_GROUPS: { title: string; items: { label: string; fn: () => void }[] }[] = [
  {
    title: 'Tile Actions',
    items: [
      { label: 'Place (tile to pass box)', fn: playPlace },
      { label: 'Deselect', fn: playDeselect },
    ],
  },
  {
    title: 'MP3 Sound Effects',
    items: [
      { label: 'Tile Receive (draw)', fn: playTileReceive },
      { label: 'Charleston Receive (pass)', fn: playCharlestonReceive },
      { label: 'Mahjong Cheer', fn: playMahjongCheer },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'Whoosh (backup)', fn: playWhoosh },
      { label: 'Error (invalid)', fn: playError },
      { label: 'Celebration chime', fn: playCelebration },
    ],
  },
  {
    title: 'Win Sequence (chime + voice + cheer)',
    items: [
      { label: 'Play Full Win Sequence', fn: playWinSequence },
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
      { label: 'Stop', clip: 'stop' },
      { label: "Draw", clip: 'draw' },
      { label: 'Invalid', clip: 'invalid' },
      { label: 'Dead Hand', clip: 'dead-hand' },
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
          Tap any button to hear the sound. Voice clips use the currently selected narrator (Profile &gt; App Settings).
        </p>

        {/* Sound Effects */}
        <div style={{
          fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 10,
        }}>Sound Effects</div>
        {SFX_GROUPS.map((group, i) => (
          <div key={group.title}>
            {i > 0 && <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,27,78,0.06)', margin: '12px 0' }} />}
            <div style={{ marginBottom: 16 }}>
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
          </div>
        ))}
        <div style={{ height: 2, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(45,27,78,0.12)', borderRadius: 1, margin: '20px 0 16px' }} />

        {/* Voice Clips */}
        <div style={{
          fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 10,
        }}>Voice Clips</div>
        {VOICE_GROUPS.map((group, i) => (
          <div key={group.title}>
            {i > 0 && <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(45,27,78,0.06)', margin: '14px 0' }} />}
            <div style={{ marginBottom: 20 }}>
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
          </div>
        ))}

        <div style={{ height: 2, background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(45,27,78,0.12)', borderRadius: 1, margin: '20px 0 12px' }} />
        <p style={{ fontSize: 10, color: t.light, fontStyle: 'italic', fontFamily: "'Outfit',sans-serif" }}>
          Dev-only page. Remove before production.
        </p>
      </Cnt>
    </>
  );
}
