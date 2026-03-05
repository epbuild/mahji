import { useState, useEffect, useRef } from 'react';
import { C, getThemeColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { PT, Cnt } from '../../components/Layout';
import {
  MiniDot, MiniBam, MiniCrak, MiniWind, MiniDragon, MiniFlower, MiniJoker,
} from '../../components/TileComponents';

/* ─────────────────────────────────────────────────
   REUSABLE BUILDING BLOCKS
   ───────────────────────────────────────────────── */

// Auto-scaling tile strip — scales tiles down to fit viewport width (no horizontal scroll)
const TileStrip = ({ children, label, delay = 0 }: {
  children: React.ReactNode; label?: string; delay?: number;
}) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const stripRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (stripRef.current && innerRef.current) {
        const containerW = stripRef.current.offsetWidth;
        const contentW = innerRef.current.scrollWidth;
        if (contentW > containerW && containerW > 0) {
          setScale(Math.max(0.5, containerW / contentW));
        } else {
          setScale(1);
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [children]);

  return (
    <div style={{ marginBottom: 12, animation: `entranceFade 0.5s ease ${delay}s both` }}>
      {label && (
        <div style={{
          fontSize: 10, fontWeight: 600, color: t.light, textTransform: 'uppercase',
          letterSpacing: 1.5, marginBottom: 6,
        }}>{label}</div>
      )}
      <div ref={stripRef} style={{ overflow: 'hidden' }}>
        <div ref={innerRef} style={{
          display: 'inline-flex', gap: 3, alignItems: 'center',
          whiteSpace: 'nowrap',
          transform: scale < 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'left top',
          marginBottom: scale < 1 ? `${-(1 - scale) * 60}px` : undefined,
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Tile = ({ children, delay = 0, glow = false }: {
  children: React.ReactNode; delay?: number; glow?: boolean;
}) => (
  <div style={{
    display: 'inline-block', flexShrink: 0,
    animation: `entranceFade 0.4s ease ${delay}s both`,
    ...(glow ? { filter: 'drop-shadow(0 0 6px rgba(224,48,80,0.25))' } : {}),
  }}>{children}</div>
);

const Callout = ({ emoji, title, children, color = '#4A96B8' }: {
  emoji: string; title: string; children: React.ReactNode; color?: string;
}) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div style={{
      background: isDark ? 'rgba(142,199,226,0.06)' : `linear-gradient(135deg, ${C.paleBlueLt}, ${C.paleBlue})`,
      borderRadius: 14, padding: '14px 16px',
      border: isDark ? '1px solid rgba(142,199,226,0.12)' : '1px solid rgba(173,212,236,0.3)',
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ fontSize: 14 }}>{emoji}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color }}>{title}</span>
      </div>
      <div style={{ fontSize: 11.5, color: t.mid, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
};

const StepNum = ({ n }: { n: number }) => (
  <div style={{
    width: 26, height: 26, borderRadius: '50%', background: C.cherry,
    color: '#fff', fontSize: 12, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, boxShadow: '0 2px 6px rgba(224,48,80,0.2)',
  }}>{n}</div>
);

const Divider = () => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div style={{
      height: 1,
      background: `linear-gradient(90deg, transparent, ${t.lavBorder}, transparent)`,
      margin: '20px 0',
    }} />
  );
};

const SectionTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div style={{ marginBottom: sub ? 8 : 12 }}>
      <div style={{
        fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 600,
        color: C.cherry, letterSpacing: 0.5,
      }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: t.light, marginTop: 2, fontStyle: 'italic' }}>{sub}</div>}
    </div>
  );
};

const P = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <p style={{ fontSize: 13, color: t.mid, lineHeight: 1.65, marginBottom: 14 }}>{children}</p>
  );
};

const B = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <strong style={{ color: isDark ? t.cerulean : C.dark, fontWeight: 600 }}>{children}</strong>
  );
};

const GroupExample = ({ label, tiles, note }: {
  label: string; tiles: React.ReactNode; note: string;
}) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
      padding: '8px 12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)',
      borderRadius: 10, border: `0.5px solid ${t.lavBorder}`,
    }}>
      <div style={{
        fontFamily: "'Bodoni Moda',serif", fontSize: 11, fontWeight: 600,
        color: C.cherry, minWidth: 44, textAlign: 'right',
      }}>{label}</div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center', flexShrink: 0 }}>{tiles}</div>
      <div style={{ fontSize: 10.5, color: t.light, flex: 1 }}>{note}</div>
    </div>
  );
};

// A "card-notation" colored text group — mimics how it looks printed on the card
const CardText = ({ text, color }: { text: string; color: 'red' | 'green' | 'blue' }) => {
  const colMap = { red: '#C2413B', green: '#2E8B57', blue: '#4A7FA8' };
  return (
    <span style={{
      fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 700,
      color: colMap[color], letterSpacing: 1,
    }}>{text}</span>
  );
};

// Shows a card-style notation line with colored text, THEN the actual tiles below
const CardLineExample = ({ notation, tileGroups, points, exposure, parenthetical, delay = 0 }: {
  notation: Array<{ text: string; color: 'red' | 'green' | 'blue' }>;
  tileGroups: Array<{ tiles: React.ReactNode[]; color: 'red' | 'green' | 'blue' }>;
  points: number;
  exposure: 'X' | 'C';
  parenthetical?: string;
  delay?: number;
}) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const colorMap = {
    red: { bg: 'rgba(194,65,59,0.06)', border: 'rgba(194,65,59,0.18)' },
    green: { bg: 'rgba(46,139,87,0.06)', border: 'rgba(46,139,87,0.18)' },
    blue: { bg: 'rgba(74,127,168,0.06)', border: 'rgba(74,127,168,0.18)' },
  };
  return (
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.025)' : '#FDFCFE',
      borderRadius: 14, padding: '14px 16px',
      border: `1px solid ${t.lavBorder}`, marginBottom: 16,
      boxShadow: isDark ? 'none' : '0 2px 12px rgba(126,100,164,0.04)',
      animation: `entranceFade 0.5s ease ${delay}s both`,
    }}>
      {/* Card notation line */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
          {notation.map((g, i) => <CardText key={i} text={g.text} color={g.color} />)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
          <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 700, color: C.cherry }}>{points}</span>
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background: exposure === 'X' ? 'rgba(109,191,168,0.12)' : 'rgba(224,48,80,0.08)',
            border: `1px solid ${exposure === 'X' ? 'rgba(109,191,168,0.25)' : 'rgba(224,48,80,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bodoni Moda',serif", fontSize: 12, fontWeight: 700,
            color: exposure === 'X' ? '#4A9E88' : C.cherry,
          }}>{exposure}</div>
        </div>
      </div>
      {parenthetical && (
        <div style={{
          fontSize: 10, color: t.light, fontStyle: 'italic', marginBottom: 10,
        }}>({parenthetical})</div>
      )}
      {/* Tile rendering — single scrollable row */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', paddingBottom: 2 }}>
        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap' }}>
          {tileGroups.map((g, gi) => (
            <div key={gi} style={{
              display: 'inline-flex', gap: 2, alignItems: 'center',
              background: colorMap[g.color].bg,
              border: `1px dashed ${colorMap[g.color].border}`,
              borderRadius: 8, padding: '4px 5px', flexShrink: 0,
            }}>
              {g.tiles.map((tl, ti) => (
                <div key={ti} style={{ transform: 'scale(0.8)', flexShrink: 0 }}>{tl}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────── */
export default function ReadTheCard({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (lesson: string) => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [expandJoker, setExpandJoker] = useState(false);
  const [expandXC, setExpandXC] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  return (
    <>
      {/* Back nav */}
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{
          fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 3,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Learn
        </div>
      </div>

      <PT>Reading the Card</PT>

      <Cnt>
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>

          {/* ═══════════════════════════════════════════════
              1. THE GOAL
              ═══════════════════════════════════════════════ */}
          <SectionTitle>The Goal</SectionTitle>
          <P>
            In American Mahjong, every player gets a copy of the <B>NMJL card</B> — a
            sheet of paper listing all the winning hands for the year. The card changes
            every year, so the game always feels fresh.
          </P>
          <P>
            Your job? <B>Match your tiles to one of the lines on the card.</B> That's
            how you win. Each line describes exactly which 14 tiles you need.
          </P>

          <Callout emoji="🎯" title="The 13 → 14 Rule">
            You play with <B>13 tiles</B> on your rack, but you need <B>14 to win</B>.
            That 14th tile comes from either <B>drawing</B> it yourself or{' '}
            <B>calling</B> a tile someone else discards. When you get that final tile
            and it completes a hand on the card — that's <B>Mahjong!</B>
          </Callout>

          {/* 13 + 1 visual — single scrollable row */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <TileStrip delay={0.1}>
              {[1,2,3].map(n => <Tile key={`d${n}`} delay={0.05*n}><MiniDot n={n}/></Tile>)}
              {[1,2,3].map(n => <Tile key={`b${n}`} delay={0.15+0.05*n}><MiniBam n={n}/></Tile>)}
              {[7,8].map(n => <Tile key={`c${n}`} delay={0.3+0.05*n}><MiniCrak n={n}/></Tile>)}
              <Tile delay={0.45}><MiniWind d="N"/></Tile>
              <Tile delay={0.5}><MiniDragon type="red"/></Tile>
              <Tile delay={0.55}><MiniDragon type="red"/></Tile>
              <Tile delay={0.6}><MiniDragon type="red"/></Tile>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.cherry, margin: '0 4px',
                animation: 'entranceFade 0.4s ease 0.7s both' }}>+</span>
              <Tile delay={0.8} glow><MiniDragon type="red"/></Tile>
            </TileStrip>
            <div style={{
              fontSize: 10, color: t.light, fontStyle: 'italic',
              animation: 'entranceFade 0.4s ease 0.9s both',
            }}>13 tiles on your rack + 1 to win = 14</div>
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════
              2. ANATOMY OF A LINE
              ═══════════════════════════════════════════════ */}
          <SectionTitle sub="Every line tells the same story — here's how to read it">
            Anatomy of a Line
          </SectionTitle>

          <P>
            Each line on the card has three parts: the <B>tile pattern</B> (what tiles
            you need), the <B>point value</B>, and the <B>exposure type</B> (X or C).
          </P>

          {/* Example using card-notation + tiles */}
          <CardLineExample
            notation={[
              { text: 'FF', color: 'blue' },
              { text: '222', color: 'red' },
              { text: '4444', color: 'green' },
              { text: '66666', color: 'blue' },
            ]}
            tileGroups={[
              { tiles: [<MiniFlower n={1}/>, <MiniFlower n={2}/>], color: 'blue' },
              { tiles: [<MiniDot n={2}/>, <MiniDot n={2}/>, <MiniDot n={2}/>], color: 'red' },
              { tiles: [<MiniBam n={4}/>, <MiniBam n={4}/>, <MiniBam n={4}/>, <MiniBam n={4}/>], color: 'green' },
              { tiles: [<MiniCrak n={6}/>, <MiniCrak n={6}/>, <MiniCrak n={6}/>, <MiniCrak n={6}/>, <MiniJoker n={1}/>], color: 'blue' },
            ]}
            points={25}
            exposure="X"
            parenthetical="Any 3 Suits"
          />

          <div style={{
            display: 'flex', gap: 12, marginTop: -8, marginBottom: 16, fontSize: 10.5,
            color: t.light, flexWrap: 'wrap',
          }}>
            <span>FF = pair of Flowers</span>
            <span>222 = pung</span>
            <span>4444 = kong</span>
            <span>66666 = quint</span>
          </div>

          {/* ── GROUP TYPES ── */}
          <div style={{
            fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 600,
            color: isDark ? t.cerulean : C.dark, marginBottom: 10, letterSpacing: 0.5,
          }}>Group Sizes</div>

          <GroupExample
            label="Pair"
            tiles={<><MiniDot n={5}/><MiniDot n={5}/></>}
            note="2 identical — no jokers"
          />
          <GroupExample
            label="Pung"
            tiles={<><MiniBam n={3}/><MiniBam n={3}/><MiniBam n={3}/></>}
            note="3 identical — jokers OK"
          />
          <GroupExample
            label="Kong"
            tiles={<><MiniCrak n={7}/><MiniCrak n={7}/><MiniCrak n={7}/><MiniCrak n={7}/></>}
            note="4 identical — jokers OK"
          />
          <GroupExample
            label="Quint"
            tiles={<><MiniDot n={9}/><MiniDot n={9}/><MiniDot n={9}/><MiniDot n={9}/><MiniJoker n={1}/></>}
            note="5 identical — needs joker(s)"
          />

          <P>
            Singles (1 tile) appear as a lone number or letter.
            No jokers in singles or pairs — <B>only groups of 3 or more</B> can
            use jokers.
          </P>

          <Divider />

          {/* ═══════════════════════════════════════════════
              3. LETTERS & SYMBOLS
              ═══════════════════════════════════════════════ */}
          <SectionTitle sub="F, D, N, E, W, S, and 0">
            Letters & Symbols
          </SectionTitle>

          <div style={{ marginBottom: 16 }}>
            {[
              { sym: 'F', desc: 'Flower', tile: <MiniFlower n={1}/>, note: 'FF = pair, FFF = pung, FFFF = kong, etc.' },
              { sym: 'N E W S', desc: 'Wind tiles', tile: <MiniWind d="N"/>, note: 'Singles, pairs, or mixed groups like "NEWS"' },
              { sym: 'D', desc: 'Dragon (matching)', tile: <MiniDragon type="red"/>, note: 'The dragon that matches the assigned suit' },
              { sym: '0', desc: 'Zero (Soap)', tile: <MiniDragon type="white"/>, note: 'White dragon doubles as the number zero!' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                padding: '8px 12px', background: i % 2 === 0 ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)') : 'transparent',
                borderRadius: 10,
              }}>
                <div style={{ transform: 'scale(0.9)', flexShrink: 0 }}>{item.tile}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{
                      fontFamily: "'Bodoni Moda',serif", fontSize: 14, fontWeight: 700, color: C.cherry,
                    }}>{item.sym}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: t.dark }}>= {item.desc}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: t.light, marginTop: 1 }}>{item.note}</div>
                </div>
              </div>
            ))}
          </div>

          <Callout emoji="🐉" title="Dragon-Suit Pairing" color="#2E8B57">
            Each dragon "belongs" to a suit:<br/><br/>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MiniDragon type="red" /><span style={{ fontSize: 11, color: t.mid }}>→ Craks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MiniDragon type="green" /><span style={{ fontSize: 11, color: t.mid }}>→ Bams</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MiniDragon type="white" /><span style={{ fontSize: 11, color: t.mid }}>→ Dots</span>
              </div>
            </div>
            <br/>
            When a line says "D" (matching dragon), use the dragon that goes with
            that group's suit. Chose Bams? The matching dragon is the Green dragon.
          </Callout>

          <Divider />

          {/* ═══════════════════════════════════════════════
              4. COLORS = SUIT ASSIGNMENTS
              ═══════════════════════════════════════════════ */}
          <SectionTitle sub="The most important concept on the card">
            Colors on the Card
          </SectionTitle>

          <P>
            Here's the key insight: the <B>colors printed on the card aren't
            decorative</B>. They're suit assignment instructions. Every group on a
            line is printed in a color — typically <B>red, green, and blue</B>.
          </P>

          <Callout emoji="💡" title="The Color Rule">
            <B>Same color = same suit.</B> Different color = different suit.
            You pick which real suit (Dots, Bams, Craks) goes with which color.
            The card doesn't care — as long as you're consistent within the line.
          </Callout>

          <P>
            Here's a real example. On the card, you'd see colored text like this:
          </P>

          {/* Example 1: 3-suit hand from 2468 */}
          <CardLineExample
            notation={[
              { text: 'FF', color: 'blue' },
              { text: '222', color: 'red' },
              { text: '4444', color: 'green' },
              { text: '66666', color: 'blue' },
            ]}
            tileGroups={[
              { tiles: [<MiniFlower n={1}/>, <MiniFlower n={2}/>], color: 'blue' },
              { tiles: [<MiniDot n={2}/>, <MiniDot n={2}/>, <MiniDot n={2}/>], color: 'red' },
              { tiles: [<MiniBam n={4}/>, <MiniBam n={4}/>, <MiniBam n={4}/>, <MiniBam n={4}/>], color: 'green' },
              { tiles: [<MiniCrak n={6}/>, <MiniCrak n={6}/>, <MiniCrak n={6}/>, <MiniCrak n={6}/>, <MiniJoker n={1}/>], color: 'blue' },
            ]}
            points={25}
            exposure="X"
            parenthetical="Any 3 Suits"
          />

          <P>
            The <B>222</B> is printed in <span style={{color:'#C2413B',fontWeight:600}}>red</span>.
            The <B>4444</B> is in <span style={{color:'#2E8B57',fontWeight:600}}>green</span>.
            The <B>FF</B> and <B>66666</B> are both <span style={{color:'#4A7FA8',fontWeight:600}}>blue</span>.
            Since FF and 66666 share a color, the 6s must be in the same suit as the
            flowers' color assignment.
          </P>
          <P>
            You decide: red = Dots, green = Bams, blue = Craks? Go for it. Or flip
            them around. Any assignment works, as long as each color maps to one suit.
          </P>

          {/* Example 2: 1-suit hand */}
          <div style={{
            fontSize: 10, fontWeight: 600, color: t.light, textTransform: 'uppercase',
            letterSpacing: 1.5, marginBottom: 6, marginTop: 4,
          }}>What about a 1-suit hand?</div>

          <CardLineExample
            notation={[
              { text: 'FF', color: 'green' },
              { text: '11', color: 'green' },
              { text: '222', color: 'green' },
              { text: '3333', color: 'green' },
              { text: 'DDD', color: 'green' },
            ]}
            tileGroups={[
              { tiles: [<MiniFlower n={1}/>, <MiniFlower n={2}/>], color: 'green' },
              { tiles: [<MiniBam n={1}/>, <MiniBam n={1}/>], color: 'green' },
              { tiles: [<MiniBam n={2}/>, <MiniBam n={2}/>, <MiniBam n={2}/>], color: 'green' },
              { tiles: [<MiniBam n={3}/>, <MiniBam n={3}/>, <MiniBam n={3}/>, <MiniBam n={3}/>], color: 'green' },
              { tiles: [<MiniDragon type="green"/>, <MiniDragon type="green"/>, <MiniDragon type="green"/>], color: 'green' },
            ]}
            points={25}
            exposure="X"
            parenthetical="Any 1 Suit, Any 3 Consecutive Numbers, Matching Dragon"
          />

          <P>
            Everything is the <B>same color</B> — so everything is the same suit.
            The "D" is the matching dragon for that suit. If you pick Bams, the
            dragon is the Green dragon. Pick Craks? Red dragon.
          </P>

          <Divider />

          {/* ═══════════════════════════════════════════════
              5. READ THE PARENTHESES
              ═══════════════════════════════════════════════ */}
          <SectionTitle>Read the Parentheses!</SectionTitle>

          <Callout emoji="⚠️" title="This is the #1 Tip" color={C.cherry}>
            Every section has <B>parenthetical notes</B> underneath the section header
            and sometimes under individual lines. These are <B>not optional flavor
            text</B> — they tell you critical rules like how many suits to use
            and whether numbers can be substituted.
          </Callout>

          <P>Common parenthetical phrases and what they mean:</P>

          <div style={{ marginBottom: 16 }}>
            {[
              { text: '"Any 3 suits"', meaning: 'Each color must map to a different suit — all 3 required' },
              { text: '"Any 1 suit"', meaning: 'Every numbered group uses the same suit' },
              { text: '"Any 2 suits"', meaning: 'Exactly two suits are used' },
              { text: '"These numbers only"', meaning: 'No substitutions — use exactly the numbers shown' },
              { text: '"Any 3 consecutive numbers"', meaning: 'Pick any run of 3 (e.g. 4-5-6 or 7-8-9)' },
              { text: '"Like numbers"', meaning: 'Pick one number and use it everywhere' },
              { text: '"Matching dragons"', meaning: 'Dragon matches the suit (Red→Craks, Green→Bams, Soap→Dots)' },
              { text: '"Opposite dragons"', meaning: 'Dragon that does NOT match the suit' },
            ].map((p, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start',
              }}>
                <span style={{
                  fontFamily: "'Bodoni Moda',serif", fontSize: 11.5, fontWeight: 600,
                  color: C.cherry, flexShrink: 0, whiteSpace: 'nowrap',
                }}>{p.text}</span>
                <span style={{ fontSize: 11, color: t.mid }}>→ {p.meaning}</span>
              </div>
            ))}
          </div>

          <P>
            Ignoring the parentheses is the fastest way to build the wrong
            hand. <B>Always read them first.</B>
          </P>

          <Divider />

          {/* ═══════════════════════════════════════════════
              6. EXPOSURE: X vs C
              ═══════════════════════════════════════════════ */}
          <SectionTitle>Exposure: X vs C</SectionTitle>

          <P>
            Every line is marked with an <B>X</B> or a <B>C</B> on the right side.
            This tells you whether you can show parts of your hand during play.
          </P>

          <div
            onClick={() => setExpandXC(!expandXC)}
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)',
              borderRadius: expandXC ? 14 : 10,
              padding: expandXC ? '14px 16px' : '10px 16px',
              border: `1px solid ${t.lavBorder}`, cursor: 'pointer',
              transition: 'all 0.3s ease', marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{
                  padding: '3px 10px', borderRadius: 6,
                  background: 'rgba(109,191,168,0.12)', border: '1px solid rgba(109,191,168,0.25)',
                  fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 700, color: '#4A9E88',
                }}>X</div>
                <span style={{ fontSize: 12, color: t.dark, fontWeight: 500 }}>
                  Exposed — you may call tiles & show groups
                </span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={t.mid} strokeWidth="2" strokeLinecap="round"
                style={{ transition: 'transform 0.3s', transform: expandXC ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {expandXC && (
              <div style={{ marginTop: 12, fontSize: 11.5, color: t.mid, lineHeight: 1.6 }}>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{
                      padding: '2px 8px', borderRadius: 5, background: 'rgba(109,191,168,0.12)',
                      fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 700, color: '#4A9E88',
                    }}>X</div>
                    <span style={{ fontWeight: 600, color: isDark ? t.cerulean : C.dark }}>= Exposed</span>
                  </div>
                  You <B>can</B> call discarded tiles and place groups face-up on your rack.
                  Most hands are X — it's the more flexible option.
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{
                      padding: '2px 8px', borderRadius: 5, background: 'rgba(224,48,80,0.08)',
                      fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 700, color: C.cherry,
                    }}>C</div>
                    <span style={{ fontWeight: 600, color: isDark ? t.cerulean : C.dark }}>= Concealed</span>
                  </div>
                  You <B>cannot</B> call tiles from other players' discards (except for
                  Mahjong). Your entire hand stays hidden. Concealed hands are harder but
                  usually worth more points.
                </div>
              </div>
            )}
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════
              7. JOKER RULES
              ═══════════════════════════════════════════════ */}
          <SectionTitle>Joker Rules</SectionTitle>

          <P>
            Jokers are wild tiles that can substitute for other tiles, but with rules.
          </P>

          <div
            onClick={() => setExpandJoker(!expandJoker)}
            style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)',
              borderRadius: expandJoker ? 14 : 10,
              padding: expandJoker ? '14px 16px' : '10px 16px',
              border: `1px solid ${t.lavBorder}`, cursor: 'pointer',
              transition: 'all 0.3s ease', marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ transform: 'scale(0.85)', flexShrink: 0 }}><MiniJoker n={1} /></div>
                <span style={{ fontSize: 12, color: t.dark, fontWeight: 500 }}>Joker quick-reference</span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={t.mid} strokeWidth="2" strokeLinecap="round"
                style={{ transition: 'transform 0.3s', transform: expandJoker ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {expandJoker && (
              <div style={{ marginTop: 12, fontSize: 11.5, color: t.mid, lineHeight: 1.7 }}>
                <div style={{ marginBottom: 4 }}>✅ <B>Groups of 3+</B> — pungs, kongs, quints</div>
                <div style={{ marginBottom: 4 }}>❌ <B>Singles & pairs</B> — never</div>
                <div style={{ marginBottom: 4 }}>❌ <B>Singles & Pairs section</B> — no jokers at all</div>
                <div style={{ marginBottom: 4 }}>⭐ <B>Quints</B> — jokers are <em>required</em> (only 4 of each tile exist)</div>
                <div>🔄 <B>Swap rule</B> — if an opponent has a joker in an exposed group, you can swap it with the real tile</div>
              </div>
            )}
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════
              8. SECTIONS
              ═══════════════════════════════════════════════ */}
          <SectionTitle sub="The card is organized into categories">
            Sections on the Card
          </SectionTitle>

          <P>
            The card is divided into about 10 sections, each with a theme:
          </P>

          <div style={{ marginBottom: 16 }}>
            {[
              { name: 'Year', desc: 'Hands using digits of the current year', ex: '2025, 20, 25' },
              { name: '2468', desc: 'Even numbers only', ex: 'Pairs, pungs, kongs of 2, 4, 6, 8' },
              { name: 'Any Like Numbers', desc: 'Pick a number, repeat it', ex: '111 111 1111 1111' },
              { name: 'Quints', desc: 'Hands with 5-of-a-kind groups', ex: 'Requires jokers!' },
              { name: 'Consecutive Run', desc: 'Sequential numbers in a row', ex: '1-2-3, 3-4-5-6, etc.' },
              { name: '13579', desc: 'Odd numbers only', ex: 'Pairs, pungs, kongs of 1, 3, 5, 7, 9' },
              { name: 'Winds & Dragons', desc: 'Emphasis on honor tiles', ex: 'N, E, W, S, and dragons' },
              { name: '369', desc: 'Multiples of three', ex: '3s, 6s, and 9s' },
              { name: 'Singles & Pairs', desc: 'No group larger than a pair', ex: 'No jokers allowed!' },
            ].map((sec, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, marginBottom: 6, padding: '6px 10px',
                background: i % 2 === 0 ? (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.4)') : 'transparent',
                borderRadius: 8,
              }}>
                <div style={{
                  fontFamily: "'Bodoni Moda',serif", fontSize: 11.5, fontWeight: 600,
                  color: C.cherry, minWidth: 100, flexShrink: 0,
                }}>{sec.name}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: t.dark, fontWeight: 500 }}>{sec.desc}</div>
                  <div style={{ fontSize: 10, color: t.light, fontStyle: 'italic' }}>{sec.ex}</div>
                </div>
              </div>
            ))}
          </div>

          <Divider />

          {/* ═══════════════════════════════════════════════
              9. PUTTING IT TOGETHER
              ═══════════════════════════════════════════════ */}
          <SectionTitle>Putting It Together</SectionTitle>

          <P>Here's a step-by-step for reading any line on the card:</P>

          <div style={{ marginBottom: 20 }}>
            {[
              { title: 'Read the section header & parentheses', desc: 'Know which category you\'re in and any constraints before looking at individual lines.' },
              { title: 'Count the groups', desc: 'Identify pairs, pungs, kongs, quints, and singles. They should add up to exactly 14 tiles.' },
              { title: 'Check the colors', desc: 'Same color = same suit. Decide which suit maps to which color based on your tiles.' },
              { title: 'Note the X or C', desc: 'This affects your strategy — concealed hands mean no calling (except for Mahjong).' },
              { title: 'Check the point value', desc: '25 and 30 point hands are most common. Higher point hands are harder but pay off big.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <StepNum n={i + 1} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: isDark ? t.cerulean : C.dark, marginBottom: 4 }}>{step.title}</div>
                  <div style={{ fontSize: 11.5, color: t.mid, lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── FINAL ENCOURAGEMENT ── */}
          <div style={{
            background: isDark ? 'rgba(109,191,168,0.06)' : 'linear-gradient(135deg, rgba(109,191,168,0.08), rgba(142,199,226,0.08))',
            borderRadius: 14, padding: '16px 18px',
            border: isDark ? '1px solid rgba(109,191,168,0.1)' : '1px solid rgba(109,191,168,0.15)',
            textAlign: 'center', marginBottom: 20,
          }}>
            <div style={{
              fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600,
              color: isDark ? t.cerulean : C.dark, marginBottom: 6,
            }}>You've got this 🀄</div>
            <div style={{ fontSize: 12, color: t.mid, lineHeight: 1.5 }}>
              The card looks intimidating at first, but once you understand the
              pattern — colors, groups, parentheses — you'll be reading lines like
              a pro. It just takes a few games.
            </div>
          </div>

          {/* Next lesson button */}
          {onNavigate && (
            <div
              onClick={() => onNavigate("Setting the Table")}
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
              Ready? Set the Table and Deal!
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          )}

        </div>
      </Cnt>
    </>
  );
}
