import { useState } from 'react';
import { C, getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { BirdIcon, I, Logo, TileIconBold, FooterDeco, SunIcon, MoonIcon } from './ui/Icons';

/* ═══ SUN/MOON THEME TOGGLE ═══ */
export const ModeToggle = () => {
  const { isDark, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" style={{
      background: isDark ? "rgba(168,216,238,0.08)" : "rgba(126,100,164,0.06)",
      border: `1px solid ${isDark ? "rgba(168,216,238,0.12)" : "rgba(126,100,164,0.1)"}`,
      borderRadius: 20, cursor: "pointer", padding: "4px 6px",
      display: "flex", alignItems: "center", gap: 4, height: 28, transition: "all 0.35s",
    }}>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%",
        background: !isDark ? "rgba(126,100,164,0.12)" : "transparent",
        color: !isDark ? "#7E64A4" : "rgba(255,255,255,0.25)", transition: "all 0.35s" }}><SunIcon size={13} color="currentColor" /></span>
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%",
        background: isDark ? "rgba(168,216,238,0.15)" : "transparent",
        color: isDark ? "#A8D8EE" : "rgba(126,100,164,0.3)", transition: "all 0.35s" }}><MoonIcon size={13} color="currentColor" /></span>
    </button>
  );
};

const BagIcon = ({ color = C.lavDeep, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ProfileCircle = ({ size = 28, onClick }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius: "50%", background: t.profileBg, border: `1.5px solid ${t.profileBorder}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ width: size * 0.4, height: size * 0.4, stroke: t.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.user}</div>
    </div>
  );
};

/* ═══ DESKTOP TOP NAV ═══ */
export const DesktopHeader = ({ page, onNav, onHome, onProfile, cartCount = 0, onCart }) => {
  const [hovered, setHovered] = useState(null);
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const isHome = page === "home" || page === "profile";
  const items = [
    { id: "learn", label: "Learn" }, { id: "practice", label: "Practice" },
    { id: "play", label: "Play" }, { id: "shop", label: "Shop" }, { id: "bam", label: "Ask" },
  ];
  const mahjiColor = isDark ? "#FFFFFF" : C.cherry;

  return (
    <>
      <div className="desktop-header">
        <div onClick={onHome} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <TileIconBold t={t} />
          {!isHome && <span style={{ fontFamily: FONT_SERIF, fontSize: 12, fontWeight: 500, color: mahjiColor, letterSpacing: 3, opacity: 0.8 }}>MAHJI</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          {items.map(it => {
            const isActive = page === it.id;
            const isHov = hovered === it.id;
            let color = isDark ? t.navDimColor : C.navPurple;
            if (isActive || isHov) color = isDark ? t.navHoverColor : C.violet;
            return (
              <div key={it.id} className={`desktop-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNav(it.id)} onMouseEnter={() => setHovered(it.id)} onMouseLeave={() => setHovered(null)}
                style={{ color, fontWeight: isActive ? 600 : isHov ? 500 : 400 }}>
                {it.label}
                {isActive && <div className="desktop-nav-underline" style={{ background: isDark ? t.navHoverColor : C.violet }} />}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ModeToggle />
          <div onClick={onCart} style={{ cursor: "pointer", position: "relative" }}>
            <BagIcon color={t.lavDeep} size={17} />
            {cartCount > 0 && <div style={{ position: "absolute", top: -4, right: -6, width: 14, height: 14, borderRadius: "50%", background: C.cherry, color: "#fff", fontSize: 8, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</div>}
          </div>
          <ProfileCircle size={30} onClick={onProfile} />
        </div>
      </div>
      <div className="desktop-header-divider" />
    </>
  );
};

/* ═══ MOBILE HEADER ═══ */
export const MobileHeader = ({ onHome, onProfile, isHome, cartCount = 0, onCart, page }) => {
  const { isDark } = useTheme();
  return (
    <div className="mobile-header">
      <Logo onClick={onHome} showText={!isHome} isDark={isDark && !isHome} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <ModeToggle />
        {page === "shop" && (
          <div onClick={onCart} style={{ position: "relative", cursor: "pointer" }}>
            <div style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BagIcon color={isDark ? "#9B88BB" : C.lavDeep} size={18} />
            </div>
            {cartCount > 0 && <div style={{ position: "absolute", top: -2, right: -4, width: 16, height: 16, borderRadius: "50%", background: C.cherry, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</div>}
          </div>
        )}
        <ProfileCircle size={34} onClick={onProfile} />
      </div>
    </div>
  );
};

/* ═══ NAV ITEM ═══ */
const NavItemAnimated = ({ id, icon, label, isBird, active, onNav }) => {
  const [h, setH] = useState(false);
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const isActive = active === id;
  const color = isActive ? t.mobileNavActiveColor : h ? t.mobileNavActiveColor : t.mobileNavColor;
  return (
    <div className="mobile-nav-item" onClick={() => onNav(id)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", transform: h ? "translateY(-2px)" : "translateY(0)", background: h ? t.mobileNavHoverBg : "transparent" }}>
      <div style={{ width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s" }}>
        {isBird ? <BirdIcon size={20} color={color} sw={isActive ? 2.2 : 1.6} /> :
          <div style={{ width: 18, height: 18, stroke: color, strokeWidth: isActive ? 1.6 : 1.2, fill: "none", display: "flex", transition: "all 0.25s" }}>{icon}</div>}
      </div>
      <span className="mobile-nav-label" style={{ color, fontWeight: isActive || h ? 600 : 400, transition: "all 0.25s" }}>{label}</span>
    </div>
  );
};

/* ═══ MOBILE BOTTOM NAV (A9) ═══ */
export const MobileNav = ({ active, onNav }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div className="mobile-nav" style={{ background: t.mobileNavBg, borderTop: `1px solid ${isDark ? 'rgba(192,178,212,0.06)' : 'rgba(255,255,255,0.15)'}` }}>
      {[
        { id: "home", icon: I.home, label: "home" },
        { id: "learn", icon: I.book, label: "learn" },
        { id: "play", label: "play", isPlay: true },
        { id: "practice", icon: I.clock, label: "practice" },
        { id: "shop", icon: I.bag, label: "shop" },
      ].map(it => it.isPlay ? (
        <div key="play" className="mobile-play-wrap" onClick={() => onNav("play")}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg,${C.cherry},${C.cherryLt})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 14px rgba(178,34,52,0.2)`, border: `3px solid ${isDark ? 'rgba(26,16,40,0.8)' : 'rgba(255,255,255,0.8)'}`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: t.lacquerReflection, borderRadius: "50% 50% 0 0", pointerEvents: "none" }} />
            <div style={{ width: 14, height: 14, stroke: "white", strokeWidth: 2, fill: "none", marginLeft: 2, display: "flex", position: "relative" }}>{I.play}</div>
          </div>
          <span className="mobile-nav-label" style={{ color: t.mobileNavActiveColor, fontWeight: 600, marginTop: 4 }}>play</span>
        </div>
      ) : (
        <NavItemAnimated key={it.id} {...it} active={active} onNav={onNav} />
      ))}
    </div>
  );
};

/* ═══ SHARED COMPONENTS ═══ */
export const PT = ({ children }) => (<div className="page-title-wrap"><h1 className="page-title">{children}</h1></div>);
export const SH = ({ children, style = {} }) => (<div className="section-header" style={style}>{children}</div>);

export const Tag = ({ type, children }) => {
  const m = { b: { bg: "rgba(142,199,226,0.12)", c: "#4A96B8" }, n: { bg: "rgba(168,152,190,0.12)", c: C.lavDeep }, i: { bg: "rgba(176,141,58,0.1)", c: C.gold }, a: { bg: "rgba(178,34,52,0.06)", c: C.cherry } };
  const s = m[type] || m.b;
  return <span style={{ display: "inline-block", fontFamily: FONT_SANS, fontSize: 8, fontWeight: 600, letterSpacing: 1.2, textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, marginRight: 4, marginTop: 5, background: s.bg, color: s.c }}>{children}</span>;
};

export const Card = ({ title, desc, tags = [], num, onClick }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div onClick={onClick} style={{ background: t.btnBg, border: `0.5px solid ${t.btnBorder}`, borderRadius: 16, padding: "16px 18px 16px 20px", marginBottom: 10, cursor: onClick ? "pointer" : "default", position: "relative", overflow: "hidden", transition: "all 0.35s", boxShadow: t.cardShadow || t.cardInnerBorder, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = isDark ? "0 6px 20px rgba(142,199,226,0.1), inset 0 0.5px 0 rgba(255,255,255,0.04)" : "0 6px 24px rgba(126,100,164,0.08), inset 0 1px 0 rgba(255,255,255,0.8)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = t.cardShadow || t.cardInnerBorder; }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss || t.cardSheen, pointerEvents: "none", borderRadius: 16 }} />
      <div style={{ position: "absolute", left: 0, top: 12, bottom: 12, width: 1, background: C.cherry, borderRadius: "0 1px 1px 0" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        {num != null && <div style={{ width: 24, height: 24, borderRadius: "50%", background: C.cherry, color: C.white, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 6px rgba(224,48,80,0.2), inset 0 1px 0 rgba(255,255,255,0.15)" }}>{num}</div>}
        <div style={{ flex: 1 }}>
          <div className="card-title" style={{ color: t.textMain }}>{title}</div>
          {desc && <div className="card-desc" style={{ color: t.textDim, marginTop: 3 }}>{desc}</div>}
          {tags.length > 0 && <div>{tags.map(tg => <Tag key={tg.l} type={tg.t}>{tg.l}</Tag>)}</div>}
        </div>
        <div style={{ width: 16, height: 16, stroke: t.textDim, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.chevR}</div>
      </div>
    </div>
  );
};

export const Tabs = ({ items, active, onSelect }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
      {items.map(it => <div key={it} onClick={() => onSelect(it)} style={{ padding: "6px 14px", borderRadius: 20, fontFamily: FONT_SANS, fontSize: 11, fontWeight: active === it ? 600 : 400, background: active === it ? C.cherry : t.btnBg, color: active === it ? C.white : t.textMid, border: active === it ? "none" : `1px solid ${t.btnBorder}`, cursor: "pointer", transition: "all 0.3s" }}>{it}</div>)}
    </div>
  );
};

export const Cnt = ({ children }) => (<div className="content-scroll">{children}</div>);

export const CardSel = ({ items, active, onSelect }) => {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
      {items.map(it => <div key={it.id} onClick={() => onSelect(it.id)} style={{ flex: 1, textAlign: "center", padding: "12px 6px", background: t.btnBg, border: `${active === it.id ? "1.5px" : "0.5px"} solid ${active === it.id ? t.seafoam : t.btnBorder}`, borderRadius: 14, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: t.cardShadow || "none", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: t.cardGloss || t.cardSheen, pointerEvents: "none" }} />
        <h4 style={{ fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 500, color: active === it.id ? (isDark ? "#85D4BC" : "#4A9E88") : t.textMain, marginBottom: 1, position: "relative" }}>{it.name}</h4>
        <p style={{ fontFamily: FONT_SANS, fontSize: 9, color: t.textDim, margin: 0, position: "relative" }}>{it.sub}</p>
      </div>)}
    </div>
  );
};

export const BamFloat = ({ onClick }) => (
  <div className="bam-float" onClick={onClick}>
    <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.seafoam, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(109,191,168,0.25)", border: "2.5px solid rgba(255,255,255,0.7)" }}>
      <BirdIcon size={20} color={C.white} sw={1.8} />
    </div>
  </div>
);

export const Footer = () => (
  <div className="app-footer"><FooterDeco /><p className="app-footer-copyright">© Mahji LLC</p></div>
);

export const NavBar = MobileNav;
export const Header = MobileHeader;
