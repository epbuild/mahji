// ── LIGHT MODE (original) ──
const light = {
  bg: "#FDFCFB", lavHint: "#F8F7F5", lavSoft: "#F4F3F1",
  lavCard: "rgba(255,255,255,0.6)", lavBorder: "rgba(45,27,78,0.1)",
  lavender: "#C0B2D4", lavMid: "#A898BE", lavDeep: "#4A3660", lavText: "#6B5A82",
  cherry: "#E03050", cherryLt: "#E8566D", cherryDk: "#C42844",
  paleBlue: "#D9ECF5", paleBlueLt: "#EDF5FA", paleBlueMid: "#ADD4EC",
  cerulean: "#8EC7E2", seafoam: "#6DBFA8", seafoamLt: "rgba(118,195,170,0.3)",
  positano: "#E08850", purple: "#9B72CF", skyBlue: "#7EB8D8",
  violet: "#3A2555", navPurple: "#4A3660",
  dark: "#1E1333", mid: "#4A3660", light: "#8A7DA0", white: "#FFFFFF",
  gold: "#B08D3A", clinton: "#65554a",
  // Theme-specific
  appBg: "linear-gradient(165deg,#FEFDFB 0%,#FCFBF9 15%,#FAF9F7 30%,#F9F8F6 50%,#F8F7F5 70%,#F7F6F4 85%,#F6F5F3 100%)",
  bodyBg: "#FAF9F7",
  textMain: "#1E1333",
  textMid: "#4A3660",
  textDim: "#8A7DA0",
  cardBg: "#FFFFFF",
  cardBorder: "rgba(45,27,78,0.1)",
  cardTopAccent: "#E03050",
  cardIconBg: "rgba(224,48,80,0.035)",
  cardIconColor: "#E03050",
  cardShadow: "none",
  cardGloss: "none",
  statInnerBg: "#FFFFFF",
  statGradBorder: "rgba(45,27,78,0.1)",
  statGloss: "none",
  statShadow: "none",
  statNumColor: "#1E1333",
  playNowBg: "transparent",
  playNowBorder: "none",
  playNowShadow: "none",
  playNowGloss: "none",
  playNowTitle: "#E03050",
  playNowSub: "#4A3660",
  playNowSubOp: 0.6,
  playNowBadgeBg: "transparent",
  playNowBadgeBorder: "none",
  heroTitleColor: "#1E1333",
  heroSubColor: "#1E1333",
  navBg: "rgba(250,249,247,0.96)",
  navBorder: "rgba(45,27,78,0.06)",
  navDimColor: "#8A7DA0",
  navHoverColor: "#1E1333",
  navPlayBorder: "#FFFFFF",
  modeToggleBg: "rgba(45,27,78,0.05)",
  modeToggleBorder: "rgba(45,27,78,0.08)",
  modeToggleDot: "#4A3660",
  modeToggleShadow: "0 1px 3px rgba(45,27,78,0.15)",
  profileBg: "rgba(45,27,78,0.04)",
  profileBorder: "rgba(45,27,78,0.12)",
  hoverShadow: "0 4px 12px rgba(45,27,78,0.06)",
  btnBg: "#FFFFFF",
  btnBorder: "rgba(45,27,78,0.1)",
  cardSheen: "none",
  cardInnerBorder: "rgba(45,27,78,0.06)",
  lacquerReflection: "none",
  mobileNavBg: "rgba(250,249,247,0.97)",
  mobileNavColor: "rgba(45,27,78,0.35)",
  mobileNavActiveColor: "#1E1333",
  mobileNavHoverBg: "rgba(45,27,78,0.04)",
  decoSwirl1: "rgba(45,27,78,0.15)",
  decoSwirl2: "rgba(45,27,78,0.15)",
  decoDiamond: "rgba(45,27,78,0.2)",
  decoSwirl3: "",
  tileStroke1: "#4A3660",
  tileStroke2: "#E03050",
  tileStroke3: "#8A7DA0",
  footerDecoOp: 0.3,
};

// ── DARK MODE ──
const dark: typeof light = {
  ...light,
  bg: "#1A1028", lavHint: "rgba(155,136,187,0.08)", lavSoft: "rgba(192,178,212,0.06)",
  lavCard: "rgba(255,255,255,0.035)", lavBorder: "rgba(192,178,212,0.1)",
  lavender: "#D4C8E8", lavMid: "#B8A8D0", lavDeep: "#9B88BB", lavText: "rgba(255,255,255,0.28)",
  cerulean: "#A8D8EE", seafoam: "#85D4BC",
  dark: "rgba(255,255,255,0.9)", mid: "rgba(255,255,255,0.55)", light: "rgba(255,255,255,0.28)", white: "#FFFFFF",
  appBg: "linear-gradient(160deg, #1E1432 0%, #18102C 25%, #140E28 50%, #110C22 75%, #0E0A1E 100%)",
  bodyBg: "#0D0B12",
  textMain: "rgba(255,255,255,0.92)",
  textMid: "rgba(255,255,255,0.55)",
  textDim: "rgba(255,255,255,0.35)",
  cardBg: "rgba(255,255,255,0.028)",
  cardBorder: "rgba(192,178,212,0.07)",
  cardTopAccent: "rgba(142,199,226,0.15)",
  cardIconBg: "rgba(142,199,226,0.06)",
  cardIconColor: "#A8D8EE",
  cardShadow: "0 2px 12px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(192,178,212,0.06), inset 0 0.5px 0 rgba(255,255,255,0.04)",
  cardGloss: "linear-gradient(165deg, rgba(255,255,255,0.04) 0%, transparent 40%)",
  statInnerBg: "rgba(20,14,40,0.85)",
  statGradBorder: "linear-gradient(135deg, rgba(142,199,226,0.15), rgba(192,178,212,0.08), rgba(109,191,168,0.12))",
  statGloss: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, transparent 50%)",
  statShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.03)",
  statNumColor: "#A8D8EE",
  playNowBg: "rgba(255,255,255,0.02)",
  playNowBorder: "1px solid rgba(142,199,226,0.15)",
  playNowShadow: "0 2px 12px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(142,199,226,0.08), inset 0 0.5px 0 rgba(255,255,255,0.03)",
  playNowGloss: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
  playNowTitle: "#FFFFFF",
  playNowSub: "rgba(255,255,255,0.55)",
  playNowSubOp: 1,
  playNowBadgeBg: "rgba(255,255,255,0.04)",
  playNowBadgeBorder: "none",
  heroTitleColor: "#FFFFFF",
  heroSubColor: "#A8D8EE",
  navBg: "rgba(26,16,40,0.96)",
  navBorder: "rgba(192,178,212,0.1)",
  navDimColor: "rgba(255,255,255,0.28)",
  navHoverColor: "#A8D8EE",
  navPlayBorder: "#1A1028",
  modeToggleBg: "rgba(192,178,212,0.15)",
  modeToggleBorder: "rgba(192,178,212,0.2)",
  modeToggleDot: "#D4C8E8",
  modeToggleShadow: "0 1px 4px rgba(212,200,232,0.3)",
  profileBg: "rgba(155,136,187,0.08)",
  profileBorder: "rgba(192,178,212,0.15)",
  hoverShadow: "0 6px 18px rgba(142,199,226,0.08)",
  btnBg: "rgba(255,255,255,0.055)",
  btnBorder: "rgba(192,178,212,0.14)",
  cardSheen: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 50%)",
  cardInnerBorder: "rgba(192,178,212,0.08)",
  lacquerReflection: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%)",
  mobileNavBg: "rgba(22,16,42,0.96)",
  mobileNavColor: "rgba(168,216,238,0.4)",
  mobileNavActiveColor: "#A8D8EE",
  mobileNavHoverBg: "rgba(168,216,238,0.06)",
  decoSwirl1: "#85D4BC",
  decoSwirl2: "#D4C8E8",
  decoDiamond: "#A8D8EE",
  decoSwirl3: "#A8D8EE",
  tileStroke1: "#D4C8E8",
  tileStroke2: "#F06078",
  tileStroke3: "#A8D8EE",
  footerDecoOp: 0.35,
};

export const getThemeColors = (isDark: boolean) => isDark ? dark : light;

// Font constants
export const FONT_SERIF = "'Bodoni Moda', serif";
export const FONT_SANS = "'Outfit', sans-serif";

// C is still exported for backward compat — defaults to light
export const C = light;

// ── UNIFIED GAME MAT SYSTEM (single source of truth) ──
export interface GameMat {
  id: string;        // "coffee" | "seafoam" | "lavender" | "cerulean"
  shortId: string;   // "brn" | "sfm" | "prp" | "blu"
  name: string;
  bg: string;        // mat gradient
  seatBg: string;    // seat label pill background
  readyColor: string; // "Ready" text color
  rack: string;      // face-down tile placeholder color
  rackB: string;     // rack border
  text: string;      // general text on mat
  area: string;      // discard/exposure area bg
  areaB: string;     // area border
  areaT: string;     // area text
  accent: string;    // UI accents on mat
  you: string;       // "You" hand area text
  swatch: string;    // selector swatch gradient
}

export const GAME_MATS: GameMat[] = [
  { id: "coffee", shortId: "brn", name: "Coffee", bg: "linear-gradient(145deg,#4A3D32,#3E3228,#352A20)", seatBg: "rgba(109,191,168,0.6)", readyColor: "#6DBFA8", rack: "rgba(158,202,189,0.12)", rackB: "rgba(158,202,189,0.18)", text: "rgba(158,202,189,0.5)", area: "rgba(158,202,189,0.06)", areaB: "rgba(158,202,189,0.14)", areaT: "rgba(158,202,189,0.35)", accent: "rgba(158,202,189,0.18)", you: "rgba(200,190,175,0.85)", swatch: "linear-gradient(145deg,#4A3D32,#3A2E24)" },
  { id: "seafoam", shortId: "sfm", name: "Seafoam", bg: "linear-gradient(145deg,#8FBFB2,#7AAD9F,#6B9E90)", seatBg: "rgba(58,46,36,0.55)", readyColor: "#4A3D32", rack: "rgba(58,46,36,0.14)", rackB: "rgba(58,46,36,0.2)", text: "rgba(58,46,36,0.4)", area: "rgba(58,46,36,0.07)", areaB: "rgba(58,46,36,0.16)", areaT: "rgba(58,46,36,0.3)", accent: "rgba(58,46,36,0.2)", you: "rgba(255,255,255,0.7)", swatch: "linear-gradient(145deg,#B5D9CE,#9ECABD)" },
  { id: "lavender", shortId: "prp", name: "Lavender", bg: "linear-gradient(145deg,#B5A8C8,#A496B8,#9688AA)", seatBg: "rgba(58,46,36,0.55)", readyColor: "#4A3D32", rack: "rgba(58,46,36,0.14)", rackB: "rgba(58,46,36,0.2)", text: "rgba(58,46,36,0.4)", area: "rgba(58,46,36,0.07)", areaB: "rgba(58,46,36,0.16)", areaT: "rgba(58,46,36,0.3)", accent: "rgba(58,46,36,0.2)", you: "rgba(255,255,255,0.7)", swatch: "linear-gradient(145deg,#D5CCE2,#C4B8D6)" },
  { id: "cerulean", shortId: "blu", name: "Cerulean", bg: "linear-gradient(145deg,#A0C4D6,#8FB5C8,#80A6BA)", seatBg: "rgba(58,46,36,0.55)", readyColor: "#4A3D32", rack: "rgba(58,46,36,0.14)", rackB: "rgba(58,46,36,0.2)", text: "rgba(58,46,36,0.4)", area: "rgba(58,46,36,0.07)", areaB: "rgba(58,46,36,0.16)", areaT: "rgba(58,46,36,0.3)", accent: "rgba(58,46,36,0.2)", you: "rgba(255,255,255,0.7)", swatch: "linear-gradient(145deg,#CADEE9,#B8D2E0)" },
];

export const getGameMat = (id: string): GameMat =>
  GAME_MATS.find(m => m.id === id || m.shortId === id) || GAME_MATS[0];

// Backward compat wrappers (derived from GAME_MATS)
export const matsList = GAME_MATS.map(m => ({ id: m.shortId, name: m.name, g: m.swatch }));

export const matB: Record<string, { bg: string; rack: string; rackB: string; text: string; area: string; areaB: string; areaT: string; you: string }> = Object.fromEntries(
  GAME_MATS.map(m => [m.shortId, { bg: m.bg, rack: m.rack, rackB: m.rackB, text: m.text, area: m.area, areaB: m.areaB, areaT: m.areaT, you: m.you }])
);
