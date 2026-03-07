import { useState, useRef } from 'react';
import { C, getThemeColors, FONT_SERIF, FONT_SANS } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { I, BirdIcon, SunIcon, MoonIcon } from '../components/ui/Icons';
import { Cnt, SH, PT } from '../components/Layout';
import { isSoundOn, toggleSound } from '../audio/sounds';
import { getVoicePack, setVoicePack, playVoice, VOICE_PACKS } from '../audio/voice';
import type { VoicePack } from '../audio/voice';

/* ── US STATES ── */
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

/* ── AVATAR SYMBOL SVGs (artwork only, no TileShell) ── */
const SymRedDragon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 70 100" width={s} height={s * 1.43}>
    <path d="M35 12 C50 12 55 22 50 32 C45 42 25 42 20 52 C15 62 20 72 30 76 C35 78 38 80 35 88" fill="none" stroke="#C2413B" strokeWidth="7" strokeLinecap="round"/>
    <path d="M35 12 C50 12 55 22 50 32 C45 42 25 42 20 52 C15 62 20 72 30 76 C35 78 38 80 35 88" fill="none" stroke="#D87070" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
    <ellipse cx="35" cy="10" rx="6" ry="5" fill="#C2413B"/>
    <circle cx="33" cy="8.5" r="1.4" fill="white"/><circle cx="33" cy="8.5" r="0.7" fill="#333"/>
  </svg>
);
const SymGreenDragon = ({ s }: { s: number }) => (
  <svg viewBox="0 0 70 100" width={s} height={s * 1.43}>
    <path d="M35 12 C20 12 15 22 20 32 C25 42 45 42 50 52 C55 62 50 72 40 76 C35 78 32 80 35 88" fill="none" stroke="#2E8B57" strokeWidth="7" strokeLinecap="round"/>
    <path d="M35 12 C20 12 15 22 20 32 C25 42 45 42 50 52 C55 62 50 72 40 76 C35 78 32 80 35 88" fill="none" stroke="#5ABF7F" strokeWidth="2.5" strokeLinecap="round" opacity="0.35"/>
    <ellipse cx="35" cy="10" rx="6" ry="5" fill="#2E8B57"/>
    <circle cx="37" cy="8.5" r="1.4" fill="white"/><circle cx="37" cy="8.5" r="0.7" fill="#333"/>
  </svg>
);
const SymBamBird = ({ s }: { s: number }) => (
  <svg viewBox="0 0 68 96" width={s} height={s * 1.41}>
    <ellipse cx="34" cy="32" rx="15" ry="12" fill="#89B4D4"/>
    <ellipse cx="34" cy="35" rx="12" ry="8" fill="#A8D0E4"/>
    <path d="M22 28 Q16 20 20 14 Q24 22 30 26 Z" fill="#6D9ABB"/>
    <circle cx="46" cy="22" r="8.5" fill="#89B4D4"/>
    <circle cx="46" cy="22" r="7.5" fill="#78C4B0"/>
    <circle cx="49" cy="20" r="3" fill="white"/>
    <circle cx="49" cy="20" r="2" fill="#333"/>
    <circle cx="49.5" cy="19.5" r="0.7" fill="white"/>
    <path d="M53 22 L60 20.5 L53 24 Z" fill="#C4A96A"/>
    <path d="M43 14 Q45 7 47 14" fill="none" stroke="#C2413B" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="45" cy="8" r="1.2" fill="#C2413B"/>
    <path d="M30 44 L27 47 M30 44 L26 44" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M37 44 L40 47 M37 44 L41 44" stroke="#8B7355" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);
const SymSoap = ({ s }: { s: number }) => {
  const SC = ['#B8A9C9','#89B4D4','#7FBFB3','#D4A0B0','#C2413B'];
  return (
    <svg viewBox="0 0 70 100" width={s} height={s * 1.43}>
      {[0,1,2,3,4,5].map(i => { const x = 10 + i * 10, c = SC[i % 5]; return <g key={`t${i}`}><circle cx={x} cy="8" r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx={x} cy="8" r="1.5" fill={c} opacity="0.6"/></g>; })}
      {[0,1,2,3,4,5].map(i => { const x = 10 + i * 10, c = SC[(i + 2) % 5]; return <g key={`b${i}`}><circle cx={x} cy="92" r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx={x} cy="92" r="1.5" fill={c} opacity="0.6"/></g>; })}
      {[0,1,2,3,4,5].map(i => { const y = 18 + i * 13, c = SC[(i + 1) % 5]; return <g key={`l${i}`}><circle cx="8" cy={y} r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx="8" cy={y} r="1.5" fill={c} opacity="0.6"/></g>; })}
      {[0,1,2,3,4,5].map(i => { const y = 18 + i * 13, c = SC[(i + 3) % 5]; return <g key={`r${i}`}><circle cx="62" cy={y} r="3.2" fill={`${c}22`} stroke={c} strokeWidth="1"/><circle cx="62" cy={y} r="1.5" fill={c} opacity="0.6"/></g>; })}
    </svg>
  );
};
const SymWind = ({ s }: { s: number }) => (
  <svg viewBox="0 0 80 80" width={s} height={s}>
    <polygon points="40,2 44,30 40,24 36,30" fill="#C8B8E0"/>
    <polygon points="40,78 44,50 40,56 36,50" fill="#C8B8E0"/>
    <polygon points="2,40 30,36 24,40 30,44" fill="#C8B8E0"/>
    <polygon points="78,40 50,36 56,40 50,44" fill="#C8B8E0"/>
    <circle cx="40" cy="40" r="8" fill="#C8B8E0" opacity="0.4"/>
    <circle cx="40" cy="40" r="4" fill="#C8B8E0" opacity="0.6"/>
    <text x="40" y="48" textAnchor="middle" fontFamily="'Bodoni Moda',serif" fontSize="28" fontWeight="700" fill="#5B3A8C">N</text>
  </svg>
);
const SymDot = ({ s }: { s: number }) => {
  const DC = ['#B8A9C9','#89B4D4','#7FBFB3','#C2413B','#D4A0B0'];
  return (
    <svg viewBox="-36 -36 72 72" width={s} height={s}>
      <circle cx="0" cy="0" r="18" fill={`${DC[0]}22`} stroke={DC[0]} strokeWidth="2.5"/>
      <circle cx="0" cy="0" r="10.8" fill="none" stroke={DC[0]} strokeWidth="0.7" opacity="0.45"/>
      <circle cx="0" cy="0" r="5.4" fill={DC[0]}/>
    </svg>
  );
};
const SymFlower = ({ s }: { s: number }) => {
  const p = '#B8A9C9', sc = '#D4A0B0', cc = '#C4A96A';
  const angles = Array.from({ length: 8 }, (_, i) => Math.round(i * 45));
  return (
    <svg viewBox="0 0 70 80" width={s} height={s * 1.14}>
      {angles.map(a => <ellipse key={`o${a}`} cx="35" cy="28" rx="8" ry="14" fill={p} opacity=".8" transform={`rotate(${a} 35 40)`}/>)}
      {angles.map((_, i) => <ellipse key={`i${i}`} cx="35" cy="30" rx="6" ry="10" fill={sc} opacity=".65" transform={`rotate(${22 + i * 45} 35 40)`}/>)}
      <circle cx="35" cy="40" r="8" fill={cc}/>
      <circle cx="35" cy="40" r="4" fill="white" opacity=".25"/>
    </svg>
  );
};
const SymJoker = ({ s }: { s: number }) => (
  <svg viewBox="0 0 66 50" width={s} height={s * 0.76}>
    <path d="M8 40 Q20 32 30 26 Q38 22 42 18" fill="none" stroke="#D4A0B0" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    <polygon points="48,6 50.5,14 58,14 52,19 54,27 48,22.5 42,27 44,19 38,14 45.5,14" fill="#B8A9C9"/>
    <polygon points="48,10 49.5,14.5 54,14.5 50.5,17 51.5,21.5 48,19 44.5,21.5 45.5,17 42,14.5 46.5,14.5" fill="white" opacity="0.3"/>
    <circle cx="56" cy="8" r="0.8" fill="#B8A9C9" opacity="0.6"/>
  </svg>
);

const AVATAR_SYMBOLS = [
  { id: 'red-dragon', label: 'Red Dragon', render: (s: number) => <SymRedDragon s={s}/> },
  { id: 'green-dragon', label: 'Green Dragon', render: (s: number) => <SymGreenDragon s={s}/> },
  { id: 'bam-bird', label: 'Bam Bird', render: (s: number) => <SymBamBird s={s}/> },
  { id: 'soap', label: 'Soap', render: (s: number) => <SymSoap s={s}/> },
  { id: 'north-wind', label: 'North Wind', render: (s: number) => <SymWind s={s}/> },
  { id: 'dot', label: 'Single Dot', render: (s: number) => <SymDot s={s}/> },
  { id: 'flower', label: 'Flower', render: (s: number) => <SymFlower s={s}/> },
  { id: 'joker', label: 'Joker Star', render: (s: number) => <SymJoker s={s}/> },
];

const BG_COLORS = ['#6B3FA0', '#E03050', '#6DBFA8', '#8EC7E2', '#E08850', '#9B72CF', '#4A7FA8', '#302040'];

/* ── INLINE SVG ICONS ── */
const CameraIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const LockIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const MapPinIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const UsersIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const CopyIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const ShareIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);
const MailIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const ShieldIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const DownloadIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const EyeIcon = ({ size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ── PLAYER ID GENERATOR ── */
function generatePlayerId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'MHJ-';
  for (let i = 0; i < 5; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

/* ── MAIN COMPONENT ── */
function ProfilePage({ onBack, onHome, signedIn, onSignOut, onSignIn }) {
  const { isDark, toggle: toggleTheme } = useTheme();
  const t = getThemeColors(isDark);

  type SubPage = null | 'edit' | 'email_password' | 'two_factor' | 'invite' | 'billing' | 'data_privacy';
  const [sub, setSub] = useState<SubPage>(null);

  // Avatar state
  const [avatarType, setAvatarType] = useState<'symbol' | 'photo'>('symbol');
  const [selectedSymbol, setSelectedSymbol] = useState(0);
  const [symbolBgColor, setSymbolBgColor] = useState('#6B3FA0');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [displayName, setDisplayName] = useState('Erika Panico');
  const [screenName, setScreenName] = useState('mahji_erika');
  const [playerIdState] = useState(() => generatePlayerId());

  // Location state
  const [stateVal, setStateVal] = useState('New York');
  const [city, setCity] = useState('New York City');

  // Account state
  const [email] = useState('erika@email.com');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // App controls
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [soundOn, setSoundOn] = useState(() => isSoundOn());
  const [voicePackState, setVoicePackState] = useState<VoicePack>(() => getVoicePack());

  // Invite
  const referralCode = 'MAHJI-' + screenName.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
  const [copied, setCopied] = useState(false);
  const mahjiCashBalance = 3;
  const friendsJoined = 3;

  // Profile visibility
  const [profilePublic, setProfilePublic] = useState(true);

  // Save feedback
  const [saved, setSaved] = useState(false);
  const flashSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  // Draft state for Edit Profile (only applied on Save)
  const [draftDisplayName, setDraftDisplayName] = useState(displayName);
  const [draftScreenName, setDraftScreenName] = useState(screenName);
  const [draftAvatarType, setDraftAvatarType] = useState(avatarType);
  const [draftSelectedSymbol, setDraftSelectedSymbol] = useState(selectedSymbol);
  const [draftSymbolBgColor, setDraftSymbolBgColor] = useState(symbolBgColor);
  const [draftPhotoUrl, setDraftPhotoUrl] = useState(photoUrl);
  const [draftStateVal, setDraftStateVal] = useState(stateVal);
  const [draftCity, setDraftCity] = useState(city);

  const enterEditMode = () => {
    setDraftDisplayName(displayName);
    setDraftScreenName(screenName);
    setDraftAvatarType(avatarType);
    setDraftSelectedSymbol(selectedSymbol);
    setDraftSymbolBgColor(symbolBgColor);
    setDraftPhotoUrl(photoUrl);
    setDraftStateVal(stateVal);
    setDraftCity(city);
    setSub('edit');
  };

  const handleSaveProfile = () => {
    setDisplayName(draftDisplayName);
    setScreenName(draftScreenName);
    setAvatarType(draftAvatarType);
    setSelectedSymbol(draftSelectedSymbol);
    setSymbolBgColor(draftSymbolBgColor);
    setPhotoUrl(draftPhotoUrl);
    setStateVal(draftStateVal);
    setCity(draftCity);
    flashSaved();
  };

  // Email change flow
  const [emailChangeStep, setEmailChangeStep] = useState<null | 'confirm' | 'sent'>(null);

  /* ── SHARED COMPONENTS ── */
  const BackLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
      <div onClick={onClick} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        {label}
      </div>
    </div>
  );

  const Row = ({ icon, label, subText, danger, onClick, right }: {
    icon: React.ReactNode; label: string; subText?: string;
    danger?: boolean; onClick?: () => void; right?: React.ReactNode;
  }) => (
    <div onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px", background: t.btnBg,
      border: `1px solid ${t.btnBorder}`, borderRadius: 14,
      marginBottom: 8, cursor: onClick ? "pointer" : "default",
      transition: "all 0.3s"
    }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
    >
      <div style={{ width: 18, height: 18, stroke: danger ? "#D04050" : t.lavDeep, strokeWidth: 1.3, fill: "none", display: "flex", flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: danger ? "#D04050" : t.textMain }}>{label}</div>
        {subText && <div style={{ fontSize: 11, color: t.textDim, marginTop: 1 }}>{subText}</div>}
      </div>
      {right || (onClick && <div style={{ width: 14, height: 14, stroke: t.textDim, strokeWidth: 1.3, fill: "none", display: "flex" }}>{I.chevR}</div>)}
    </div>
  );

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <div onClick={e => { e.stopPropagation(); onToggle(); }} style={{
      width: 38, height: 22, borderRadius: 11,
      background: on ? t.seafoam : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(200,190,215,0.25)'),
      cursor: "pointer", position: "relative", transition: "all 0.3s", flexShrink: 0
    }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2, left: on ? 18 : 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)", transition: "left 0.3s" }}/>
    </div>
  );

  const InputField = ({ label, value, onChange, readOnly, italic }: {
    label: string; value: string; onChange?: (v: string) => void;
    readOnly?: boolean; italic?: boolean;
  }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: t.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600, fontFamily: FONT_SANS }}>{label}</div>
      {readOnly ? (
        <div style={{ padding: "11px 14px", background: isDark ? 'rgba(255,255,255,0.03)' : C.lavHint,
          border: `1px solid ${t.btnBorder}`, borderRadius: 12,
          fontSize: 14, color: t.textDim, fontStyle: italic ? 'italic' : 'normal', fontFamily: FONT_SANS }}>{value}</div>
      ) : (
        <input value={value} onChange={e => onChange?.(e.target.value)} style={{
          width: '100%', boxSizing: 'border-box' as const, padding: "11px 14px",
          background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: 12,
          fontSize: 14, color: t.textMain, fontFamily: FONT_SANS, outline: 'none'
        }}/>
      )}
    </div>
  );

  const PrimaryButton = ({ label, onClick }: { label: string; onClick?: () => void }) => (
    <button onClick={onClick} style={{
      display: "block", width: "100%", padding: 14, border: "none", borderRadius: 14,
      fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600, letterSpacing: 2,
      color: "#fff", cursor: "pointer",
      background: `linear-gradient(135deg, ${C.cherry}, ${C.cherryLt})`,
      boxShadow: "0 4px 14px rgba(224,48,80,0.18)", marginBottom: 12
    }}>{label}</button>
  );

  const SecondaryButton = ({ label, onClick, icon }: { label: string; onClick?: () => void; icon?: React.ReactNode }) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      width: "100%", padding: 14, border: `1px solid ${t.btnBorder}`, borderRadius: 14,
      fontFamily: FONT_SANS, fontSize: 14, fontWeight: 500,
      color: t.lavDeep, cursor: "pointer", background: t.btnBg, marginBottom: 10
    }}>{icon}{label}</button>
  );

  /* ── AVATAR RENDERING ── */
  const AvatarCircle = ({ size = 74, useDraft = false }: { size?: number; useDraft?: boolean }) => {
    const aType = useDraft ? draftAvatarType : avatarType;
    const aSym = useDraft ? draftSelectedSymbol : selectedSymbol;
    const aBg = useDraft ? draftSymbolBgColor : symbolBgColor;
    const aPhoto = useDraft ? draftPhotoUrl : photoUrl;
    const showPhoto = aType === 'photo' && aPhoto;
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: showPhoto ? 'transparent' : aBg,
        border: `2px solid ${isDark ? 'rgba(255,255,255,0.15)' : C.lavender}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative", flexShrink: 0
      }}>
        {showPhoto ? (
          <img src={aPhoto!} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        ) : (
          AVATAR_SYMBOLS[aSym]?.render(size * 0.48)
        )}
      </div>
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraftPhotoUrl(ev.target?.result as string);
      setDraftAvatarType('photo');
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── AUTH SCREEN (not signed in) ── */
  if (!signedIn) return (<>
    <BackLink label="Back" onClick={onBack}/>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px", paddingBottom: 90 }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: isDark ? 'rgba(155,136,187,0.08)' : C.lavSoft, border: `2px solid ${isDark ? 'rgba(192,178,212,0.15)' : C.lavender}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <BirdIcon size={40} color={C.cherry} sw={1.4}/>
      </div>
      <h2 style={{ fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 700, color: C.cherry, textAlign: "center", marginBottom: 8, letterSpacing: 1 }}>Your tiles are waiting</h2>
      <p style={{ fontSize: 13, color: t.textMid, textAlign: "center", lineHeight: 1.6, marginBottom: 28, fontFamily: FONT_SANS }}>Sign in to track your stats, save your streak, and play online.</p>

      {/* Apple Sign In */}
      <button onClick={onSignIn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: 14, border: isDark ? "1px solid rgba(255,255,255,0.15)" : "none", borderRadius: 14, background: isDark ? "#1A1028" : "#000", color: "#fff", cursor: "pointer", fontFamily: FONT_SANS, fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
        Continue with Apple
      </button>

      {/* Google Sign In */}
      <button onClick={onSignIn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: 14, border: `1px solid ${t.btnBorder}`, borderRadius: 14, background: t.btnBg, color: t.textMain, cursor: "pointer", fontFamily: FONT_SANS, fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: t.btnBorder }}/>
        <span style={{ fontSize: 11, color: t.textDim, fontFamily: FONT_SANS }}>or</span>
        <div style={{ flex: 1, height: 1, background: t.btnBorder }}/>
      </div>

      {/* Email Sign In */}
      <button onClick={onSignIn} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: 14, border: `1px solid ${t.btnBorder}`, borderRadius: 14, background: "transparent", color: t.textMain, cursor: "pointer", fontFamily: FONT_SANS, fontSize: 15, fontWeight: 500, marginBottom: 20 }}>
        <MailIcon size={16} color={t.lavDeep}/>
        Sign in with Email
      </button>

      <p style={{ fontSize: 13, color: t.textMid, textAlign: "center", fontFamily: FONT_SANS }}>
        Don't have an account?{' '}
        <span onClick={onSignIn} style={{ color: C.cherry, fontWeight: 600, cursor: "pointer" }}>Create Account</span>
      </p>
      <p onClick={() => {}} style={{ fontSize: 12, color: t.textDim, textAlign: "center", marginTop: 12, fontStyle: "italic", cursor: "pointer", fontFamily: FONT_SANS }}>Forgot password?</p>
    </div>
  </>);

  /* ── EDIT PROFILE ── */
  if (sub === 'edit') return (<>
    <BackLink label="Profile" onClick={() => setSub(null)}/>
    <PT>Edit Profile</PT>
    <Cnt>
      {/* Avatar preview */}
      <div style={{ textAlign: "center", marginBottom: 16, position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <AvatarCircle size={80} useDraft/>
          <div onClick={() => fileRef.current?.click()} style={{
            position: "absolute", bottom: 0, right: 0,
            width: 26, height: 26, borderRadius: "50%",
            background: C.cherry, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", border: `2px solid ${isDark ? '#1A1028' : '#fff'}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}>
            <CameraIcon size={13} color="#fff"/>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload}/>
        <div style={{ fontSize: 10, color: t.textDim, marginTop: 8, fontFamily: FONT_SANS }}>Tap camera to upload a photo</div>
      </div>

      {/* Symbol picker */}
      <SH>Choose a Symbol</SH>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 16 }}>
        {AVATAR_SYMBOLS.map((sym, i) => (
          <div key={sym.id} onClick={() => { setDraftSelectedSymbol(i); setDraftAvatarType('symbol'); }} style={{
            width: "100%", aspectRatio: "1", borderRadius: 14,
            background: draftSelectedSymbol === i && draftAvatarType === 'symbol' ? draftSymbolBgColor : t.btnBg,
            border: draftSelectedSymbol === i && draftAvatarType === 'symbol' ? `2px solid ${C.cherry}` : `1px solid ${t.btnBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s", overflow: "hidden"
          }}>
            {sym.render(28)}
          </div>
        ))}
      </div>

      {/* Color picker */}
      <SH>Background Color</SH>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {BG_COLORS.map(c => (
          <div key={c} onClick={() => setDraftSymbolBgColor(c)} style={{
            width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer",
            border: draftSymbolBgColor === c ? "2px solid #fff" : `2px solid transparent`,
            boxShadow: draftSymbolBgColor === c ? "0 0 0 2px " + C.cherry : "0 1px 3px rgba(0,0,0,0.15)",
            transition: "all 0.2s"
          }}/>
        ))}
      </div>

      {/* Profile fields */}
      <SH>Profile Info</SH>
      <InputField label="Display Name" value={draftDisplayName} onChange={setDraftDisplayName}/>
      <InputField label="Screen Name" value={'@' + draftScreenName} onChange={v => setDraftScreenName(v.replace(/^@/, ''))}/>
      <InputField label="Player ID" value={playerIdState} readOnly italic/>

      {/* Location */}
      <SH>Location</SH>
      <InputField label="Country" value="United States" readOnly/>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: t.textDim, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600, fontFamily: FONT_SANS }}>State</div>
        <select value={draftStateVal} onChange={e => setDraftStateVal(e.target.value)} style={{
          width: '100%', boxSizing: 'border-box' as const, padding: "11px 14px",
          background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: 12,
          fontSize: 14, color: t.textMain, fontFamily: FONT_SANS,
          appearance: 'none', WebkitAppearance: 'none' as any, outline: 'none',
        }}>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <InputField label="City" value={draftCity} onChange={setDraftCity}/>

      <PrimaryButton label={saved ? "Saved!" : "Save Changes"} onClick={handleSaveProfile}/>
    </Cnt>
  </>);

  /* ── EMAIL & PASSWORD ── */
  if (sub === 'email_password') return (<>
    <BackLink label="Profile" onClick={() => { setSub(null); setEmailChangeStep(null); }}/>
    <PT>Email & Password</PT>
    <Cnt>
      <SH>Email</SH>
      <InputField label="Current Email" value={email} readOnly/>

      {emailChangeStep === null && (
        <SecondaryButton label="Change Email" icon={<MailIcon size={14} color={t.lavDeep}/>} onClick={() => setEmailChangeStep('confirm')}/>
      )}
      {emailChangeStep === 'confirm' && (
        <div style={{ background: isDark ? 'rgba(142,199,226,0.06)' : 'rgba(142,199,226,0.08)', border: `1px solid ${isDark ? 'rgba(142,199,226,0.15)' : 'rgba(142,199,226,0.2)'}`, borderRadius: 14, padding: "16px", marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: t.textMain, lineHeight: 1.6, fontFamily: FONT_SANS, margin: "0 0 12px" }}>
            To change your email, we'll send a verification link to <span style={{ fontWeight: 600 }}>{email}</span> to confirm it's you.
          </p>
          <PrimaryButton label="Send Verification Link" onClick={() => setEmailChangeStep('sent')}/>
          <div onClick={() => setEmailChangeStep(null)} style={{ textAlign: "center", fontSize: 12, color: t.textDim, cursor: "pointer", fontFamily: FONT_SANS }}>Cancel</div>
        </div>
      )}
      {emailChangeStep === 'sent' && (
        <div style={{ background: isDark ? 'rgba(109,191,168,0.08)' : 'rgba(109,191,168,0.1)', border: `1px solid ${isDark ? 'rgba(109,191,168,0.15)' : 'rgba(109,191,168,0.2)'}`, borderRadius: 14, padding: "16px", marginBottom: 12, textAlign: "center" }}>
          <div style={{ fontSize: 20, marginBottom: 6 }}>
            <MailIcon size={24} color={t.seafoam}/>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textMain, fontFamily: FONT_SANS, marginBottom: 4 }}>Check your inbox</div>
          <p style={{ fontSize: 12, color: t.textMid, lineHeight: 1.5, fontFamily: FONT_SANS, margin: 0 }}>
            We sent a verification link to {email}. Click the link in the email to confirm your change.
          </p>
        </div>
      )}

      <div style={{ height: 8 }}/>
      <SH>Password</SH>
      <p style={{ fontSize: 12, color: t.textMid, lineHeight: 1.5, marginBottom: 12, fontFamily: FONT_SANS }}>A password reset link will be sent to your email address.</p>
      <SecondaryButton label="Reset Password" icon={<LockIcon size={14} color={t.lavDeep}/>}/>
    </Cnt>
  </>);

  /* ── TWO-FACTOR AUTH ── */
  if (sub === 'two_factor') return (<>
    <BackLink label="Profile" onClick={() => setSub(null)}/>
    <PT>Two-Factor Auth</PT>
    <Cnt>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <ShieldIcon size={20} color={twoFactorEnabled ? t.seafoam : t.textDim}/>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.textMain, fontFamily: FONT_SANS }}>{twoFactorEnabled ? "Enabled" : "Not Enabled"}</div>
          <div style={{ fontSize: 11, color: t.textDim, fontFamily: FONT_SANS }}>
            {twoFactorEnabled ? "Your account has extra security" : "Add an extra layer of security"}
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Toggle on={twoFactorEnabled} onToggle={() => setTwoFactorEnabled(!twoFactorEnabled)}/>
        </div>
      </div>
      <p style={{ fontSize: 12, color: t.textMid, lineHeight: 1.6, fontFamily: FONT_SANS }}>
        Two-factor authentication adds extra security to your account by requiring a code from your phone in addition to your password when signing in.
      </p>
    </Cnt>
  </>);

  /* ── INVITE FRIENDS ── */
  if (sub === 'invite') return (<>
    <BackLink label="Profile" onClick={() => setSub(null)}/>
    <PT>Invite Friends</PT>
    <Cnt>
      {/* Value proposition */}
      <div style={{ background: isDark ? 'rgba(224,48,80,0.06)' : 'rgba(224,48,80,0.04)', border: `1px solid ${isDark ? 'rgba(224,48,80,0.15)' : 'rgba(224,48,80,0.12)'}`, borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 700, color: C.cherry, marginBottom: 6, letterSpacing: 0.5 }}>$1 Mahji Cash per Referral</div>
        <p style={{ fontSize: 12, color: t.textMid, lineHeight: 1.6, fontFamily: FONT_SANS, margin: 0 }}>
          For every friend who joins Mahji with your code, you earn $1 Mahji Cash. Use it to order your NMJL card or unlock premium features.
        </p>
      </div>

      {/* Balance */}
      <div style={{ background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: 14, padding: "16px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 10, color: t.textDim, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, marginBottom: 4, fontFamily: FONT_SANS }}>Your Balance</div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 32, fontWeight: 700, color: isDark ? t.cerulean : C.cherry }}>${mahjiCashBalance}.00</div>
        <div style={{ fontSize: 11, color: t.textDim, marginTop: 2, fontFamily: FONT_SANS }}>Redeemable for NMJL cards</div>
        <div style={{ display: "inline-block", marginTop: 8, padding: "4px 12px", borderRadius: 12, background: isDark ? 'rgba(109,191,168,0.1)' : 'rgba(109,191,168,0.12)', fontSize: 11, fontWeight: 600, color: t.seafoam, fontFamily: FONT_SANS }}>{friendsJoined} friends joined</div>
      </div>

      {/* Referral code */}
      <SH>Your Referral Code</SH>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{ flex: 1, padding: "12px 14px", background: isDark ? 'rgba(255,255,255,0.03)' : C.lavHint, border: `1px solid ${t.btnBorder}`, borderRadius: 12, fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600, color: t.lavDeep, letterSpacing: 2, textAlign: "center" }}>{referralCode}</div>
        <div onClick={handleCopy} style={{ padding: "12px 16px", background: t.seafoam, color: "#fff", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: FONT_SANS, whiteSpace: "nowrap" }}>
          <CopyIcon size={12} color="#fff"/>{copied ? "Copied!" : "Copy"}
        </div>
      </div>

      {/* Share buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ flex: 1, padding: "12px", border: `1px solid ${t.btnBorder}`, borderRadius: 12, fontSize: 12, fontWeight: 500, color: t.textMid, background: t.btnBg, cursor: "pointer", fontFamily: FONT_SANS, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <div style={{ width: 14, height: 14, stroke: t.lavDeep, strokeWidth: 1.5, fill: "none", display: "flex" }}>{I.send}</div>
          Text a Friend
        </button>
        <button style={{ flex: 1, padding: "12px", border: `1px solid ${t.btnBorder}`, borderRadius: 12, fontSize: 12, fontWeight: 500, color: t.textMid, background: t.btnBg, cursor: "pointer", fontFamily: FONT_SANS, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <ShareIcon size={12} color={t.lavDeep}/>
          Share Link
        </button>
      </div>
    </Cnt>
  </>);

  /* ── BILLING & PLAN ── */
  if (sub === 'billing') return (<>
    <BackLink label="Profile" onClick={() => setSub(null)}/>
    <PT>Billing & Plan</PT>
    <Cnt>
      {/* Current plan */}
      <div style={{ background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: 14, padding: "18px 16px", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 600, color: t.textMain }}>Free Plan</div>
          <div style={{ padding: "3px 10px", borderRadius: 10, background: isDark ? 'rgba(109,191,168,0.12)' : 'rgba(109,191,168,0.15)', fontSize: 10, fontWeight: 600, color: t.seafoam, fontFamily: FONT_SANS }}>Active</div>
        </div>
        <p style={{ fontSize: 12, color: t.textMid, lineHeight: 1.5, fontFamily: FONT_SANS, margin: 0 }}>No charges. Enjoy Mahji with core features.</p>
      </div>

      <SH>Payment Method</SH>
      <div style={{ padding: "14px 16px", background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 13, color: t.textDim, fontFamily: FONT_SANS }}>None on file</div>
      </div>

      <SH>Transaction History</SH>
      <div style={{ padding: "14px 16px", background: t.btnBg, border: `1px solid ${t.btnBorder}`, borderRadius: 14, marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: t.textDim, fontFamily: FONT_SANS }}>No transactions yet</div>
      </div>
    </Cnt>
  </>);

  /* ── DATA & PRIVACY ── */
  if (sub === 'data_privacy') return (<>
    <BackLink label="Profile" onClick={() => setSub(null)}/>
    <PT>Data & Privacy</PT>
    <Cnt>
      <Row icon={<EyeIcon size={18} color="currentColor"/>} label="Profile Visibility" subText={profilePublic ? "Public" : "Private"} right={<Toggle on={profilePublic} onToggle={() => setProfilePublic(!profilePublic)}/>}/>
      <Row icon={<DownloadIcon size={18} color="currentColor"/>} label="Download My Data" subText="Export all your Mahji data" onClick={() => {}}/>
      <Row icon={I.trash} label="Delete My Data" subText="Permanently remove all data" danger onClick={() => {}}/>
    </Cnt>
  </>);

  /* ── MAIN PROFILE HUB ── */
  return (<>
    <BackLink label="Back" onClick={onBack}/>
    <PT>Profile</PT>
    <Cnt>
      {/* Avatar + Name header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ display: "inline-block", position: "relative", marginBottom: 8 }}>
          <AvatarCircle size={74}/>
          <div onClick={enterEditMode} style={{
            position: "absolute", bottom: 0, right: -2,
            width: 24, height: 24, borderRadius: "50%",
            background: C.cherry, display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", border: `2px solid ${isDark ? '#1A1028' : '#fff'}`,
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
          }}>
            <CameraIcon size={11} color="#fff"/>
          </div>
        </div>
        <div style={{ fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 500, color: t.textMain, marginBottom: 2 }}>{displayName}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: isDark ? t.cerulean : C.lavDeep, fontFamily: FONT_SANS }}>@{screenName}</div>
        <div style={{ fontSize: 10, color: t.textDim, fontStyle: "italic", fontFamily: FONT_SANS, marginTop: 2 }}>{playerIdState}</div>
        {(city || stateVal) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 5 }}>
            <MapPinIcon size={10} color={t.textDim}/>
            <span style={{ fontSize: 11, color: t.textDim, fontFamily: FONT_SANS }}>{city}{city && stateVal ? ', ' : ''}{stateVal}</span>
          </div>
        )}
        <div onClick={enterEditMode} style={{
          display: "inline-block", marginTop: 10, padding: "6px 20px", borderRadius: 20,
          border: `1px solid ${t.lavDeep}`, fontSize: 12, fontWeight: 500,
          color: t.lavDeep, cursor: "pointer", fontFamily: FONT_SANS, transition: "all 0.25s"
        }}>Edit Profile</div>
      </div>

      {/* Account & Security */}
      <SH>Account & Security</SH>
      <Row icon={<MailIcon size={18} color="currentColor"/>} label="Email & Password" subText={email} onClick={() => setSub('email_password')}/>
      <Row icon={<ShieldIcon size={18} color="currentColor"/>} label="Two-Factor Auth" subText={twoFactorEnabled ? "Enabled" : "Not enabled"} onClick={() => setSub('two_factor')}/>

      {/* Social */}
      <SH>Social</SH>
      <Row icon={<UsersIcon size={18} color="currentColor"/>} label="Invite Friends" subText={`${friendsJoined} friends joined`} onClick={() => setSub('invite')}/>

      {/* Subscription */}
      <SH>Subscription</SH>
      <Row icon={I.creditCard} label="Billing & Plan" subText="Free plan" onClick={() => setSub('billing')}/>

      {/* App Settings */}
      <SH>App Settings</SH>
      <Row icon={I.bell} label="Notifications" right={<Toggle on={notificationsOn} onToggle={() => setNotificationsOn(!notificationsOn)}/>}/>
      <Row icon={isDark ? <MoonIcon size={14} color="currentColor"/> : <SunIcon size={14} color="currentColor"/>} label="Dark Mode" right={<Toggle on={isDark} onToggle={toggleTheme}/>}/>
      <Row icon={I.volume} label="Sound Effects" right={<Toggle on={soundOn} onToggle={() => { const next = toggleSound(); setSoundOn(next); }}/>}/>

      {/* Voice Narrator selector — only visible when sound is on */}
      {soundOn && (
        <div style={{
          padding: "12px 16px", background: t.btnBg,
          border: `1px solid ${t.btnBorder}`, borderRadius: 14,
          marginBottom: 8, marginTop: -4
        }}>
          <div style={{ fontSize: 12, color: t.textDim, fontWeight: 600, fontFamily: FONT_SANS, marginBottom: 8, letterSpacing: 0.5 }}>Narrator</div>
          <div style={{ display: "flex", gap: 6 }}>
            {VOICE_PACKS.map(vp => (
              <div key={vp.id} onClick={() => {
                setVoicePack(vp.id);
                setVoicePackState(vp.id);
                playVoice('mahjong');
              }} style={{
                flex: 1, padding: "7px 0", borderRadius: 16, textAlign: "center",
                fontSize: 11, fontWeight: voicePackState === vp.id ? 600 : 400,
                cursor: "pointer", transition: "all 0.3s", fontFamily: FONT_SANS,
                background: voicePackState === vp.id ? C.cherry : "transparent",
                color: voicePackState === vp.id ? "#fff" : t.textMid,
                border: voicePackState === vp.id ? "none" : `1px solid ${t.btnBorder}`,
              }}>{vp.label}</div>
            ))}
          </div>
        </div>
      )}

      {/* Data & Privacy */}
      <SH>Data & Privacy</SH>
      <Row icon={<ShieldIcon size={18} color="currentColor"/>} label="Data & Privacy" subText="Visibility, export, delete" onClick={() => setSub('data_privacy')}/>

      {/* Sign Out */}
      <div style={{ marginTop: 12 }}>
        <button onClick={onSignOut} style={{
          display: "block", width: "100%", padding: 14, border: "none", borderRadius: 14,
          fontFamily: FONT_SERIF, fontSize: 15, fontWeight: 600, letterSpacing: 1.5,
          color: "#fff", cursor: "pointer",
          background: `linear-gradient(135deg, ${C.cherry}, ${C.cherryLt})`,
          boxShadow: "0 4px 14px rgba(224,48,80,0.18)"
        }}>Sign Out</button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", marginTop: 20, marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: t.textDim, letterSpacing: 1, fontFamily: FONT_SANS }}>MAHJI v1.0</div>
      </div>
    </Cnt>
  </>);
}

export default ProfilePage;
