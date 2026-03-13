import { useTheme } from "../constants/ThemeContext";
import { C } from "../constants/colors";
import { Cnt } from "../components/Layout";

const FONT_SERIF = "'Bodoni Moda', serif";
const FONT_SANS = "'Outfit', sans-serif";

/* Dark purple accent palette — #2D1B4E based */
const DP = {
  rule: "rgba(45,27,78,0.22)",
  ruleDk: "rgba(255,255,255,0.1)",
  vDiv: "rgba(45,27,78,0.16)",
  vDivDk: "rgba(255,255,255,0.08)",
  label: "rgba(45,27,78,0.48)",
  labelDk: "rgba(255,255,255,0.4)",
  statLabel: "rgba(45,27,78,0.38)",
  statLabelDk: "rgba(255,255,255,0.3)",
  accent: "rgba(45,27,78,0.28)",
  accentDk: "rgba(255,255,255,0.14)",
  tagline: "rgba(45,27,78,0.42)",
  taglineDk: "rgba(255,255,255,0.45)",
  sub: "rgba(45,27,78,0.32)",
  subDk: "rgba(255,255,255,0.32)",
  body: "rgba(45,27,78,0.38)",
  bodyDk: "rgba(255,255,255,0.38)",
  footer: "rgba(45,27,78,0.24)",
  footerDk: "rgba(255,255,255,0.2)",
};

/* ── Thin rule separator ── */
const Rule = ({ isDark }: { isDark: boolean }) => (
  <div style={{ height: 1, background: isDark ? DP.ruleDk : DP.rule }} />
);

/* ── Stat column ── */
const Stat = ({ num, label, isDark }: { num: string; label: string; isDark: boolean }) => (
  <div style={{ flex: "1 1 0", textAlign: "center", padding: "24px 0" }}>
    <div style={{
      fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 400,
      color: isDark ? "rgba(255,255,255,0.88)" : C.dark,
      lineHeight: 1, letterSpacing: 0.5,
    }}>{num}</div>
    <div style={{
      fontSize: 8.5, textTransform: "uppercase" as const, letterSpacing: 3,
      color: isDark ? DP.statLabelDk : DP.statLabel,
      marginTop: 8, fontWeight: 500, fontFamily: FONT_SANS,
    }}>{label}</div>
  </div>
);

/* ── Vertical thin divider ── */
const VRule = ({ isDark }: { isDark: boolean }) => (
  <div style={{
    width: 1, alignSelf: "stretch", margin: "16px 0",
    background: isDark ? DP.vDivDk : DP.vDiv,
  }} />
);

/* ═══════════════════════════════════
   HOME PAGE — Editorial
   ═══════════════════════════════════ */
function HomePage({ onNav, signedIn }: { onNav: (page: string) => void; signedIn: boolean }) {
  const { isDark } = useTheme();

  const dim = isDark ? DP.subDk : DP.sub;

  return (
    <>
      {/* Hero */}
      <div className="hero-section home-entrance-item" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: 9, fontFamily: FONT_SANS, textTransform: "uppercase",
          letterSpacing: 4.5, color: isDark ? DP.labelDk : DP.label,
          marginBottom: 12, fontWeight: 500,
        }}>THE CLUBHOUSE</div>
        <h1 className="hero-title" style={{
          color: isDark ? "rgba(255,255,255,0.92)" : C.dark,
          textShadow: "none",
        }}>MAHJI</h1>
        <div style={{
          width: 36, height: 1, margin: "8px auto 12px",
          background: isDark ? DP.accentDk : DP.accent,
        }} />
        <p style={{
          fontSize: 15, margin: 0,
          fontFamily: FONT_SERIF, fontStyle: "italic", fontWeight: 400,
          color: isDark ? DP.taglineDk : DP.tagline,
          letterSpacing: 0.3,
        }}>
          Mahjong, Your Way
        </p>
      </div>

      <Cnt>
        <div style={{ position: "relative", zIndex: 1 }}>

          {/* ── Stats ── */}
          <div className="home-entrance-item">
            <Rule isDark={isDark} />
            <div style={{ display: "flex", alignItems: "center" }}>
              <Stat num="7d" label="Streak" isDark={isDark} />
              <VRule isDark={isDark} />
              <Stat num="12" label="Games" isDark={isDark} />
              <VRule isDark={isDark} />
              <Stat num="3" label="Wins" isDark={isDark} />
            </div>
            <Rule isDark={isDark} />
          </div>

          {/* ── Play Now ── */}
          <div
            className="home-entrance-item"
            onClick={() => onNav("play")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "24px 2px", cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: C.cherry, flexShrink: 0,
              }} />
              <div>
                <div style={{
                  fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 400,
                  color: isDark ? "rgba(255,255,255,0.88)" : C.dark,
                  lineHeight: 1.2,
                }}>
                  Play <em style={{ color: C.cherry }}>Now</em>
                </div>
                <div style={{
                  fontFamily: FONT_SANS, fontSize: 11,
                  color: dim, marginTop: 3,
                }}>Challenge AI or invite friends</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#4ADE80", display: "inline-block",
              }} />
              <span style={{ fontFamily: FONT_SANS, fontSize: 10, color: dim }}>2,341</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={dim} strokeWidth="1.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>

          <Rule isDark={isDark} />

          {/* ── Copy ── */}
          <div className="home-entrance-item" style={{ padding: "30px 2px 36px" }}>
            <p style={{
              fontFamily: FONT_SANS, fontSize: 14, lineHeight: 1.85,
              color: isDark ? DP.bodyDk : DP.body,
              margin: 0, letterSpacing: 0.2,
            }}>
              Train between game nights. Track your real-world scores. Discover which hands you own and which ones own you. Mahji is where your mahjong life lives.
            </p>
          </div>

          {/* ── Footer ── */}
          <div className="home-entrance-item">
            <Rule isDark={isDark} />
            <div style={{ display: "flex", justifyContent: "center", gap: 24, paddingTop: 22, paddingBottom: 6 }}>
              <span onClick={() => onNav("terms")} style={{
                fontSize: 8.5, color: isDark ? DP.footerDk : DP.footer, cursor: "pointer",
                fontFamily: FONT_SANS, textTransform: "uppercase",
                letterSpacing: 2.5, fontWeight: 500,
              }}>Terms</span>
              <span onClick={() => onNav("privacy")} style={{
                fontSize: 8.5, color: isDark ? DP.footerDk : DP.footer, cursor: "pointer",
                fontFamily: FONT_SANS, textTransform: "uppercase",
                letterSpacing: 2.5, fontWeight: 500,
              }}>Privacy</span>
            </div>
            <p style={{
              textAlign: "center", fontSize: 8.5, margin: "6px 0 0",
              color: isDark ? DP.footerDk : DP.footer, fontFamily: FONT_SANS, letterSpacing: 1,
            }}>© Mahji LLC</p>
          </div>
        </div>
      </Cnt>
    </>
  );
}

export default HomePage;
