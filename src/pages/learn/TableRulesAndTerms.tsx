import { useState } from 'react';
import { C, getThemeColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { PT, Cnt } from '../../components/Layout';

/* ── Collapsible Section ──────────────────────────────────────── */
const CollapsibleSection = ({ title, children, defaultOpen = false }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', marginBottom: open ? 12 : 0,
        }}
      >
        <div style={{
          fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5,
        }}>{title}</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke={C.cherry} strokeWidth="2" strokeLinecap="round"
          style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && <div style={{ paddingLeft: 2 }}>{children}</div>}
    </div>
  );
};

/* ── Subsection heading ───────────────────────────────────────── */
const Sub = ({ children, isDark, t }: { children: React.ReactNode; isDark: boolean; t: any }) => (
  <div style={{
    fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600,
    color: isDark ? t.cerulean : C.dark, letterSpacing: 0.3,
    marginTop: 14, marginBottom: 6,
  }}>{children}</div>
);

/* ── Body paragraph ───────────────────────────────────────────── */
const P = ({ children, t }: { children: React.ReactNode; t: any }) => (
  <p style={{ fontSize: 13, color: t.mid, lineHeight: 1.65, marginBottom: 10, fontFamily: "'Outfit',sans-serif" }}>{children}</p>
);

/* ── Bold inline span ─────────────────────────────────────────── */
const B = ({ children, isDark, t }: { children: React.ReactNode; isDark: boolean; t: any }) => (
  <strong style={{ fontWeight: 700, color: isDark ? t.cerulean : C.dark }}>{children}</strong>
);

/* ── Underline inline span ────────────────────────────────────── */
const U = ({ children }: { children: React.ReactNode }) => (
  <span style={{ textDecoration: 'underline' }}>{children}</span>
);


/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */
export default function TableRulesAndTerms({ onBack }: { onBack: () => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  return (
    <>
      {/* Back nav */}
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          Learn
        </div>
      </div>

      <PT>Etiquette</PT>

      <Cnt>
        {/* Intro blurb */}
        <p style={{ fontSize: 13, color: t.mid, lineHeight: 1.65, marginBottom: 18, fontFamily: "'Outfit',sans-serif" }}>
          Keep the game flowing and the focus on the fun with this quick guide to essential table etiquette.
        </p>

        {/* ─── 1. Table Rules ────────────────────────────────────────── */}
        <CollapsibleSection title="Table Rules">
          <P t={t}>Every Mahjong table can have its own personality. Before starting a game, take a minute to align on any house rules with the group.</P>
          <P t={t}>Some tables add fun traditions or small twists, like cheers-ing when someone discards the Bam Bird or other playful rituals. These aren't official rules, but they're part of the social fun of the game.</P>
          <P t={t}>The key is simple: agree on the rules before the tiles start moving.</P>
        </CollapsibleSection>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.lavBorder}, transparent)`, margin: '4px 0 14px' }} />

        {/* ─── 2. Pace of Play ───────────────────────────────────────── */}
        <CollapsibleSection title="Pace of Play">
          <P t={t}>Mahjong can be both thoughtful and social, but it's important to respect the pace of the table.</P>
          <P t={t}>In casual games, it's normal to pause, think through a hand, or chat with friends. Even so, try to stay mindful of how long you're taking on a turn so the game keeps flowing.</P>
          <P t={t}>In tournament play, pace matters more. Players are expected to make decisions efficiently so everyone at the table gets a fair and consistent playing experience.</P>
          <P t={t}>A good rule of thumb: think carefully, but don't hold up the table.</P>
        </CollapsibleSection>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.lavBorder}, transparent)`, margin: '4px 0 14px' }} />

        {/* ─── 3. Tile Handling ──────────────────────────────────────── */}
        <CollapsibleSection title="Tile Handling">
          <P t={t}>Good tile etiquette keeps the game fair and avoids confusion.</P>

          <Sub isDark={isDark} t={t}>Racking Tiles</Sub>
          <P t={t}>When a player discards a tile, other players may call it (to expose a meld or declare Mahjong) until the next player picks up and racks their tile.</P>
          <P t={t}>Important, the tile <U>must</U> be placed into the rack to officially end the calling window. Tapping the tile or simply grabbing the tile does not close the call window.</P>
          <P t={t}>Some tables relax this rule, but racking the tile is the standard practice.</P>

          <Sub isDark={isDark} t={t}>Joker Swaps</Sub>
          <P t={t}>When exchanging a tile for someone else's joker, use proper table etiquette.</P>
          <P t={t}>The polite approach: <B isDark={isDark} t={t}>"Hi Suzy South. May I please have your joker? I have a 3 Bam"</B></P>
          <P t={t}>Then:</P>
          <div style={{ paddingLeft: 14, marginBottom: 10 }}>
            <P t={t}>1. Hand them the tile you're exchanging.</P>
            <P t={t}>2. They hand you the joker.</P>
          </div>
          <P t={t}>Never take someone else's joker directly off another player's rack. Online Mahjong works differently, but in person: hands off other players' tiles!</P>
        </CollapsibleSection>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.lavBorder}, transparent)`, margin: '4px 0 14px' }} />

        {/* ─── 4. Dealing & Dealer Rotation ──────────────────────────── */}
        <CollapsibleSection title="Dealing & Dealer Rotation">
          <P t={t}>In Mahjong, <B isDark={isDark} t={t}>East is always the dealer.</B></P>
          <P t={t}>Typical dealing style: Players take their own tiles from the wall in order.</P>
          <P t={t}>Some tables prefer the dealer to physically deal everyone's tiles, which is perfectly fine as long as everyone agrees beforehand.</P>
          <P t={t}>After each game:</P>
          <div style={{ paddingLeft: 14, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <span style={{ color: t.mid, fontSize: 13, lineHeight: 1.65 }}>{'\u2022'}</span>
              <span style={{ fontSize: 13, color: t.mid, lineHeight: 1.65, fontFamily: "'Outfit',sans-serif" }}>The dealer rotates counterclockwise</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
              <span style={{ color: t.mid, fontSize: 13, lineHeight: 1.65 }}>{'\u2022'}</span>
              <span style={{ fontSize: 13, color: t.mid, lineHeight: 1.65, fontFamily: "'Outfit',sans-serif" }}>This continues so each player has an opportunity to deal</span>
            </div>
          </div>
        </CollapsibleSection>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${t.lavBorder}, transparent)`, margin: '4px 0 14px' }} />

        {/* ─── 5. Courtesy at the Table ──────────────────────────────── */}
        <CollapsibleSection title="Courtesy at the Table">
          <Sub isDark={isDark} t={t}>Announcing Discards</Sub>
          <P t={t}>When discarding a tile, say the tile clearly out loud. Many players rely on listening rather than looking closely at the table. Example: Say <B isDark={isDark} t={t}>"Three Bam"</B> as you place the three bam down.</P>
          <P t={t}>Clear calls help everyone follow the game.</P>

          <Sub isDark={isDark} t={t}>Calling Tiles</Sub>
          <P t={t}>When calling a discard: Stay calm and clear, there's no need to yell or get aggressive!</P>
          <P t={t}>If two players call the same tile:</P>
          <div style={{ paddingLeft: 14, marginBottom: 10 }}>
            <P t={t}>1. Mahjong takes priority</P>
            <P t={t}>2. If neither player has Mahjong, the tile goes to the player whose turn comes next in order</P>
          </div>

          <Sub isDark={isDark} t={t}>Celebrate the Wins</Sub>
          <P t={t}>Avoid comments like:</P>
          <P t={t}><span style={{ fontStyle: 'italic' }}>"I was so close — I only needed one tile!"</span></P>
          <P t={t}>Instead, celebrate the player who won. Your turn will come around :)</P>
        </CollapsibleSection>

      </Cnt>
    </>
  );
}
