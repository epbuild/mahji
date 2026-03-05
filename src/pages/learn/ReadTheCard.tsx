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

const Callout = ({ title, children, color = '#4A96B8' }: {
  title: string; children: React.ReactNode; color?: string;
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

const CardText = ({ text, color }: { text: string; color: 'red' | 'green' | 'blue' }) => {
  const colMap = { red: '#C2413B', green: '#2E8B57', blue: '#4A7FA8' };
  return (
    <span style={{
      fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 700,
      color: colMap[color], letterSpacing: 1,
    }}>{text}</span>
  );
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [tileScale, setTileScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current && innerRef.current) {
        const containerW = containerRef.current.offsetWidth;
        const contentW = innerRef.current.scrollWidth;
        if (contentW > containerW && containerW > 0) {
          setTileScale(Math.max(0.4, containerW / contentW));
        } else {
          setTileScale(1);
        }
      }
    };
    // Delay measure to allow tiles to render
    const timer = setTimeout(measure, 50);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measure); };
  }, [tileGroups]);

  const colorMap = {
    red: { bg: isDark ? 'rgba(194,65,59,0.10)' : 'rgba(194,65,59,0.06)', border: isDark ? 'rgba(194,65,59,0.40)' : 'rgba(194,65,59,0.18)' },
    green: { bg: isDark ? 'rgba(46,139,87,0.10)' : 'rgba(46,139,87,0.06)', border: isDark ? 'rgba(46,139,87,0.40)' : 'rgba(46,139,87,0.18)' },
    blue: { bg: isDark ? 'rgba(74,127,168,0.10)' : 'rgba(74,127,168,0.06)', border: isDark ? 'rgba(74,127,168,0.40)' : 'rgba(74,127,168,0.18)' },
  };
  return (
    <div style={{
      background: isDark ? 'rgba(255,255,255,0.025)' : '#FDFCFE',
      borderRadius: 14, padding: '14px 16px',
      border: `1px solid ${t.lavBorder}`, marginBottom: 16,
      boxShadow: isDark ? 'none' : '0 2px 12px rgba(126,100,164,0.04)',
      animation: `entranceFade 0.5s ease ${delay}s both`,
    }}>
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
      <div ref={containerRef} style={{ overflow: 'hidden', paddingBottom: 2 }}>
        <div ref={innerRef} style={{
          display: 'inline-flex', gap: 3, alignItems: 'center', whiteSpace: 'nowrap',
          transform: tileScale < 1 ? `scale(${tileScale})` : undefined,
          transformOrigin: 'left top',
          marginBottom: tileScale < 1 ? `${-(1 - tileScale) * 70}px` : undefined,
        }}>
          {tileGroups.map((g, gi) => (
            <div key={gi} style={{
              display: 'inline-flex', gap: 0, alignItems: 'center',
              background: colorMap[g.color].bg,
              border: `1px dashed ${colorMap[g.color].border}`,
              borderRadius: 8, padding: '4px 3px', flexShrink: 0,
            }}>
              {g.tiles.map((tl, ti) => (
                <div key={ti} style={{ transform: 'scale(0.75)', margin: '0 -4px', flexShrink: 0 }}>{tl}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Collapsible dropdown component ─── */
const Dropdown = ({ title, icon, children, defaultOpen = false }: {
  title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.5)',
        borderRadius: open ? 14 : 10,
        padding: open ? '14px 16px' : '10px 16px',
        border: `1px solid ${t.lavBorder}`, cursor: 'pointer',
        transition: 'all 0.3s ease', marginBottom: 16,
      }}
    >
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <span style={{ fontSize: 12, color: t.dark, fontWeight: 500 }}>{title}</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke={t.mid} strokeWidth="2" strokeLinecap="round"
          style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div onClick={e => e.stopPropagation()} style={{ marginTop: 12, cursor: 'default' }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── Sub-section collapsible (for Anatomy of a Line) ─── */
const SubSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 8 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
          background: open ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(243,239,250,0.6)') : 'transparent',
          border: open ? `1px solid ${t.lavBorder}` : '1px solid transparent',
          transition: 'all 0.25s',
        }}
      >
        <span style={{
          fontFamily: "'Bodoni Moda',serif", fontSize: 13.5, fontWeight: 600,
          color: isDark ? t.cerulean : C.dark, letterSpacing: 0.3,
        }}>{title}</span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke={isDark ? t.cerulean : C.dark} strokeWidth="2" strokeLinecap="round"
          style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && (
        <div style={{ padding: '10px 12px 4px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

/* ─── Collapsible section with red title + caret ─── */
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
      {open && <div>{children}</div>}
    </div>
  );
};

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────── */
export default function ReadTheCard({ onBack, onNavigate }: { onBack: () => void; onNavigate?: (lesson: string) => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
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

      <PT>Read the Game Card</PT>

      <Cnt>
        <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>

          {/* ═══════════════════════════════════════════════
              INTRO
              ═══════════════════════════════════════════════ */}
          <P>
            Every player at the table uses a copy of the same <B>Game Card</B>, the
            reference sheet for all winning hands. While the National Mah Jongg League
            (NMJL) card released each April is the standard, various brands exist and
            are all read the same way. The golden rule: everyone at the table must play
            from the same card!
          </P>

          <P>
            Your job? <B>Match your tiles to one of the lines on the card.</B> That's
            how you win. Each line describes exactly which 14 tiles you need.
          </P>

          <Callout title="The 13 → 14 Rule">
            You play with <B>13 tiles</B> on your rack, but you need <B>14 to win</B>.
            That 14th tile comes from either <B>drawing</B> it yourself or{' '}
            <B>calling</B> a tile someone else discards. When you get that final tile
            and it completes a hand on the card — that's <B>Mahjong!</B>
          </Callout>

          {/* 13 + 1 visual */}
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
              2. CARD ORIENTATION (collapsible)
              ═══════════════════════════════════════════════ */}
          <CollapsibleSection title="Navigate the Card">
            <P>
              The card is divided into about 10 sections, each with a theme:
            </P>

            <div style={{ marginBottom: 14 }}>
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

            <P>
              Understanding these sections is key to reading the card strategically.
              If you notice your tiles clustering around a theme — say you're
              collecting a lot of 3s, 6s, and 9s — you can focus on that section and
              stay flexible across its different hands as the game unfolds. It's
              really about <B>pattern recognition</B>: spotting which section your
              tiles naturally lean toward and adapting within it.
            </P>

            <P>
              Within each section, each line on the card has three parts: the{' '}
              <B>tile pattern</B> (what tiles you need), the <B>exposure type</B>{' '}
              (X or C), and the <B>point value</B> — all covered below.
            </P>
          </CollapsibleSection>

          <Divider />

          {/* ═══════════════════════════════════════════════
              3. ANATOMY OF A LINE (collapsible)
              ═══════════════════════════════════════════════ */}
          <CollapsibleSection title="Anatomy of a Line">
          <p style={{ fontSize: 13, color: t.mid, lineHeight: 1.65, marginBottom: 14, fontStyle: 'italic' }}>
            The card uses a simple shorthand. Each line is made up of a unique set of{' '}
            <span style={{ fontWeight: 700, fontStyle: 'normal', color: isDark ? t.cerulean : C.dark }}>symbols</span>,{' '}
            <span style={{ fontWeight: 700, fontStyle: 'normal', color: isDark ? t.cerulean : C.dark }}>groupings</span>,{' '}
            <span style={{ fontWeight: 700, fontStyle: 'normal', color: isDark ? t.cerulean : C.dark }}>colors</span>, and{' '}
            <span style={{ fontWeight: 700, fontStyle: 'normal', color: isDark ? t.cerulean : C.dark }}>parenthetical instructions</span>
          </p>

          {/* Example card line */}
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

          {/* ── SUB-SECTIONS ── */}

          <SubSection title="Symbols">
            <P>
              Numbers on the card (1-9) represent numbered tiles from any suit.
              Letters represent special tiles:
            </P>
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

            <Callout title="Dragon-Suit Pairing" color="#2E8B57">
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
          </SubSection>

          <SubSection title="Groupings or 'Melds'">
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
              No jokers in singles or pairs — <B>only groups of 3 or more
              identical tiles</B> can use jokers.
            </P>
          </SubSection>

          <SubSection title="Colors">
            <P>
              Here's the key insight: the <B>colors printed on the card aren't
              decorative</B>. They're suit assignment instructions. Every group on a
              line is printed in a color — typically <B>red, green, and blue</B>.
            </P>

            <Callout title="The Color Rule">
              <B>Same color = same suit.</B> Different color = different suit.
              You pick which real suit (Dots, Bams, Craks) goes with which color.
              The card doesn't care — as long as you're consistent within the line.
            </Callout>

            <P>
              Here's a real example. On the card, you'd see colored text like this:
            </P>

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
          </SubSection>

          <SubSection title="Parentheses">
            <Callout title="This is the #1 Tip" color={C.cherry}>
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
          </SubSection>
          </CollapsibleSection>

          <Divider />

          {/* ═══════════════════════════════════════════════
              4. EXPOSURE: X vs C (collapsible)
              ═══════════════════════════════════════════════ */}
          <CollapsibleSection title="Exposure: X vs C">
            <P>
              Every line is marked with an <B>X</B> or a <B>C</B> on the right side.
              This tells you whether you can show parts of your hand during play.
            </P>
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{
                  padding: '2px 8px', borderRadius: 5, background: 'rgba(109,191,168,0.12)',
                  fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 700, color: '#4A9E88',
                }}>X</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? t.cerulean : C.dark }}>= Exposed</span>
              </div>
              <div style={{ fontSize: 11.5, color: t.mid, lineHeight: 1.6 }}>
                You <B>can</B> call discarded tiles and place groups face-up on your rack.
                Most hands are X — it's the more flexible option.
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{
                  padding: '2px 8px', borderRadius: 5, background: 'rgba(224,48,80,0.08)',
                  fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 700, color: C.cherry,
                }}>C</div>
                <span style={{ fontSize: 12, fontWeight: 600, color: isDark ? t.cerulean : C.dark }}>= Concealed</span>
              </div>
              <div style={{ fontSize: 11.5, color: t.mid, lineHeight: 1.6 }}>
                You <B>cannot</B> call tiles from other players' discards (except for
                Mahjong). Your entire hand stays hidden. Concealed hands are harder but
                usually worth more points.
              </div>
            </div>
          </CollapsibleSection>

          <Divider />

          {/* ═══════════════════════════════════════════════
              5. JOKER RULES (collapsible)
              ═══════════════════════════════════════════════ */}
          <CollapsibleSection title="Joker Rules">
            <P>
              Jokers are wild tiles that can substitute for other tiles — but there
              are clear rules about when and where they're allowed.
            </P>
            {[
              { rule: 'Never in a Single or Pair', detail: 'A single tile or a pair must always be the real tiles — no joker substitution allowed.' },
              { rule: 'Matching groups of 3+ only', detail: 'Jokers can only substitute in pungs (3), kongs (4), and quints (5). The group must be matching tiles — identical tiles repeated.' },
              { rule: 'Quints require at least one joker', detail: 'Since only 4 of each tile exist in the set, a group of 5 always needs at least one joker to complete it.' },
              { rule: 'Jokers can fill an entire group', detail: 'If you have 3 or more matching tiles, you can use jokers for any or all of the remaining pieces in the group.' },
              { rule: 'The Second Life Swap Rule', detail: 'If an opponent has a joker in an exposed group on their rack, you can trade the real tile for the joker on your turn.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, marginBottom: 10, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%', background: C.cherry,
                  marginTop: 6, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? t.cerulean : C.dark, marginBottom: 2 }}>{item.rule}</div>
                  <div style={{ fontSize: 11.5, color: t.mid, lineHeight: 1.5 }}>{item.detail}</div>
                </div>
              </div>
            ))}
            <div style={{
              fontSize: 10.5, color: t.light, fontStyle: 'italic', lineHeight: 1.6,
              padding: '8px 12px', marginTop: 4,
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(243,239,250,0.4)',
              borderRadius: 8,
            }}>
              Remember: "matching" means identical tiles repeated (like NNN or 1111).
              A hand with NEWS or 112345 is made up of individual singles — not
              matching groups — so jokers cannot be used there.
            </div>
          </CollapsibleSection>

          <Divider />

          {/* ═══════════════════════════════════════════════
              6. POINTS (collapsible)
              ═══════════════════════════════════════════════ */}
          <CollapsibleSection title="Points">
            <P>
              Every line on the card has a <B>point value</B> shown on the right side,
              typically <B>25</B>, <B>30</B>, <B>50</B>, or <B>75</B> points. The harder
              the hand is to complete, the more it's worth.
            </P>
            <P>
              Concealed hands (C) tend to be worth more than exposed hands (X)
              because they're harder to build without calling tiles. Hands with quints
              or rare tile combinations also carry higher point values.
            </P>
            <P>
              Points determine how much the winner collects from the other players
              at the end of each round. For a full breakdown of scoring, payment
              rules, and special bonuses, check out the{' '}
              <B>Scoring & Payment Systems</B> module.
            </P>
          </CollapsibleSection>

          <Divider />

          {/* ═══════════════════════════════════════════════
              7. PUTTING IT TOGETHER (not collapsible — prominent box)
              ═══════════════════════════════════════════════ */}
          <div style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(109,191,168,0.06), rgba(142,199,226,0.06))'
              : 'linear-gradient(135deg, rgba(109,191,168,0.06), rgba(142,199,226,0.06))',
            borderRadius: 16, padding: '18px 20px',
            border: isDark ? '1.5px solid rgba(109,191,168,0.15)' : '1.5px solid rgba(109,191,168,0.2)',
            boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.15)' : '0 4px 20px rgba(109,191,168,0.08)',
            marginBottom: 20,
          }}>
            <div style={{
              fontFamily: "'Bodoni Moda',serif", fontSize: 18, fontWeight: 600,
              color: isDark ? '#fff' : C.lavDeep, letterSpacing: 0.5,
              textAlign: 'center', marginBottom: 10,
            }}>Cheat Sheet</div>
            <P>Here's a step-by-step for reading any line on the card:</P>

            <div style={{ marginBottom: 4 }}>
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
