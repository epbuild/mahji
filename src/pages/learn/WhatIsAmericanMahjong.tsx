import { C, getThemeColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { PT, Cnt } from '../../components/Layout';

export default function WhatIsAmericanMahjong({ onBack, onNavigate }: { onBack: () => void; onNavigate: (lesson: string) => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Learn
        </div>
      </div>
      <PT>What is American Mahjong?</PT>
      <Cnt>
        <p className="body-text" style={{ color: t.mid, marginBottom: 16, lineHeight: 1.65 }}>
          American mahjong is a strategic, tile-based game where four players compete to be the first to complete a specific 14-tile hand — matching their tiles to one of the winning combinations listed on the official Game Card, published each year by organizations like the National Mah Jongg League.
        </p>
        <p className="body-text" style={{ color: t.mid, marginBottom: 16, lineHeight: 1.65 }}>
          Every hand is a puzzle, every game is different, and the card changes annually, which means even seasoned players are always discovering something new. While the game is traditionally played with four players, it can be adapted for three or even two (in a format called Siamese).
        </p>
        <p className="body-text" style={{ color: t.mid, marginBottom: 24, lineHeight: 1.65 }}>
          Every great game starts with knowing your pieces. Before anything else, let's introduce you to the tiles, the foundation of everything that comes next.
        </p>

        {/* Next lesson button */}
        <div
          onClick={() => onNavigate("Meet the Tiles")}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px', borderRadius: 14,
            background: C.cherry, color: '#fff', cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
            marginBottom: 20,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(224,48,80,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          Meet the Tiles
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </Cnt>
    </>
  );
}
