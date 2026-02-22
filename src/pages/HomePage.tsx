import { useState } from "react";
import { useTheme } from "../constants/ThemeContext";
import { C, getThemeColors } from "../constants/colors";
import { DecoLine, FooterDeco, BirdIcon } from "../components/ui/Icons";
import { Cnt, BamFloat } from "../components/Layout";

const FONT_SERIF = "'Bodoni Moda', serif";
const FONT_SANS = "'Outfit', sans-serif";

/* ── STAT CARD — Pearlescent glass ── */
const StatCard = ({ num, label, t }) => (
  <div style={{
    flex: "1 1 0", maxWidth: 115, borderRadius: 12, padding: "1.5px",
    background: t.statGradBorder, cursor: "pointer",
    transition: "all 0.3s",
    boxShadow: t.statShadow,
  }}>
    <div style={{
      background: t.statInnerBg, borderRadius: 10.5,
      padding: "14px 8px 12px",
      textAlign: "center", position: "relative", overflow: "hidden",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%", background: t.statGloss, borderRadius: "10.5px 10.5px 0 0", pointerEvents: "none" }} />
      <div style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 600, color: t.statNumColor, lineHeight: 1, position: "relative" }}>{num}</div>
      <div style={{ fontSize: 8, color: t.textDim, textTransform: "uppercase", letterSpacing: 2, marginTop: 5, fontWeight: 500, position: "relative", fontFamily: FONT_SANS, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  </div>
);

/* ── FEATURE CARD — Frosted glass with gloss ── */
const FeatureCard = ({ title, desc, icon, isBird, t, onClick }) => (
  <div
    onClick={onClick}
    className="home-card"
    style={{
      background: t.cardBg,
      border: `0.5px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: "16px 14px",
      overflow: "hidden",
      borderTop: `2.5px solid ${t.cardTopAccent}`,
      position: "relative",
      cursor: "pointer",
      boxShadow: t.cardShadow,
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}
  >
    {/* Inner gloss highlight */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: t.cardGloss, borderRadius: "14px 14px 0 0", pointerEvents: "none" }} />
    <div className="home-card-icon" style={{ background: t.cardIconBg, color: t.cardIconColor, position: "relative" }}>
      {isBird ? <BirdIcon size={15} color={t.cardIconColor} sw={1.8} /> : icon}
    </div>
    <h3 className="card-title" style={{ color: t.textMain, marginBottom: 2, position: "relative" }}>{title}</h3>
    <p className="card-desc" style={{ color: t.textDim, margin: 0, lineHeight: 1.4, position: "relative" }}>{desc}</p>
  </div>
);

/* ── PLAY NOW BANNER — Dimensional glass ── */
const PlayNowBanner = ({ t, isDark, onClick }) => (
  <div
    onClick={onClick}
    className="play-now-banner"
    style={{
      background: t.playNowBg,
      border: t.playNowBorder,
      borderRadius: 14,
      marginBottom: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      boxShadow: t.playNowShadow,
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
    }}
  >
    {/* Inner gloss */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: t.playNowGloss, borderRadius: "14px 14px 0 0", pointerEvents: "none" }} />
    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
      {/* Realistic cherry play button */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: `linear-gradient(145deg, ${C.cherryLt}, ${C.cherry})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 3px 10px rgba(224,48,80,0.3), 0 1px 3px rgba(224,48,80,0.2), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 2px rgba(0,0,0,0.1)",
        color: "white", position: "relative", overflow: "hidden",
      }}>
        {/* Button gloss */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 45%, transparent 50%, rgba(0,0,0,0.05) 100%)", borderRadius: "50%", pointerEvents: "none" }} />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{position:"relative"}}><polygon points="6 3 20 12 6 21 6 3" /></svg>
      </div>
      <div>
        <h3 style={{ fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 700, color: t.playNowTitle, marginBottom: 0 }}>Play Now</h3>
        <p style={{ fontSize: 10.5, color: t.playNowSub, opacity: t.playNowSubOp, margin: 0, fontFamily: FONT_SANS }}>Challenge AI or invite friends</p>
      </div>
    </div>
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "3px 8px", borderRadius: 10, fontSize: 9,
      color: t.textDim, fontFamily: FONT_SANS,
      background: t.playNowBadgeBg, border: t.playNowBadgeBorder,
      position: "relative",
    }}>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />2,341
    </div>
  </div>
);

/* ── NAV ICONS ── */
const BookIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const ClockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
const BagIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;

/* ═══════════════════════════════════
   HOME PAGE — Photorealistic
   ═══════════════════════════════════ */
function HomePage({ onNav, signedIn }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const isNewUser = !signedIn;

  return (
    <>
      {/* Atmospheric light sources */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0 }}>
        {isDark ? <>
          <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(142,199,226,0.035) 0%, rgba(142,199,226,0.01) 40%, transparent 70%)", filter: "blur(12px)" }} />
          <div style={{ position: "absolute", bottom: 60, left: -30, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,191,168,0.025) 0%, transparent 70%)", filter: "blur(10px)" }} />
          <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 350, height: 120, background: "radial-gradient(ellipse, rgba(192,178,212,0.018) 0%, transparent 70%)", filter: "blur(16px)" }} />
        </> : <>
          <div style={{ position: "absolute", top: -40, right: -30, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(248,240,255,0.5) 0%, rgba(243,239,250,0.2) 40%, transparent 70%)", filter: "blur(8px)" }} />
          <div style={{ position: "absolute", bottom: 80, left: -20, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(237,245,250,0.4) 0%, transparent 70%)", filter: "blur(10px)" }} />
          {/* Silk texture overlay */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 120% 80% at 30% 20%, rgba(243,239,250,0.2) 0%, transparent 60%)" }} />
        </>}
      </div>

      {/* Hero */}
      <div className="hero-section home-entrance-item" style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 400,
          letterSpacing: 5.5, color: t.heroSubColor,
          textTransform: "uppercase", marginBottom: 5,
          opacity: isDark ? 0.5 : 0.6,
        }}>
          Let's Play
        </div>
        <h1 className="hero-title" style={{
          color: t.heroTitleColor,
          textShadow: isDark ? "0 1px 12px rgba(168,216,238,0.08)" : "0 1px 6px rgba(224,48,80,0.06)",
        }}>MAHJI</h1>
        <DecoLine t={t} />
        {isNewUser && (
          <p style={{
            fontSize: 11, fontStyle: "italic", marginTop: 2,
            fontFamily: FONT_SANS,
            background: `linear-gradient(90deg, #C0B2D4, ${C.cerulean}, #6DBFA8, ${C.cherry}, #C0B2D4)`,
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 3s ease-in-out infinite",
          }}>
            Master the Tiles
          </p>
        )}
      </div>

      <Cnt>
        <div style={{ position: "relative", zIndex: 1 }}>
          {!isNewUser && (
            <div className="stats-row home-entrance-item">
              <StatCard num="7d" label="Streak" t={t} />
              <StatCard num="12" label="Games" t={t} />
              <StatCard num="3" label="Wins" t={t} />
            </div>
          )}

          <div className="home-entrance-item">
            <PlayNowBanner t={t} isDark={isDark} onClick={() => onNav("play")} />
          </div>

          <div className="home-grid">
            <div className="home-entrance-item">
              <FeatureCard title="Learn" desc="Tiles, rules & strategy" icon={<BookIcon />} t={t} onClick={() => onNav("learn")} />
            </div>
            <div className="home-entrance-item">
              <FeatureCard title="Practice" desc="Drills & exercises" icon={<ClockIcon />} t={t} onClick={() => onNav("practice")} />
            </div>
            <div className="home-entrance-item">
              <FeatureCard title="Shop" desc="Tiles, sets & accessories" icon={<BagIcon />} t={t} onClick={() => onNav("shop")} />
            </div>
            <div className="home-entrance-item">
              <FeatureCard title="Ask Bam Bird" desc="Your AI Mahj mentor" isBird t={t} onClick={() => onNav("bam")} />
            </div>
          </div>

          <div className="app-footer home-entrance-item">
            <FooterDeco t={t} />
            <p className="app-footer-copyright">© Mahji LLC</p>
          </div>
        </div>
      </Cnt>
    </>
  );
}

export default HomePage;
