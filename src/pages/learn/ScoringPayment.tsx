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

/* ── Score table row ── */
function ScoreRow({ points, label, desc, t, isDark }: {
  points: string; label: string; desc: string;
  t: ReturnType<typeof getThemeColors>; isDark: boolean;
}) {
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '10px 0',
      borderBottom: `1px solid ${t.lavBorder}`,
    }}>
      <div style={{
        minWidth: 44, textAlign: 'center',
        fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 700,
        color: C.cherry,
      }}>{points}</div>
      <div>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 12.5, fontWeight: 600,
          color: t.textMain, marginBottom: 2,
        }}>{label}</div>
        <div style={{
          fontFamily: FONT_SANS, fontSize: 11.5, color: t.textMid, lineHeight: 1.5,
        }}>{desc}</div>
      </div>
    </div>
  );
}

export default function ScoringPayment({ onBack }: { onBack: () => void }) {
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
      <PT>Scoring & Payment Systems</PT>
      <Cnt>
        <p style={bodyStyle}>
          In American Mahjong, every hand on the card has a point value. When someone declares Mahjong, the scoring and payment depend on the hand's value — and on <strong style={{ color: boldColor }}>how</strong> the winning tile was obtained.
        </p>

        <Section title="Point Values" defaultOpen={true} t={t}>
          <p style={bodyStyle}>
            Each hand on the NMJL card is assigned a point value: <strong style={{ color: boldColor }}>25, 30, 50, or 75 points</strong>. Generally, harder hands are worth more.
          </p>
          <div style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)',
            borderRadius: 12, padding: '4px 14px', marginBottom: 14,
            border: `1px solid ${t.lavBorder}`,
          }}>
            <ScoreRow points="25" label="Standard hands" desc="Common patterns, often with exposed groups allowed" t={t} isDark={isDark} />
            <ScoreRow points="30" label="Moderate hands" desc="Slightly more complex patterns or suit restrictions" t={t} isDark={isDark} />
            <ScoreRow points="50" label="Difficult hands" desc="Concealed hands, specific number requirements, or rare combinations" t={t} isDark={isDark} />
            <ScoreRow points="75" label="Exceptional hands" desc="The hardest patterns on the card — Singles & Pairs, complex quint hands" t={t} isDark={isDark} />
          </div>
          <p style={bodyStyle}>
            The point value is printed on the right side of each line on the game card. Keep an eye on it when choosing which hand to pursue — a 75-point hand pays triple what a 25-point hand does.
          </p>
        </Section>

        <Section title="Who Pays Whom" t={t}>
          <p style={bodyStyle}>
            Payment in American Mahjong follows a specific structure based on how the winner got their final tile.
          </p>
          <div style={subHead}>Discard Win</div>
          <p style={bodyStyle}>
            If you win by calling someone else's discard, the player who threw the winning tile pays <strong style={{ color: boldColor }}>double</strong> the hand's point value. The other two players each pay the <strong style={{ color: boldColor }}>single</strong> point value.
          </p>
          <div style={{
            background: isDark ? 'rgba(224,48,80,0.06)' : 'rgba(224,48,80,0.04)',
            border: `1px solid ${isDark ? 'rgba(224,48,80,0.12)' : 'rgba(224,48,80,0.1)'}`,
            borderRadius: 10, padding: '12px 14px', marginBottom: 14,
          }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.7 }}>
              <strong style={{ color: boldColor }}>Example:</strong> You win a 30-point hand off North's discard.
              <br />North pays you 60 (double). West and South each pay you 30.
              <br />Total collected: 120 points.
            </div>
          </div>

          <div style={subHead}>Self-Pick (Wall Game Win)</div>
          <p style={bodyStyle}>
            If you win by picking your own tile from the wall (a <strong style={{ color: boldColor }}>self-pick</strong>), all three opponents pay you <strong style={{ color: boldColor }}>double</strong> the hand's point value. This is the most lucrative way to win.
          </p>
          <div style={{
            background: isDark ? 'rgba(109,191,168,0.06)' : 'rgba(109,191,168,0.06)',
            border: `1px solid ${isDark ? 'rgba(109,191,168,0.12)' : 'rgba(109,191,168,0.15)'}`,
            borderRadius: 10, padding: '12px 14px', marginBottom: 14,
          }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.7 }}>
              <strong style={{ color: boldColor }}>Example:</strong> You self-pick to win a 30-point hand.
              <br />All three opponents pay you 60 each.
              <br />Total collected: 180 points.
            </div>
          </div>
        </Section>

        <Section title="Jokerless Bonus" t={t}>
          <p style={bodyStyle}>
            If you complete your winning hand without using a single Joker, you earn a <strong style={{ color: boldColor }}>jokerless bonus</strong>. This typically doubles the hand's base value before payment calculations.
          </p>
          <p style={bodyStyle}>
            Jokerless hands are impressive because Jokers are the most flexible tiles in the game. Winning without them shows true mastery of the card and tile management.
          </p>
          <div style={{
            background: isDark ? 'rgba(142,199,226,0.06)' : 'linear-gradient(135deg, #EDF5FA, #D9ECF5)',
            border: `1px solid ${isDark ? 'rgba(142,199,226,0.12)' : 'rgba(173,212,236,0.3)'}`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 14,
          }}>
            <div style={{
              fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 600,
              color: isDark ? t.cerulean : '#4A96B8', marginBottom: 6,
            }}>Note</div>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.65 }}>
              Not all groups play with the jokerless bonus — it's a common house rule. Always confirm with your table before the game starts.
            </div>
          </div>
        </Section>

        <Section title="Concealed vs Exposed Hands" t={t}>
          <p style={bodyStyle}>
            Hands marked with a <strong style={{ color: boldColor }}>C</strong> on the game card must be won entirely concealed — meaning you cannot call any discards to complete groups. You must draw every tile yourself from the wall.
          </p>
          <p style={bodyStyle}>
            Concealed hands are inherently harder to win, which is why they tend to carry higher point values. The trade-off is real: you can't call tiles, but the payout is significantly better.
          </p>
          <p style={bodyStyle}>
            Hands marked with an <strong style={{ color: boldColor }}>X</strong> can be won either exposed or concealed. If you win an X-hand fully concealed (by choice), some groups award a jokerless-style bonus. Again — confirm with your table.
          </p>
        </Section>

        <Section title="Wall Game (No Winner)" t={t}>
          <p style={bodyStyle}>
            If all tiles are drawn from the wall and no one declares Mahjong, it's a <strong style={{ color: boldColor }}>wall game</strong> — nobody wins, nobody pays. The deal rotates to the next player and a new round begins.
          </p>
          <p style={bodyStyle}>
            Wall games are a natural part of the game. Don't feel frustrated when they happen — sometimes the best play is to prevent someone else from winning, even if it means you don't win either.
          </p>
        </Section>

        <Section title="Keeping Score" t={t}>
          <p style={bodyStyle}>
            Most casual games are played with chips or coins to track payments. A typical starting bank might be:
          </p>
          <div style={{
            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)',
            borderRadius: 12, padding: '14px 16px', marginBottom: 14,
            border: `1px solid ${t.lavBorder}`,
          }}>
            <div style={{ fontFamily: FONT_SANS, fontSize: 12, color: t.textMid, lineHeight: 1.8 }}>
              <strong style={{ color: boldColor }}>8 quarters</strong> (25 cents each)<br />
              <strong style={{ color: boldColor }}>5 dimes</strong> (10 cents each)<br />
              <strong style={{ color: boldColor }}>5 nickels</strong> (5 cents each)
            </div>
          </div>
          <p style={bodyStyle}>
            Many groups play for small stakes — the money is more about keeping score than anything else. Some tables use poker chips, tokens, or simply keep a running tally on paper.
          </p>
          <p style={{
            ...bodyStyle,
            fontStyle: 'italic', color: t.textDim,
          }}>
            With Mahji, you can track your scores digitally and never lose count.
          </p>
        </Section>

      </Cnt>
    </>
  );
}
