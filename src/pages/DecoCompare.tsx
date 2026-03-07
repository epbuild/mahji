/**
 * Temporary comparison page: DecoLine (current swirly) vs DecoLineSimple (clean line + diamond)
 * Access at #/deco-compare
 */
import { C, getThemeColors } from '../constants/colors';
import { useTheme } from '../constants/ThemeContext';
import { DecoLine, DecoLineSimple } from '../components/ui/Icons';

const FONT_SERIF = "'Bodoni Moda', serif";
const FONT_SANS = "'Outfit', sans-serif";

export default function DecoCompare() {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  const lightT = getThemeColors(false);
  const darkT = getThemeColors(true);

  const heroStyle = (bg: string): React.CSSProperties => ({
    background: bg,
    borderRadius: 16,
    padding: "28px 16px 20px",
    textAlign: "center",
    marginBottom: 12,
  });

  const titleStyle = (color: string): React.CSSProperties => ({
    fontFamily: FONT_SERIF,
    fontSize: 32,
    fontWeight: 700,
    color,
    letterSpacing: 8,
    margin: "0 0 4px",
  });

  const subStyle = (color: string, opacity: number): React.CSSProperties => ({
    fontFamily: FONT_SERIF,
    fontSize: 10,
    fontWeight: 400,
    letterSpacing: 5,
    color,
    textTransform: "uppercase" as const,
    marginBottom: 4,
    opacity,
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: FONT_SANS,
    fontSize: 11,
    fontWeight: 600,
    color: t.textMid,
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  };

  return (
    <div style={{ padding: "20px 16px 80px", maxWidth: 420, margin: "0 auto" }}>
      <div style={{ fontFamily: FONT_SERIF, fontSize: 18, fontWeight: 600, color: C.cherry, letterSpacing: 2, textAlign: "center", marginBottom: 4 }}>
        DECORATION COMPARISON
      </div>
      <div style={{ fontSize: 11, color: t.textMid, textAlign: "center", fontFamily: FONT_SANS, marginBottom: 20 }}>
        Option A = Current swirly · Option B = Clean line + diamond
      </div>

      {/* LIGHT MODE */}
      <div style={{ ...labelStyle, color: C.cherry }}>Light Mode</div>

      <div style={{ ...labelStyle }}>Option A — Current Swirly</div>
      <div style={heroStyle(lightT.appBg)}>
        <div style={subStyle(lightT.heroSubColor, 0.6)}>Let's Play</div>
        <div style={titleStyle(lightT.heroTitleColor)}>MAHJI</div>
        <DecoLine t={lightT} />
      </div>

      <div style={{ ...labelStyle }}>Option B — Clean Line + Diamond</div>
      <div style={heroStyle(lightT.appBg)}>
        <div style={subStyle(lightT.heroSubColor, 0.6)}>Let's Play</div>
        <div style={titleStyle(lightT.heroTitleColor)}>MAHJI</div>
        <DecoLineSimple t={lightT} />
      </div>

      {/* DARK MODE */}
      <div style={{ ...labelStyle, color: C.cherry, marginTop: 20 }}>Dark Mode</div>

      <div style={{ ...labelStyle }}>Option A — Current Swirly</div>
      <div style={heroStyle(darkT.appBg)}>
        <div style={subStyle(darkT.heroSubColor, 0.5)}>Let's Play</div>
        <div style={titleStyle(darkT.heroTitleColor)}>MAHJI</div>
        <DecoLine t={darkT} />
      </div>

      <div style={{ ...labelStyle }}>Option B — Clean Line + Diamond</div>
      <div style={heroStyle(darkT.appBg)}>
        <div style={subStyle(darkT.heroSubColor, 0.5)}>Let's Play</div>
        <div style={titleStyle(darkT.heroTitleColor)}>MAHJI</div>
        <DecoLineSimple t={darkT} />
      </div>
    </div>
  );
}
