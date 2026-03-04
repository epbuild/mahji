import { C } from '../../constants/colors';

/*
 * Top-down SVG diagrams of a mahjong table for Setting the Table & How to Deal.
 * Brand colors: cherry (#E03050), seafoam (#6DBFA8), cerulean (#8EC7E2), lavDeep (#7E64A4)
 * Mat: dark brown (#4A3D32) — the "Coffee" mat
 * Rack: warm tan (#C4A882)
 * Tiles face-down: maroon/cherry (#A02040)
 * All diagrams are 320×320 viewBox for consistency.
 */

const MAT = '#4A3D32';
const MAT_EDGE = '#3A2E24';
const RACK = '#C4A882';
const RACK_STROKE = '#8B7355';
const TILE_BACK = '#A02040';
const TILE_STROKE = '#7A1830';
const TILE_FACE = '#F5F0E8';
const LABEL_COLOR = C.seafoam;
const ARROW_COLOR = C.cherry;
const DIM_TILE = 'rgba(160,32,64,0.3)';

/* ─── Helper: Single face-down tile (top-down, small rect) ─── */
const Tile = ({ x, y, w = 7, h = 10, color = TILE_BACK, stroke = TILE_STROKE, opacity = 1 }: {
  x: number; y: number; w?: number; h?: number; color?: string; stroke?: string; opacity?: number;
}) => (
  <rect x={x} y={y} width={w} height={h} rx={1} fill={color} stroke={stroke} strokeWidth={0.4} opacity={opacity} />
);

/* ─── Helper: Wall segment (row of tiles, 2 high) ─── */
const Wall = ({ x, y, count, vertical = false, gap = 0, dimAfter, opacity = 1 }: {
  x: number; y: number; count: number; vertical?: boolean; gap?: number; dimAfter?: number; opacity?: number;
}) => {
  const tiles: JSX.Element[] = [];
  for (let i = 0; i < count; i++) {
    const isDim = dimAfter !== undefined && i >= dimAfter;
    const tx = vertical ? x : x + i * (7 + gap);
    const ty = vertical ? y + i * (7 + gap) : y;
    const w = vertical ? 10 : 7;
    const h = vertical ? 7 : 10;
    // Bottom layer
    tiles.push(<Tile key={`b${i}`} x={tx + 0.5} y={ty + 0.5} w={w} h={h} opacity={isDim ? 0.3 : opacity} color={isDim ? DIM_TILE : TILE_BACK} />);
    // Top layer (offset slightly)
    tiles.push(<Tile key={`t${i}`} x={tx} y={ty} w={w} h={h} opacity={isDim ? 0.3 : opacity} color={isDim ? DIM_TILE : TILE_BACK} />);
  }
  return <g>{tiles}</g>;
};

/* ─── Helper: Rack (elongated rectangle) ─── */
const Rack = ({ x, y, w, h }: { x: number; y: number; w: number; h: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={2} fill={RACK} stroke={RACK_STROKE} strokeWidth={0.6} opacity={0.85} />
);

/* ─── Helper: Player label ─── */
const PLabel = ({ x, y, text, highlight = false, fontSize = 10 }: {
  x: number; y: number; text: string; highlight?: boolean; fontSize?: number;
}) => (
  <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
    fill={highlight ? C.cherry : LABEL_COLOR} fontSize={fontSize}
    fontFamily="'Outfit', sans-serif" fontWeight={highlight ? 700 : 500}
    opacity={highlight ? 1 : 0.8}>
    {text}
  </text>
);

/* ─── Helper: Curved arrow ─── */
const Arrow = ({ d, color = ARROW_COLOR }: { d: string; color?: string }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" markerEnd="url(#arrowhead)" opacity={0.8} />
);

/* ─── Arrow marker definition ─── */
const ArrowDefs = () => (
  <defs>
    <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
      <polygon points="0 0, 6 2, 0 4" fill={ARROW_COLOR} />
    </marker>
    <marker id="arrowhead-seafoam" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
      <polygon points="0 0, 6 2, 0 4" fill={C.seafoam} />
    </marker>
  </defs>
);

/* ─── Base table with mat, racks, labels ─── */
const TableBase = ({ children, south = "South", north = "North", east = "East (Dealer)", west = "West", highlightEast = false }: {
  children?: React.ReactNode;
  south?: string; north?: string; east?: string; west?: string;
  highlightEast?: boolean;
}) => (
  <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
    <ArrowDefs />
    {/* Mat */}
    <rect x={10} y={10} width={300} height={300} rx={8} fill={MAT} stroke={MAT_EDGE} strokeWidth={1.5} />
    {/* Racks — on the outer edges */}
    <Rack x={60} y={280} w={200} h={12} /> {/* South (bottom, "you") */}
    <Rack x={60} y={28} w={200} h={12} />  {/* North (top) */}
    <Rack x={16} y={60} w={12} h={200} />  {/* West (left) */}
    <Rack x={292} y={60} w={12} h={200} /> {/* East (right) */}
    {/* Player labels */}
    <PLabel x={160} y={304} text={south} fontSize={9} />
    <PLabel x={160} y={20} text={north} fontSize={9} />
    <PLabel x={310} y={160} text={east} highlight={highlightEast} fontSize={east.length > 6 ? 7.5 : 9} />
    <PLabel x={14} y={160} text={west} fontSize={9} />
    {/* Player position text rotated for side labels */}
    {children}
  </svg>
);

/* ═══════════════════════════════════════════════════════
   DIAGRAM 1: Empty table with racks (Setting the Table)
   ═══════════════════════════════════════════════════════ */
export function DiagramEmptyTable() {
  return (
    <TableBase south="South" north="North" east="East" west="West">
      {/* Center text */}
      <text x={160} y={155} textAnchor="middle" fill={LABEL_COLOR} fontSize={8} fontFamily="'Outfit', sans-serif" opacity={0.5}>
        game mat
      </text>
      <text x={160} y={168} textAnchor="middle" fill={LABEL_COLOR} fontSize={7} fontFamily="'Outfit', sans-serif" opacity={0.4}>
        (tiles go here)
      </text>
    </TableBase>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 2: Tiles shuffled face-down in center
   ═══════════════════════════════════════════════════════ */
export function DiagramShuffledTiles() {
  // Scattered tiles in the center
  const scattered: JSX.Element[] = [];
  const positions = [
    [120,130,15],[135,125,-25],[150,135,40],[128,150,-10],[145,148,55],
    [160,128,20],[172,140,-30],[140,160,45],[155,155,-15],[168,152,35],
    [130,140,60],[148,130,-45],[162,145,10],[175,132,50],[138,158,-20],
    [152,162,25],[165,158,-35],[128,168,30],[143,172,-5],[158,170,42],
    [170,165,15],[180,150,-22],[125,155,38],[148,142,-50],[160,138,8],
    [135,165,-12],[150,175,32],[175,155,-40],[142,135,22],[155,128,48],
    [168,168,5],[182,142,-28],[120,148,35],[132,175,-8],[146,165,52],
  ];
  positions.forEach(([cx, cy, rot], i) => {
    scattered.push(
      <rect key={i} x={cx - 3.5} y={cy - 5} width={7} height={10} rx={1}
        fill={TILE_BACK} stroke={TILE_STROKE} strokeWidth={0.3}
        transform={`rotate(${rot} ${cx} ${cy})`} opacity={0.85} />
    );
  });
  return (
    <TableBase>
      <g>{scattered}</g>
    </TableBase>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 3: Walls built (19×2 in front of each rack)
   ═══════════════════════════════════════════════════════ */
export function DiagramWallsBuilt() {
  // South wall (bottom) — horizontal, 19 tiles
  const sw = 6.2; // tile width for wall
  const sh = 8;
  const southX = 160 - (19 * sw) / 2;
  const southY = 255;
  // North wall (top) — horizontal, 19 tiles
  const northY = 55;
  // East wall (right) — vertical, 19 tiles
  const eastX = 265;
  const eastY = 160 - (19 * sw) / 2;
  // West wall (left) — vertical, 19 tiles
  const westX = 45;
  const westY = 160 - (19 * sw) / 2;

  const HWall = ({ x, y }: { x: number; y: number }) => {
    const tiles: JSX.Element[] = [];
    for (let i = 0; i < 19; i++) {
      // Bottom layer
      tiles.push(<rect key={`b${i}`} x={x + i * sw + 0.3} y={y + 0.3} width={sw - 0.5} height={sh} rx={0.5} fill={TILE_BACK} stroke={TILE_STROKE} strokeWidth={0.25} opacity={0.7} />);
      // Top layer
      tiles.push(<rect key={`t${i}`} x={x + i * sw} y={y - 1} width={sw - 0.5} height={sh} rx={0.5} fill={TILE_BACK} stroke={TILE_STROKE} strokeWidth={0.25} />);
    }
    return <g>{tiles}</g>;
  };

  const VWall = ({ x, y }: { x: number; y: number }) => {
    const tiles: JSX.Element[] = [];
    for (let i = 0; i < 19; i++) {
      tiles.push(<rect key={`b${i}`} x={x + 0.3} y={y + i * sw + 0.3} width={sh} height={sw - 0.5} rx={0.5} fill={TILE_BACK} stroke={TILE_STROKE} strokeWidth={0.25} opacity={0.7} />);
      tiles.push(<rect key={`t${i}`} x={x - 1} y={y + i * sw} width={sh} height={sw - 0.5} rx={0.5} fill={TILE_BACK} stroke={TILE_STROKE} strokeWidth={0.25} />);
    }
    return <g>{tiles}</g>;
  };

  return (
    <TableBase>
      <HWall x={southX} y={southY} />
      <HWall x={southX} y={northY} />
      <VWall x={eastX} y={eastY} />
      <VWall x={westX} y={westY} />
      {/* "19 tiles" annotation */}
      <text x={160} y={245} textAnchor="middle" fill={LABEL_COLOR} fontSize={6.5} fontFamily="'Outfit', sans-serif" opacity={0.6}>
        19 tiles wide × 2 high
      </text>
    </TableBase>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 4: Dice roll to determine East
   ═══════════════════════════════════════════════════════ */
export function DiagramDiceRoll() {
  return (
    <TableBase highlightEast>
      {/* Dice in center */}
      <rect x={148} y={148} width={12} height={12} rx={2} fill="#F5F0E8" stroke="#999" strokeWidth={0.5} />
      <circle cx={151} cy={151} r={1} fill="#333" />
      <circle cx={157} cy={151} r={1} fill="#333" />
      <circle cx={154} cy={154} r={1} fill="#333" />
      <circle cx={151} cy={157} r={1} fill="#333" />
      <circle cx={157} cy={157} r={1} fill="#333" />

      <rect x={163} y={148} width={12} height={12} rx={2} fill="#F5F0E8" stroke="#999" strokeWidth={0.5} />
      <circle cx={166} cy={151} r={1} fill="#333" />
      <circle cx={172} cy={157} r={1} fill="#333" />
      <circle cx={169} cy={154} r={1} fill="#333" />

      {/* "Highest roll = East" */}
      <text x={160} y={175} textAnchor="middle" fill={LABEL_COLOR} fontSize={7} fontFamily="'Outfit', sans-serif" opacity={0.7}>
        Highest roll = East!
      </text>
    </TableBase>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 5: East's wall broken — count 5, break at 6th
   ═══════════════════════════════════════════════════════ */
export function DiagramWallBreak() {
  const sw = 6.2;
  const sh = 8;
  const wallX = 265;
  const wallY = 160 - (19 * sw) / 2;

  const tiles: JSX.Element[] = [];
  for (let i = 0; i < 19; i++) {
    const kept = i >= 14; // last 5 tiles (from right = bottom of vertical) are kept
    const pushed = i >= 5 && i < 14; // pushed out toward center
    const offsetX = pushed ? -18 : 0;
    // Bottom layer
    tiles.push(<rect key={`b${i}`} x={wallX + 0.3 + offsetX} y={wallY + i * sw + 0.3}
      width={sh} height={sw - 0.5} rx={0.5} fill={TILE_BACK} stroke={TILE_STROKE}
      strokeWidth={0.25} opacity={kept ? 0.4 : 0.85} />);
    // Top layer
    tiles.push(<rect key={`t${i}`} x={wallX - 1 + offsetX} y={wallY + i * sw}
      width={sh} height={sw - 0.5} rx={0.5} fill={kept ? DIM_TILE : TILE_BACK}
      stroke={kept ? 'rgba(122,24,48,0.3)' : TILE_STROKE} strokeWidth={0.25} />);
  }

  // Count labels (1-5 on the kept tiles)
  for (let i = 0; i < 5; i++) {
    tiles.push(
      <text key={`c${i}`} x={wallX + 3} y={wallY + (14 + i) * sw + sw / 2}
        textAnchor="middle" dominantBaseline="middle"
        fill={C.cerulean} fontSize={4.5} fontFamily="'Outfit', sans-serif" fontWeight={600}>
        {i + 1}
      </text>
    );
  }

  return (
    <TableBase highlightEast east="East (Dealer)">
      {/* Other walls (simplified) */}
      {/* South wall */}
      <rect x={42} y={256} width={236} height={9} rx={1} fill={TILE_BACK} opacity={0.3} />
      {/* North wall */}
      <rect x={42} y={55} width={236} height={9} rx={1} fill={TILE_BACK} opacity={0.3} />
      {/* West wall */}
      <rect x={45} y={42} width={9} height={236} rx={1} fill={TILE_BACK} opacity={0.3} />

      {/* East wall — detailed */}
      <g>{tiles}</g>

      {/* Arrow showing break point */}
      <path d={`M ${wallX - 20} ${wallY + 13.5 * sw} L ${wallX - 8} ${wallY + 13.5 * sw}`}
        stroke={C.cherry} strokeWidth={1} strokeDasharray="2,1" opacity={0.6} />

      {/* Label */}
      <text x={wallX - 30} y={wallY + 13.5 * sw - 4} textAnchor="middle"
        fill={C.cherry} fontSize={5.5} fontFamily="'Outfit', sans-serif" fontWeight={600}>
        break
      </text>

      {/* Annotation */}
      <text x={160} y={140} textAnchor="middle" fill={LABEL_COLOR} fontSize={6.5}
        fontFamily="'Outfit', sans-serif" opacity={0.6}>
        Count 5, push remaining toward center
      </text>
    </TableBase>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 6: Dealing — show 2 stacks going to a player
   Accepts props to show deal progression
   ═══════════════════════════════════════════════════════ */
export function DiagramDealing({ step, desc }: { step: string; desc: string }) {
  // Simplified dealing diagram — shows stacks near each player
  // step indicates which deal round we're showing
  const stackPositions = {
    east: { x: 250, y: 155 },
    north: { x: 155, y: 50 },
    west: { x: 48, y: 155 },
    south: { x: 155, y: 260 },
  };

  // How many stacks each player has based on the step
  type StepCounts = { [key: string]: { e: number; n: number; w: number; s: number } };
  const stepCounts: StepCounts = {
    '6A': { e: 2, n: 0, w: 0, s: 0 },
    '6B': { e: 2, n: 2, w: 0, s: 0 },
    '6C': { e: 2, n: 2, w: 2, s: 0 },
    '6D': { e: 2, n: 2, w: 2, s: 2 },
    '6E': { e: 4, n: 2, w: 2, s: 2 },
    '6F': { e: 4, n: 4, w: 2, s: 2 },
    '6G': { e: 4, n: 4, w: 4, s: 2 },
    '7':  { e: 4, n: 4, w: 4, s: 2 },
    '8A': { e: 4, n: 4, w: 4, s: 4 },
    '8B': { e: 6, n: 4, w: 4, s: 4 },
    '8C': { e: 6, n: 6, w: 4, s: 4 },
    '8D': { e: 6, n: 6, w: 6, s: 4 },
    '8E': { e: 6, n: 6, w: 6, s: 6 },
  };

  const counts = stepCounts[step] || { e: 0, n: 0, w: 0, s: 0 };

  // Which player is currently receiving? (highlighted)
  type ActiveMap = { [key: string]: string };
  const activePlayer: ActiveMap = {
    '6A': 'e', '6B': 'n', '6C': 'w', '6D': 's',
    '6E': 'e', '6F': 'n', '6G': 'w',
    '8A': 's', '8B': 'e', '8C': 'n', '8D': 'w', '8E': 's',
  };
  const active = activePlayer[step] || '';

  const renderStacks = (px: number, py: number, count: number, isActive: boolean, horizontal: boolean) => {
    const stacks: JSX.Element[] = [];
    for (let i = 0; i < count; i++) {
      const sx = horizontal ? px + i * 9 - (count * 9) / 2 : px;
      const sy = horizontal ? py : py + i * 9 - (count * 9) / 2;
      stacks.push(
        <g key={i}>
          <rect x={sx} y={sy} width={7} height={7} rx={1}
            fill={isActive && i === count - 1 ? C.cherry : TILE_BACK}
            stroke={isActive && i === count - 1 ? '#C42844' : TILE_STROKE}
            strokeWidth={0.4} opacity={0.9} />
          <rect x={sx - 0.5} y={sy - 0.5} width={7} height={7} rx={1}
            fill={isActive && i === count - 1 ? C.cherry : TILE_BACK}
            stroke={isActive && i === count - 1 ? '#C42844' : TILE_STROKE}
            strokeWidth={0.4} />
        </g>
      );
    }
    return <g>{stacks}</g>;
  };

  return (
    <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
      <ArrowDefs />
      {/* Mat */}
      <rect x={10} y={10} width={300} height={300} rx={8} fill={MAT} stroke={MAT_EDGE} strokeWidth={1.5} />
      {/* Racks */}
      <Rack x={60} y={280} w={200} h={12} />
      <Rack x={60} y={28} w={200} h={12} />
      <Rack x={16} y={60} w={12} h={200} />
      <Rack x={292} y={60} w={12} h={200} />
      {/* Simplified walls */}
      <rect x={60} y={250} width={200} height={6} rx={1} fill={TILE_BACK} opacity={0.2} />
      <rect x={60} y={60} width={200} height={6} rx={1} fill={TILE_BACK} opacity={0.2} />
      <rect x={42} y={60} width={6} height={200} rx={1} fill={TILE_BACK} opacity={0.2} />
      {/* East wall — broken, being dealt from */}
      <rect x={268} y={60} width={6} height={90} rx={1} fill={TILE_BACK} opacity={0.4} />

      {/* Dealt stacks */}
      {renderStacks(stackPositions.east.x, stackPositions.east.y, counts.e, active === 'e', false)}
      {renderStacks(stackPositions.north.x, stackPositions.north.y, counts.n, active === 'n', true)}
      {renderStacks(stackPositions.west.x, stackPositions.west.y, counts.w, active === 'w', false)}
      {renderStacks(stackPositions.south.x, stackPositions.south.y, counts.s, active === 's', true)}

      {/* Labels */}
      <PLabel x={160} y={304} text="South" fontSize={9} />
      <PLabel x={160} y={20} text="North" fontSize={9} />
      <PLabel x={310} y={160} text="East" highlight fontSize={7.5} />
      <PLabel x={14} y={160} text="West" fontSize={9} />

      {/* Step indicator */}
      <rect x={115} y={145} width={90} height={22} rx={6} fill="rgba(0,0,0,0.3)" />
      <text x={160} y={159} textAnchor="middle" fill="#fff" fontSize={7.5}
        fontFamily="'Outfit', sans-serif" fontWeight={600}>
        Step {step}
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 7: Wall continuation (ran out, break next wall)
   ═══════════════════════════════════════════════════════ */
export function DiagramWallContinuation() {
  return (
    <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
      <ArrowDefs />
      <rect x={10} y={10} width={300} height={300} rx={8} fill={MAT} stroke={MAT_EDGE} strokeWidth={1.5} />
      <Rack x={60} y={280} w={200} h={12} />
      <Rack x={60} y={28} w={200} h={12} />
      <Rack x={16} y={60} w={12} h={200} />
      <Rack x={292} y={60} w={12} h={200} />

      {/* East wall — depleted */}
      <rect x={268} y={60} width={6} height={60} rx={1} fill={TILE_BACK} opacity={0.15} />
      <text x={280} y={100} textAnchor="middle" fill={C.cerulean} fontSize={5.5}
        fontFamily="'Outfit', sans-serif" opacity={0.6}>empty</text>

      {/* South wall — being broken now */}
      <rect x={60} y={250} width={120} height={7} rx={1} fill={TILE_BACK} opacity={0.5} />
      <rect x={185} y={250} width={75} height={7} rx={1} fill={TILE_BACK} opacity={0.2} />

      {/* Arrow from east wall area curving to south wall */}
      <path d="M 270 200 Q 260 240 195 250" fill="none" stroke={C.cherry}
        strokeWidth={1.5} strokeLinecap="round" markerEnd="url(#arrowhead)" opacity={0.7} />

      {/* Other walls simplified */}
      <rect x={60} y={60} width={200} height={6} rx={1} fill={TILE_BACK} opacity={0.2} />
      <rect x={42} y={60} width={6} height={200} rx={1} fill={TILE_BACK} opacity={0.2} />

      <PLabel x={160} y={304} text="South" fontSize={9} />
      <PLabel x={160} y={20} text="North" fontSize={9} />
      <PLabel x={310} y={160} text="East" highlight fontSize={7.5} />
      <PLabel x={14} y={160} text="West" fontSize={9} />

      <text x={160} y={145} textAnchor="middle" fill={LABEL_COLOR} fontSize={6.5}
        fontFamily="'Outfit', sans-serif" opacity={0.6}>
        Ran out? Break the wall to your left
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 8: Final tile distribution (top layer picks)
   ═══════════════════════════════════════════════════════ */
export function DiagramFinalTiles() {
  return (
    <svg viewBox="0 0 320 280" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
      <ArrowDefs />
      {/* Simplified top-layer view of curtsied wall */}
      <rect x={20} y={20} width={280} height={240} rx={8} fill={MAT} stroke={MAT_EDGE} strokeWidth={1.5} />

      {/* Title */}
      <text x={160} y={45} textAnchor="middle" fill={LABEL_COLOR} fontSize={8}
        fontFamily="'Outfit', sans-serif" fontWeight={600}>Final Tiles — Top Layer</text>

      {/* Row of top-layer tiles */}
      {[1, 2, 3, 4, 5, 6].map((n, i) => {
        const tx = 70 + i * 34;
        const isEast = n === 1 || n === 3;
        const labels: { [key: number]: string } = { 1: 'E', 2: 'S', 3: 'E', 4: 'W', 5: 'N' };
        const label = labels[n] || '';
        return (
          <g key={n}>
            <rect x={tx} y={70} width={24} height={34} rx={2}
              fill={isEast ? C.cherry : n <= 5 ? TILE_BACK : DIM_TILE}
              stroke={isEast ? '#C42844' : TILE_STROKE} strokeWidth={0.6}
              opacity={n <= 5 ? 1 : 0.3} />
            {n <= 5 && (
              <text x={tx + 12} y={92} textAnchor="middle" fill="#fff" fontSize={9}
                fontFamily="'Outfit', sans-serif" fontWeight={700}>{label}</text>
            )}
            {n <= 5 && (
              <text x={tx + 12} y={116} textAnchor="middle" fill={LABEL_COLOR} fontSize={6}
                fontFamily="'Outfit', sans-serif">
                #{n}
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(60, 140)">
        <rect x={0} y={0} width={10} height={10} rx={1} fill={C.cherry} />
        <text x={16} y={9} fill={LABEL_COLOR} fontSize={7} fontFamily="'Outfit', sans-serif">
          East (1st &amp; 3rd tiles)
        </text>
      </g>
      <g transform="translate(60, 158)">
        <rect x={0} y={0} width={10} height={10} rx={1} fill={TILE_BACK} />
        <text x={16} y={9} fill={LABEL_COLOR} fontSize={7} fontFamily="'Outfit', sans-serif">
          Others get one tile each
        </text>
      </g>

      {/* Final counts */}
      <g transform="translate(40, 190)">
        <text x={0} y={0} fill={LABEL_COLOR} fontSize={7.5} fontFamily="'Outfit', sans-serif" fontWeight={600}>
          Final tile counts:
        </text>
        <text x={0} y={16} fill={C.cherry} fontSize={7} fontFamily="'Outfit', sans-serif" fontWeight={600}>
          East (Dealer): 14 tiles
        </text>
        <text x={0} y={30} fill={LABEL_COLOR} fontSize={7} fontFamily="'Outfit', sans-serif">
          North, West, South: 13 tiles each
        </text>
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 9: Final count — stacks per player
   ═══════════════════════════════════════════════════════ */
export function DiagramFinalCount() {
  const PlayerStack = ({ x, y, label, isDealer = false }: {
    x: number; y: number; label: string; isDealer?: boolean;
  }) => {
    // 3 stacks of 4 + extra
    const sw = 14;
    const sh = 18;
    return (
      <g>
        {/* 3 main stacks of 4 */}
        {[0, 1, 2].map(s => (
          <g key={s}>
            <rect x={x + s * (sw + 3)} y={y} width={sw} height={sh} rx={1.5}
              fill={TILE_BACK} stroke={TILE_STROKE} strokeWidth={0.4} />
            <text x={x + s * (sw + 3) + sw / 2} y={y + sh / 2 + 1} textAnchor="middle"
              dominantBaseline="middle" fill="rgba(255,255,255,0.7)" fontSize={5}
              fontFamily="'Outfit', sans-serif">4</text>
          </g>
        ))}
        {/* Extra tile(s) */}
        <rect x={x + 3 * (sw + 3)} y={y + (isDealer ? 0 : 4)} width={sw} height={isDealer ? sh : sh * 0.55}
          rx={1.5} fill={isDealer ? C.cherry : TILE_BACK}
          stroke={isDealer ? '#C42844' : TILE_STROKE} strokeWidth={0.4} />
        <text x={x + 3 * (sw + 3) + sw / 2} y={y + (isDealer ? sh / 2 + 1 : 4 + sh * 0.55 / 2)}
          textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.8)"
          fontSize={5} fontFamily="'Outfit', sans-serif">{isDealer ? '2' : '1'}</text>
        {/* Label */}
        <text x={x + 30} y={y + sh + 12} textAnchor="middle"
          fill={isDealer ? C.cherry : LABEL_COLOR} fontSize={7}
          fontFamily="'Outfit', sans-serif" fontWeight={isDealer ? 700 : 500}>
          {label}
        </text>
        <text x={x + 30} y={y + sh + 22} textAnchor="middle"
          fill={LABEL_COLOR} fontSize={6} fontFamily="'Outfit', sans-serif" opacity={0.7}>
          = {isDealer ? '14' : '13'} tiles
        </text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 320 200" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
      <rect x={5} y={5} width={310} height={190} rx={8} fill={MAT} stroke={MAT_EDGE} strokeWidth={1.5} />
      <PlayerStack x={20} y={30} label="East (Dealer)" isDealer />
      <PlayerStack x={20} y={110} label="Others (×3)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   DIAGRAM 10: Players racking tiles
   ═══════════════════════════════════════════════════════ */
export function DiagramRacking() {
  return (
    <svg viewBox="0 0 320 180" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto' }}>
      <rect x={10} y={10} width={300} height={160} rx={8} fill={MAT} stroke={MAT_EDGE} strokeWidth={1.5} />

      {/* Rack */}
      <Rack x={30} y={110} w={260} h={16} />

      {/* Tiles standing on rack (face-up perspective — showing tile fronts) */}
      {Array.from({ length: 14 }, (_, i) => {
        const tx = 38 + i * 18;
        return (
          <g key={i}>
            <rect x={tx} y={60} width={15} height={44} rx={1.5}
              fill={TILE_FACE} stroke="#ccc" strokeWidth={0.4} />
            <rect x={tx + 2} y={64} width={11} height={8} rx={0.5}
              fill={i % 3 === 0 ? 'rgba(224,48,80,0.15)' : i % 3 === 1 ? 'rgba(109,191,168,0.15)' : 'rgba(142,199,226,0.15)'}
              stroke="none" />
          </g>
        );
      })}

      {/* Label */}
      <text x={160} y={40} textAnchor="middle" fill={LABEL_COLOR} fontSize={8}
        fontFamily="'Outfit', sans-serif" fontWeight={500}>
        Rack your tiles and evaluate your hand!
      </text>
    </svg>
  );
}
