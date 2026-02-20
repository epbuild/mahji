import { C } from '../../constants/colors';

export const BirdIcon = ({ size = 18, color = "currentColor", sw = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 25 C8 22, 7 17, 9 13 C10 10.5, 12 8.5, 15 7.5 C17 6.8, 19 6.5, 21 7 C23 7.5, 24.5 9, 25 11 C25.5 13, 25 16, 23 19 C21 22, 17 25, 14 26 C12 26.5, 11 26, 11 25Z"/>
    <path d="M23.5 8.5 L27 7 L24 10"/>
    <circle cx="21" cy="9.5" r="0.9" fill={color} stroke="none"/>
    <path d="M12 15 C14 13, 18 13, 21 15.5"/>
    <path d="M14 25.5 L14 29 M14 29 L12.5 30 M14 29 L15.5 30"/>
    <path d="M18 24.5 L18 28 M18 28 L16.5 29 M18 28 L19.5 29"/>
  </svg>
);

export const I = {
  book: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  clock: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  play: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 20 12 6 21 6 3"/></svg>,
  bag: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  user: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  send: <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  chevR: <svg viewBox="0 0 24 24" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevL: <svg viewBox="0 0 24 24" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  settings: <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  creditCard: <svg viewBox="0 0 24 24" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  trash: <svg viewBox="0 0 24 24" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  logOut: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  target: <svg viewBox="0 0 24 24" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  bell: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  volume: <svg viewBox="0 0 24 24" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  edit: <svg viewBox="0 0 24 24" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

export const DecoLine = ({ t = null }) => {
  // t = theme colors object. If null, use legacy C (light mode)
  const swirl1 = t ? t.decoSwirl1 : C.lavender;
  const swirl2 = t ? t.decoSwirl2 : C.lavender;
  const diamond = t ? t.decoDiamond : C.lavMid;
  const swirl3 = t ? t.decoSwirl3 : "";
  const cherryC = C.cherry;
  const isDark = t && t.decoSwirl3;
  const sO = isDark ? 0.45 : 0.55;
  const s2O = isDark ? 0.27 : 0.3;
  const dO = isDark ? 0.5 : 0.55;
  const cO = isDark ? 0.7 : 0.8;

  return (
    <svg width="210" height="26" viewBox="0 0 210 26" fill="none" style={{ display: "block", margin: "0 auto 8px" }}>
      <path d="M8 13 C22 13, 28 6, 48 6 C62 6, 66 13, 73 13" stroke={swirl1} strokeWidth="0.8" strokeLinecap="round" opacity={sO}/>
      <path d="M8 13 C22 13, 28 20, 48 20 C62 20, 66 13, 73 13" stroke={swirl2} strokeWidth="0.5" strokeLinecap="round" opacity={s2O}/>
      {swirl3 && <path d="M18 13 C30 13, 36 9, 50 9 C60 9, 66 13, 73 13" stroke={swirl3} strokeWidth="0.4" strokeLinecap="round" opacity="0.25"/>}
      <rect x="76" y="9.5" width="5" height="5" rx="0.8" transform="rotate(45 78.5 12)" stroke={diamond} strokeWidth="0.7" fill="none" opacity={dO}/>
      <line x1="86" y1="12" x2="114" y2="12" stroke={cherryC} strokeWidth="1.5" strokeLinecap="round" opacity={cO}/>
      <circle cx="100" cy="12" r="2" fill={cherryC} opacity={cO}/>
      <rect x="119" y="9.5" width="5" height="5" rx="0.8" transform="rotate(45 121.5 12)" stroke={diamond} strokeWidth="0.7" fill="none" opacity={dO}/>
      <path d="M127 13 C134 13, 138 6, 152 6 C172 6, 180 13, 192 13" stroke={swirl1} strokeWidth="0.8" strokeLinecap="round" opacity={sO}/>
      <path d="M127 13 C134 13, 138 20, 152 20 C172 20, 180 13, 192 13" stroke={swirl2} strokeWidth="0.5" strokeLinecap="round" opacity={s2O}/>
      {swirl3 && <path d="M127 13 C140 13, 144 9, 158 9 C168 9, 178 13, 190 13" stroke={swirl3} strokeWidth="0.4" strokeLinecap="round" opacity="0.25"/>}
      <circle cx="6" cy="13" r="1.2" fill={swirl2} opacity={sO * 0.5}/>
      <circle cx="194" cy="13" r="1.2" fill={swirl2} opacity={sO * 0.5}/>
    </svg>
  );
};

export const TileIconBold = ({ t = null }) => {
  const s1 = t ? t.tileStroke1 : C.lavDeep;
  const s2 = t ? t.tileStroke2 : C.cherry;
  const s3 = t ? t.tileStroke3 : C.cerulean;
  return (
    <svg width="24" height="32" viewBox="0 0 26 34" fill="none">
      <rect x="1" y="1" width="24" height="32" rx="4.5" stroke={s1} strokeWidth="1.6"/>
      <rect x="5.5" y="6" width="15" height="22" rx="2.5" stroke={s2} strokeWidth="1.1" opacity="0.65"/>
      <circle cx="13" cy="17" r="2.4" stroke={s3} strokeWidth="1.1" fill="none" opacity="0.7"/>
    </svg>
  );
};

export const FooterDeco = ({ t = null }) => {
  const color = C.cherry;
  const op = t ? t.footerDecoOp : 0.4;
  return (
    <svg width="40" height="6" viewBox="0 0 40 6" fill="none" style={{ display: "block", margin: "0 auto 8px" }}>
      <line x1="2" y1="3" x2="38" y2="3" stroke={color} strokeWidth="1" strokeLinecap="round" opacity={op}/>
      <circle cx="20" cy="3" r="1.5" fill={color} opacity={op}/>
    </svg>
  );
};

export const Logo = ({ onClick, showText = true }) => (
  <a onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 6, textDecoration: "none", cursor: "pointer" }}>
    <svg width="20" height="27" viewBox="0 0 26 34" fill="none"><rect x="1" y="1" width="24" height="32" rx="4.5" stroke={C.lavDeep} strokeWidth="1.3"/><rect x="5.5" y="6" width="15" height="22" rx="2.5" stroke={C.cherry} strokeWidth="1" opacity=".6"/><circle cx="13" cy="17" r="2.2" stroke={C.cerulean} strokeWidth="1" fill="none"/></svg>
    {showText && <span style={{ fontFamily: "'Bodoni Moda',serif", fontSize: 12, fontWeight: 400, color: C.cherry, letterSpacing: 2.5 }}>MAHJI</span>}
  </a>
);
