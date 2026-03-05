import { C, getThemeColors } from '../../constants/colors';
import { useTheme } from '../../constants/ThemeContext';
import { PT, Cnt } from '../../components/Layout';
import { DiagramEmptyTable, DiagramWallsBuilt } from './TableDiagram';

export default function SettingTheTable({ onBack, onNavigate }: { onBack: () => void; onNavigate: (lesson: string) => void }) {
  const { isDark } = useTheme();
  const t = getThemeColors(isDark);
  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: t.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Learn
        </div>
      </div>
      <PT>Setting the Table</PT>
      <Cnt>
        <p className="body-text" style={{ color: t.mid, marginBottom: 16, lineHeight: 1.65 }}>
          Every game of mahjong begins the same way. Before the first tile is drawn, the table has to be set.
        </p>
        <p className="body-text" style={{ color: t.mid, marginBottom: 16, lineHeight: 1.65 }}>
          You'll need four players, one on each side of the table. Most players use a game mat to protect the surface, soften the sound of the tiles, and make the whole experience feel that much more intentional. In front of each player sits a rack, which holds your tiles upright and facing you, keeping your hand completely hidden from the rest of the table.
        </p>

        {/* Empty table diagram */}
        <div style={{
          borderRadius: 12, overflow: 'hidden',
          border: `1px solid ${t.lavBorder}`, marginBottom: 8,
        }}>
          <DiagramEmptyTable />
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 10.5, color: t.light,
          textAlign: 'center', marginBottom: 20, fontStyle: 'italic',
        }}>
          Four players, four racks, one mat
        </div>

        <p className="body-text" style={{ color: t.mid, marginBottom: 16, lineHeight: 1.65 }}>
          To begin, each player builds a wall which is a neat row of tiles placed face-down in front of their rack (toward the center of the table). The wall should be 19 tiles wide and 2 tiles high. (Playing with blanks? Make it 20 wide.) Once all four walls are built, you have your complete playing field.
        </p>

        {/* Walls built diagram */}
        <div style={{
          borderRadius: 12, overflow: 'hidden',
          border: `1px solid ${t.lavBorder}`, marginBottom: 8,
        }}>
          <DiagramWallsBuilt />
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 10.5, color: t.light,
          textAlign: 'center', marginBottom: 20, fontStyle: 'italic',
        }}>
          Each wall: 19 tiles wide, 2 tiles high
        </div>

        <p className="body-text" style={{ color: t.mid, marginBottom: 24, lineHeight: 1.65 }}>
          Now you're ready to deal.
        </p>

        {/* Next lesson button */}
        <div
          onClick={() => onNavigate("How to Deal")}
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
          Deal Me In!
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </Cnt>
    </>
  );
}
