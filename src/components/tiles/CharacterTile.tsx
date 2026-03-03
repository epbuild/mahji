// src/components/tiles/CharacterTile.tsx
import React from 'react';

const CHINESE_NUMERALS = ['一','二','三','四','五','六','七','八','九'];

interface CharacterTileProps { number: number; size?: string; }

export const CharacterTile: React.FC<CharacterTileProps> = ({ number }) => {
  return (
    <>
      <div
        className="absolute top-1 right-1.5 text-xs font-bold z-10"
        style={{ fontFamily: "'Bodoni Moda', serif", color: '#C2413B', background: 'rgba(255,255,255,0.9)', padding: '0 2px', borderRadius: 2, lineHeight: 1.1 }}
      >
        {number}
      </div>
      <svg viewBox="0 0 48 52" width="48" height="52">
        <text x="24" y="40" textAnchor="middle" fontFamily="'Noto Sans SC', 'SimSun', sans-serif" fontSize="36" fontWeight="500" fill="#C2413B">
          {CHINESE_NUMERALS[number - 1]}
        </text>
      </svg>
    </>
  );
};
