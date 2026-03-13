import { useState } from 'react';
import { C, getThemeColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { PT, Cnt } from '../../components/Layout';

const FONT_SERIF = "'Bodoni Moda', serif";
const FONT_SANS = "'Outfit', sans-serif";

/* ── Collapsible section ── */
function Section({ title, children, defaultOpen = false, t }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
  t: ReturnType<typeof getThemeColors>;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 0', cursor: 'pointer', borderBottom: `1px solid ${t.lavBorder}`,
        }}
      >
        <span style={{
          fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.3,
        }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textMid}
          strokeWidth="2" strokeLinecap="round"
          style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && <div style={{ padding: '12px 0' }}>{children}</div>}
    </div>
  );
}

/* ── Callout box ── */
function Callout({ title, children, t, isDark }: {
  title: string; children: React.ReactNode;
  t: ReturnType<typeof getThemeColors>; isDark: boolean;
}) {
  return (
    <div style={{
      background: isDark ? 'rgba(142,199,226,0.06)' : 'linear-gradient(135deg, #EDF5FA, #D9ECF5)',
      border: `1px solid ${isDark ? 'rgba(142,199,226,0.12)' : 'rgba(173,212,236,0.3)'}`,
      borderRadius: 12, padding: '14px 16px', marginBottom: 14,
    }}>
      <div style={{
        fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 600,
        color: isDark ? t.cerulean : '#4A96B8', marginBottom: 6, letterSpacing: 0.3,
      }}>{title}</div>
      <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}

export default function ReadingOpponentsDefense({ onBack, onNavigate }: {
  onBack: () => void; onNavigate: (lesson: string) => void;
}) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  const bodyStyle = { fontFamily: FONT_SANS, fontSize: 12.5, color: t.textMid, lineHeight: 1.7, marginBottom: 14 };
  const boldColor = isDark ? t.cerulean : C.dark;
  const subHead = { fontFamily: FONT_SERIF, fontSize: 12.5, fontWeight: 600 as const, color: isDark ? t.cerulean : '#4A3660', marginBottom: 6, marginTop: 14 };

  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          Learn
        </div>
      </div>
      <PT>Reading Opponents & Defense</PT>
      <Cnt>
        <p style={bodyStyle}>
          Winning at American Mahjong isn't just about building your own hand. The best players are constantly reading the table — watching what others discard, expose, and pass — and adjusting their play to avoid feeding someone else a win.
        </p>

        <Section title="Reading Exposures" defaultOpen={true} t={t}>
          <p style={bodyStyle}>
            When a player calls a tile and creates an <strong style={{ color: boldColor }}>exposure</strong> (a visible group on top of their rack), they're giving you information. The key is learning to use it.
          </p>
          <div style={subHead}>What to look for</div>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Suit concentration:</strong> If a player exposes two groups of Bams, you can be fairly confident they're working in a Bam-heavy section of the card. Cross-reference their exposures against the card to narrow down which specific hands they might be going for.
          </p>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Number patterns:</strong> Exposures of consecutive numbers (3-4-5) suggest runs. Repeated numbers (3-3-3-3) point toward like-number hands. Pay attention to whether the exposed groups use singles, pairs, pungs, kongs, or quints — each narrows the possibilities.
          </p>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Dragons and Winds:</strong> An exposure of Red Dragons almost always pairs with Craks. Green Dragons pair with Bams. If you see Wind exposures, check the Winds/369 section of the card immediately.
          </p>
          <Callout title="Pro Tip" t={t} isDark={isDark}>
            The more exposures a player has, the fewer hands they could be playing. Two exposures usually narrow it down to 2-3 possibilities. Three exposures often reveal the exact hand.
          </Callout>
        </Section>

        <Section title="Watching the Discards" t={t}>
          <p style={bodyStyle}>
            The discard pool is a goldmine of information — not just for what's there, but for what's <strong style={{ color: boldColor }}>not</strong> there.
          </p>
          <div style={subHead}>Reading absence</div>
          <p style={bodyStyle}>
            If no one is discarding Dots and you can see very few in the discard pool, someone is collecting them. If a player consistently holds onto Winds instead of discarding them early (as most players do with tiles they don't need), they're likely building a Winds hand.
          </p>
          <div style={subHead}>Tracking your danger tiles</div>
          <p style={bodyStyle}>
            Once you've narrowed down what a player might be going for, figure out which tiles in your hand could complete their hand. Those are your <strong style={{ color: boldColor }}>danger tiles</strong>. The closer a player appears to winning (more exposures, fewer tiles in their hand on the rack), the more carefully you should hold those tiles.
          </p>
        </Section>

        <Section title="Defensive Play (Dogging)" t={t}>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Dogging</strong> means playing defensively — prioritizing not feeding someone a win over building your own hand. It's one of the most important skills in competitive mahjong.
          </p>
          <div style={subHead}>When to go defensive</div>
          <p style={bodyStyle}>
            Switch to defensive play when: a player has multiple exposures and is clearly close to winning; you're far from completing your own hand; or it's late in the game and a high-value hand is in play.
          </p>
          <div style={subHead}>How to dog effectively</div>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Discard safe tiles first.</strong> Tiles that have already been discarded by others (especially the player you're worried about) are generally safe. If someone discarded a 7 Bam, they almost certainly don't need another one.
          </p>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Hold danger tiles.</strong> If you suspect a player needs a specific tile, keep it in your hand rather than discarding it. Yes, this may slow down your own hand — that's the trade-off.
          </p>
          <p style={bodyStyle}>
            <strong style={{ color: boldColor }}>Discard from their suit last.</strong> If you know someone is collecting Craks, discard your Dots and Bams first. Save your Craks for as long as possible.
          </p>
          <Callout title="The Golden Rule of Defense" t={t} isDark={isDark}>
            It's better to play a hand that doesn't win than to throw the tile that lets someone else win. A wall game (no winner) is always preferable to paying for someone else's Mahjong.
          </Callout>
        </Section>

        <Section title="The Joker Tell" t={t}>
          <p style={bodyStyle}>
            Watch for <strong style={{ color: boldColor }}>joker swaps</strong>. When a player swaps a natural tile for a joker in someone's exposure, pay close attention to which tile they took. That swap tells you they need that exact tile for their hand — it's one of the strongest signals in the game.
          </p>
          <p style={bodyStyle}>
            Similarly, if a player has jokers in their exposure and no one has swapped them, that joker is essentially locked. But if you have the natural tile, you now know exactly what's in play.
          </p>
        </Section>

        <Section title="Putting It All Together" t={t}>
          <p style={bodyStyle}>
            Great defense is about building a mental picture of the table throughout the game. Every discard, every exposure, every pass from the Charleston gives you data. The players who win most consistently aren't always the ones with the best hands — they're the ones who avoid throwing the winning tile.
          </p>
          <div style={{
            background: isDark ? 'rgba(109,191,168,0.08)' : 'rgba(109,191,168,0.08)',
            border: `1px solid ${isDark ? 'rgba(109,191,168,0.15)' : 'rgba(109,191,168,0.2)'}`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 14,
          }}>
            <div style={{
              fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 600,
              color: C.seafoam, marginBottom: 6,
            }}>Quick Checklist</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.8 }}>
              1. After each exposure, narrow down possible hands<br />
              2. Track which suits are absent from discards<br />
              3. Identify your danger tiles for each opponent<br />
              4. Switch to defensive play when an opponent is close<br />
              5. Discard safe tiles first, hold danger tiles
            </div>
          </div>
        </Section>

        {/* Next lesson button */}
        <div
          onClick={() => onNavigate("Scoring & Payment Systems")}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px', borderRadius: 14,
            background: C.cherry, color: '#fff', cursor: 'pointer',
            fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600,
            marginBottom: 20,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(224,48,80,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          Scoring & Payment
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
        </div>
      </Cnt>
    </>
  );
}
