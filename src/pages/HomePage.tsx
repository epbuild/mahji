import { useState } from "react";
import { useTheme } from "../constants/ThemeContext";
import { C, getThemeColors } from "../constants/colors";
import { DecoLine, FooterDeco, BirdIcon } from "../components/ui/Icons";
import { Cnt, BamFloat } from "../components/Layout";

const FONT_SERIF = "'Bodoni Moda', serif";
const FONT_SANS = "'Outfit', sans-serif";

/* ── STAT CARD ── */
const StatCard = ({ num, label, t }) => (
  <div style={{
    flex: "1 1 0", maxWidth: 115, borderRadius: 12, padding: "1.5px",
    background: t.statGradBorder, cursor: "pointer",
    transition: "all 0.3s",
  }}>
    <div style={{
      background: t.statInnerBg, borderRadius: 10.5,
      padding: "14px 8px 12px",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "40%", background: t.statGloss, borderRadius: "10.5px 10.5px 0 0", pointerEvents: "none" }} />
      <div style={{ fontFamily: FONT_SERIF, fontSize: 22, fontWeight: 600, color: t.statNumColor, lineHeight: 1, position: "relative" }}>{num}</div>
      <div style={{ fontSize: 8, color: t.textDim, textTransform: "uppercase", letterSpacing: 2, marginTop: 5, fontWeight: 500, position: "relative", fontFamily: FONT_SANS, whiteSpace: "nowrap" }}>{label}</div>
    </div>
  </div>
);

/* ── FEATURE CARD ── */
const FeatureCard = ({ title, desc, icon, isBird, t, onClick }) => (
  <div
    onClick={onClick}
    className="home-card"
    style={{
      background: t.cardBg,
      border: `1px solid ${t.cardBorder}`,
      borderRadius: 14,
      padding: "16px 14px",
      overflow: "hidden",
      borderTop: `2.5px solid ${t.cardTopAccent}`,
      position: "relative",
      cursor: "pointer",
    }}
  >
    <div className="home-card-icon" style={{ background: t.cardIconBg, color: t.cardIconColor }}>
      {isBird ? <BirdIcon size={15} color={t.cardIconColor} sw={1.8} /> : icon}
    </div>
    <h3 className="card-title" style={{ color: t.textMain, marginBottom: 2 }}>{title}</h3>
    <p className="card-desc" style={{ color: t.textDim, margin: 0, lineHeight: 1.4 }}>{desc}</p>
  </div>
);

/* ── PLAY NOW BANNER ── */
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
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: `linear-gradient(135deg, ${C.cherry}, ${C.cherryLt})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 2px 8px rgba(224,48,80,0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
        color: "white",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg>
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
   HOME PAGE
   ═══════════════════════════════════ */
function HomePage({ onNav, signedIn }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const isNewUser = !signedIn;

  return (
    <>
      {/* Hero */}
      <div className="hero-section home-entrance-item">
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 400,
          letterSpacing: 5.5, color: t.heroSubColor,
          textTransform: "uppercase", marginBottom: 5,
          opacity: isDark ? 0.5 : 0.6,
        }}>
          Let's Play
        </div>
        <h1 className="hero-title" style={{ color: t.heroTitleColor }}>MAHJI</h1>
        <DecoLine t={t} />
        {/* New user: show tagline */}
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
        {/* Returning user: show stats */}
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
      </Cnt>
    </>
  );
}

export default HomePage;
