// src/components/tiles/DotTile.tsx
import React from 'react';

const DOT_COLORS = ['#B8A9C9','#89B4D4','#7FBFB3','#C2413B','#D4A0B0'];
const DOT_LAYOUTS: Record<number, [number,number][]> = {
  1: [[0,0]],
  2: [[-14,0],[14,0]],
  3: [[-14,-12],[14,-12],[0,12]],
  4: [[-14,-14],[14,-14],[-14,14],[14,14]],
  5: [[-15,-14],[15,-14],[0,0],[-15,14],[15,14]],
  6: [[-15,-18],[15,-18],[-15,0],[15,0],[-15,18],[15,18]],
  7: [[-15,-18],[15,-18],[-15,0],[15,0],[-15,18],[15,18],[0,0]],
  8: [[-15,-18],[0,-18],[15,-18],[-10,-1],[10,-1],[-15,18],[0,18],[15,18]],
  9: [[-16,-19],[0,-19],[16,-19],[-16,0],[0,0],[16,0],[-16,19],[0,19],[16,19]],
};

interface DotTileProps { number: number; size?: string; }

export const DotTile: React.FC<DotTileProps> = ({ number }) => {
  const layout = DOT_LAYOUTS[number];
  const r = number === 1 ? 18 : (number <= 4 ? 11 : (number <= 6 ? 9 : 7.5));

  return (
    <>
      <div className="absolute top-1 right-1.5 text-xs font-bold" style={{ fontFamily: "'Bodoni Moda', serif", color: '#4A3660' }}>
        {number}
      </div>
      <svg viewBox="-36 -36 72 72" width="72" height="72">
        {layout.map(([x, y], i) => {
          const col = DOT_COLORS[i % 5];
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={`${col}22`} stroke={col} strokeWidth={number === 1 ? 2.5 : 1.6} />
              <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke={col} strokeWidth={0.7} opacity={0.45} />
              <circle cx={x} cy={y} r={r * 0.3} fill={col} />
            </g>
          );
        })}
      </svg>
    </>
  );
};
