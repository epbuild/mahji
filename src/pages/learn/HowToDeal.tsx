import { C } from '../../constants/colors';
import { PT, Cnt } from '../../components/Layout';
import {
  DiagramShuffledTiles,
  DiagramWallsBuilt,
  DiagramDiceRoll,
  DiagramWallBreak,
  DiagramDealing,
  DiagramWallContinuation,
  DiagramFinalTiles,
  DiagramFinalCount,
  DiagramRacking,
} from './TableDiagram';

const FONT_SANS = "'Outfit', sans-serif";
const FONT_SERIF = "'Bodoni Moda', serif";

/* ─── Step component ─── */
const Step = ({ num, title, children, diagram }: {
  num: number; title?: string; children: React.ReactNode; diagram?: React.ReactNode;
}) => (
  <div style={{ marginBottom: 28 }}>
    {/* Step number badge + optional title */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', background: C.cherry,
        color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex',
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: '0 2px 6px rgba(224,48,80,0.2)',
      }}>
        {num}
      </div>
      {title && (
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 600,
          color: C.dark, letterSpacing: 0.3,
        }}>
          {title}
        </div>
      )}
    </div>
    {/* Body text */}
    <div style={{
      fontFamily: FONT_SANS, fontSize: 12.5, color: C.mid,
      lineHeight: 1.65, marginBottom: diagram ? 12 : 0,
    }}>
      {children}
    </div>
    {/* Diagram */}
    {diagram && (
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${C.lavBorder}`, marginTop: 8,
      }}>
        {diagram}
      </div>
    )}
  </div>
);

/* ─── Section divider ─── */
const Divider = () => (
  <div style={{
    height: 1,
    background: `linear-gradient(90deg, transparent, ${C.lavBorder}, transparent)`,
    margin: '4px 0 24px',
  }} />
);

export default function HowToDeal({ onBack, onNavigate }: { onBack: () => void; onNavigate: (lesson: string) => void }) {
  return (
    <>
      <div style={{ padding: '6px 22px 0', display: 'flex', alignItems: 'center' }}>
        <div onClick={onBack} style={{ fontSize: 12, color: C.lavDeep, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.lavDeep} strokeWidth="1.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Learn
        </div>
      </div>
      <PT>How to Deal</PT>
      <Cnt>
        <p className="body-text" style={{ color: C.mid, marginBottom: 20, lineHeight: 1.65 }}>
          Dealing in American Mahjong follows a specific ritual. It may seem like a lot at first, but after a few games it becomes second nature. Follow these steps and you'll be dealing like a pro.
        </p>

        {/* ─── SHUFFLE & BUILD ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 16,
        }}>
          Shuffle &amp; Build
        </div>

        <Step num={1} title="Shuffle the Tiles" diagram={<DiagramShuffledTiles />}>
          Shuffle all the tiles and turn them over (face down) in the middle of the table.
        </Step>

        <Step num={2} title="Build Your Walls" diagram={<DiagramWallsBuilt />}>
          Everyone builds their walls against their racks. Tiles are face down. 19 tiles across, 2 tiles high (unless you play with blanks, in which case 20 tiles across, 2 tiles high!).
        </Step>

        <Divider />

        {/* ─── DETERMINE EAST ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 16,
        }}>
          Determine East
        </div>

        <Step num={3} title="Roll for East" diagram={<DiagramDiceRoll />}>
          Everyone rolls the dice to determine who is East (the dealer!). The player with the highest roll becomes East.
        </Step>

        <Step num={4} title="East Deals and Goes First">
          East deals AND goes first. Being East is a privilege and a responsibility!
        </Step>

        <Step num={5} title="Break the Wall" diagram={<DiagramWallBreak />}>
          East rolls the dice again. Let's say she gets 5. She counts from the right of her tiles 1, 2, 3, 4, 5. At the 6th tile, she pushes the remaining wall out towards the center of the mat. The original 5 stacks that she counted are kept against her wall and are not touched during the deal.
        </Step>

        <Divider />

        {/* ─── THE DEAL ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 16,
        }}>
          The Deal
        </div>

        <p className="body-text" style={{ color: C.mid, marginBottom: 16, lineHeight: 1.65, fontSize: 12.5 }}>
          East deals from the pushed-out wall in a specific order. Each "deal" is 2 stacks (4 tiles total). The deal goes around the table three times.
        </p>

        {/* ─── Round 1 ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 600,
          color: C.lavDeep, letterSpacing: 0.3, marginBottom: 12,
        }}>
          Round 1
        </div>

        <Step num={6} diagram={<DiagramDealing step="6A" desc="East gets 2 stacks" />}>
          East begins the deal with 2 stacks (4 tiles total) to herself.
        </Step>

        <Step num={7} diagram={<DiagramDealing step="6B" desc="North gets 2 stacks" />}>
          Then 2 stacks to the right to North.
        </Step>

        <Step num={8} diagram={<DiagramDealing step="6C" desc="West gets 2 stacks" />}>
          Then 2 stacks across to West.
        </Step>

        <Step num={9} diagram={<DiagramDealing step="6D" desc="South gets 2 stacks" />}>
          Then 2 stacks to the left to South.
        </Step>

        <Divider />

        {/* ─── Round 2 ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 600,
          color: C.lavDeep, letterSpacing: 0.3, marginBottom: 12,
        }}>
          Round 2
        </div>

        <Step num={10} diagram={<DiagramDealing step="6E" desc="East gets 2 more stacks" />}>
          Then 2 stacks to herself (East).
        </Step>

        <Step num={11} diagram={<DiagramDealing step="6F" desc="North gets 2 more stacks" />}>
          Then 2 stacks to the right to North.
        </Step>

        <Step num={12} diagram={<DiagramDealing step="6G" desc="West gets 2 more stacks" />}>
          Then 2 stacks across to West.
        </Step>

        {/* ─── Wall continuation note ─── */}
        <Step num={13} title="Ran Out of Wall?" diagram={<DiagramWallContinuation />}>
          If the dealer runs out of tiles from her pushed-out wall, she pushes the wall to her LEFT and continues the deal from there. This is totally normal!
        </Step>

        <Divider />

        {/* ─── Round 3 ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 13, fontWeight: 600,
          color: C.lavDeep, letterSpacing: 0.3, marginBottom: 12,
        }}>
          Round 3
        </div>

        <Step num={14} diagram={<DiagramDealing step="8A" desc="South gets 2 more stacks" />}>
          Then 2 stacks to the left to South.
        </Step>

        <Step num={15} diagram={<DiagramDealing step="8B" desc="East gets 2 more stacks" />}>
          Then 2 stacks to herself (East).
        </Step>

        <Step num={16} diagram={<DiagramDealing step="8C" desc="North gets 2 more stacks" />}>
          Then 2 stacks to the right to North.
        </Step>

        <Step num={17} diagram={<DiagramDealing step="8D" desc="West gets 2 more stacks" />}>
          Then 2 stacks across to West.
        </Step>

        <Step num={18} diagram={<DiagramDealing step="8E" desc="South gets 2 more stacks" />}>
          Then 2 stacks to the left to South.
        </Step>

        <Divider />

        {/* ─── FINAL TILES ─── */}
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 16, fontWeight: 600,
          color: C.cherry, letterSpacing: 0.5, marginBottom: 16,
        }}>
          Final Tiles
        </div>

        <Step num={19} title="Top Layer Distribution" diagram={<DiagramFinalTiles />}>
          For the final tiles, it can be tricky! From the TOP layer of the pushed-out wall, tiles are distributed. East (the dealer) gets the 1st and 3rd top tiles. The other players each get one tile in order: South, West, North.
        </Step>

        <Step num={20} title="Check Your Count" diagram={<DiagramFinalCount />}>
          South, West, and North should each have 3 stacks of 4 (12 tiles) + 1 extra tile, for a total of 13 tiles. East (the dealer) has 3 stacks of 4 (12 tiles) + a half stack of 2 tiles, for a total of 14 tiles.
        </Step>

        <Step num={21} title="Rack and Evaluate" diagram={<DiagramRacking />}>
          The players then rack their tiles and begin evaluating their hand before kicking off the Charleston!
        </Step>

        {/* ─── Encouragement block ─── */}
        <div style={{
          background: C.lavCard, border: `1px solid ${C.lavBorder}`,
          borderRadius: 14, padding: '18px 20px', marginBottom: 24, marginTop: 8,
        }}>
          <div style={{
            fontFamily: FONT_SERIF, fontSize: 14, fontWeight: 600,
            color: C.cherry, marginBottom: 6,
          }}>
            You've got this!
          </div>
          <div style={{
            fontFamily: FONT_SANS, fontSize: 12, color: C.mid, lineHeight: 1.6,
          }}>
            It looks like a lot of steps, but dealing becomes automatic after just a few games. The key is remembering the order: East, North, West, South — three rounds of 2 stacks each, then the final top-layer tiles.
          </div>
        </div>

        {/* Next lesson button */}
        <div
          onClick={() => onNavigate("Gameplay: Turns, Calls & Exposures")}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '14px 24px', borderRadius: 14,
            background: C.cherry, color: '#fff', cursor: 'pointer',
            fontFamily: FONT_SANS, fontSize: 13, fontWeight: 600,
            marginBottom: 20,
            transition: 'all 0.25s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(224,48,80,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          Start Playing!
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </Cnt>
    </>
  );
}
