import { useState } from 'react';
import { C, getThemeColors } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { BirdIcon, I, DecoLine, FooterDeco } from '../components/ui/Icons';
import { Cnt } from '../components/Layout';

/* ═══ GLOSSY STAT CARD ═══ */
function StatCard({ num, label, t, onNav }) {
  const [h, setH] = useState(false);
  const [tapped, setTapped] = useState(false);
  const isDk = t.bg === "#1A1028";
  const handleClick = () => { setTapped(true); setTimeout(() => setTapped(false), 300); if (onNav) onNav("profile"); };

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={handleClick}
      className="home-entrance-item"
      style={{
        flex: 1, borderRadius: 14, padding: "1.5px", background: t.statGradBorder, cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        transform: tapped ? "scale(0.95)" : h ? "translateY(-2px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: h ? t.hoverShadow : "none",
      }}>
      <div style={{
        background: t.statInnerBg, borderRadius: 12.5, padding: "14px 10px", textAlign: "center",
        backdropFilter: isDk ? "blur(12px)" : "none",
        WebkitBackdropFilter: isDk ? "blur(12px)" : "none",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: t.statGloss, borderRadius: "12.5px 12.5px 0 0", pointerEvents: "none" }} />
        <div style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 24, fontWeight: 600, color: t.statNumColor, lineHeight: 1, position: "relative" }}>{num}</div>
        <div style={{ fontSize: 10, color: t.textDim, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 4, fontWeight: 500, position: "relative" }}>{label}</div>
      </div>
    </div>
  );
}

/* ═══ FEATURE CARD WITH HOVER ═══ */
function FeatureCard({ title, desc, icon, isBird, t, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="home-entrance-item"
      style={{
        background: t.cardBg, border: `1px solid ${t.cardBorder}`, borderRadius: 16,
        padding: "18px 14px", cursor: "pointer", overflow: "hidden",
        borderTop: `2.5px solid ${t.cardTopAccent}`,
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        transform: h ? "translateY(-4px) scale(1.02)" : "translateY(0) scale(1)",
        boxShadow: h ? t.hoverShadow : "none",
      }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: t.cardIconBg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
        transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: h ? "scale(1.15)" : "scale(1)",
      }}>
        {isBird
          ? <BirdIcon size={16} color={t.cardIconColor} sw={1.8} />
          : <div style={{ width: 16, height: 16, stroke: t.cardIconColor, strokeWidth: 1.3, fill: "none", display: "flex" }}>{icon}</div>}
      </div>
      <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 15, fontWeight: 600, color: t.textMain, marginBottom: 2 }}>{title}</h3>
      <p style={{ fontSize: 11, color: t.textDim, margin: 0, lineHeight: 1.4 }}>{desc}</p>
    </div>
  );
}

/* ═══ PLAY NOW WITH PULSE ═══ */
function PlayNowBanner({ t, onClick }) {
  const [pulsing, setPulsing] = useState(false);
  const handleClick = () => { setPulsing(true); setTimeout(() => setPulsing(false), 400); if (onClick) onClick(); };

  return (
    <div onClick={handleClick} className="home-entrance-item"
      style={{
        background: t.playNowBg, border: t.playNowBorder, borderRadius: 14, padding: "16px 18px",
        marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer", transition: "all 0.3s",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: pulsing ? "0 0 20px rgba(224,48,80,0.4)" : "0 2px 8px rgba(224,48,80,0.2)",
          flexShrink: 0,
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          transform: pulsing ? "scale(1.15)" : "scale(1)",
        }}>
          <div style={{ width: 12, height: 12, stroke: "white", strokeWidth: 2, fill: "none", marginLeft: 1, display: "flex" }}>{I.play}</div>
        </div>
        <div>
          <h3 style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 16, fontWeight: 700, color: t.playNowTitle, marginBottom: 0 }}>Play Now</h3>
          <p style={{ fontSize: 11, color: t.playNowSub, opacity: t.playNowSubOp, margin: 0 }}>Challenge AI or invite friends</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, background: t.playNowBadgeBg, padding: "3px 10px", borderRadius: 12, fontSize: 10, color: t.textDim, border: t.playNowBadgeBorder }}>
        <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
        <span>2,341</span>
      </div>
    </div>
  );
}

/* ═══ HOME PAGE ═══ */
function HomePage({ onNav, signedIn = true }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);

  return (
    <>
      {/* Dark mode ambient glows */}
      {isDark && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 500, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: -30, right: -20, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(142,199,226,0.05) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: 320, left: -40, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(109,191,168,0.04) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: 200, right: -20, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(192,178,212,0.04) 0%, transparent 70%)" }} />
        </div>
      )}

      {/* Hero */}
      <div className="hero-section" style={{ position: "relative", zIndex: 1 }}>
        <div className="home-entrance-item" style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 400, letterSpacing: 5, color: t.heroSubColor, textTransform: "uppercase", marginBottom: 5, opacity: isDark ? 0.55 : 1 }}>Let's Play</div>
        <h1 className="hero-title home-entrance-item" style={{ color: t.heroTitleColor }}>MAHJI</h1>
        <div className="home-entrance-item"><DecoLine t={t} /></div>
        <p className="home-entrance-item" style={{
          fontSize: 12, fontStyle: "italic", marginTop: 2,
          background: "linear-gradient(90deg, #C0B2D4, #8EC7E2, #6DBFA8, #E03050, #C0B2D4)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmer 3s ease-in-out infinite",
        }}>Master the Tiles</p>
      </div>

      <Cnt>
        {signedIn ? (
          <div className="stats-row" style={{ position: "relative", zIndex: 1 }}>
            <StatCard num="12" label="Games" t={t} onNav={onNav} />
            <StatCard num="3" label="Wins" t={t} onNav={onNav} />
            <StatCard num="7d" label="Streak" t={t} onNav={onNav} />
          </div>
        ) : (
          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ display: "inline-flex", gap: 8 }}>
              <button style={{ padding: "10px 28px", borderRadius: 12, border: "none", fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, letterSpacing: 1.5, color: "#fff", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, cursor: "pointer", boxShadow: "0 3px 10px rgba(224,48,80,0.18)" }}>Sign In</button>
              <button style={{ padding: "10px 28px", borderRadius: 12, border: `1.5px solid ${t.lavender}`, fontFamily: "'Bodoni Moda',serif", fontSize: 13, fontWeight: 600, letterSpacing: 1, color: t.lavDeep, background: t.cardBg, cursor: "pointer" }}>Create Account</button>
            </div>
          </div>
        )}

        <div className="play-now-banner" style={{ position: "relative", zIndex: 1 }}>
          <PlayNowBanner t={t} onClick={() => onNav("play")} />
        </div>

        <div className="home-grid" style={{ position: "relative", zIndex: 1 }}>
          {[
            { id: "learn", title: "Learn", desc: "Tiles, rules & strategy", icon: I.book },
            { id: "practice", title: "Practice", desc: "Drills & exercises", icon: I.clock },
            { id: "shop", title: "Shop", desc: "Tiles, sets & accessories", icon: I.bag },
            { id: "bam", title: "Ask Bam Bird", desc: "Your AI Mahj mentor", isBird: true },
          ].map(c => (
            <FeatureCard key={c.id} title={c.title} desc={c.desc} icon={c.icon} isBird={c.isBird} t={t} onClick={() => onNav(c.id)} />
          ))}
        </div>

        <div className="app-footer">
          <FooterDeco t={t} />
          <p className="app-footer-copyright" style={{ color: t.textDim }}>© Mahji LLC</p>
        </div>
      </Cnt>
    </>
  );
}

export default HomePage;
