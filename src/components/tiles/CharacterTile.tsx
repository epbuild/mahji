// src/components/tiles/CharacterTile.tsx
import React from 'react';

const CHINESE_NUMERALS = ['一','二','三','四','五','六','七','八','九'];

interface CharacterTileProps { number: number; size?: string; }

export const CharacterTile: React.FC<CharacterTileProps> = ({ number }) => (
  <>
    <div className="absolute top-1 right-1.5 text-xs font-bold" style={{ fontFamily: "'Bodoni Moda', serif", color: '#C2413B' }}>
      {number}
    </div>
    <svg viewBox="0 0 70 80" width="70" height="80">
      <text x="35" y="58" textAnchor="middle" fontFamily="'Noto Sans SC', 'SimSun', sans-serif" fontSize="56" fontWeight="500" fill="#C2413B">
        {CHINESE_NUMERALS[number - 1]}
      </text>
    </svg>
  </>
);
