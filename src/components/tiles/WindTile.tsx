// src/components/tiles/WindTile.tsx
import React from 'react';

const WIND_CONFIG = {
  E: { color: '#4A7FA8', compassCol: '#89B4D4', label: 'EAST' },
  S: { color: '#C2413B', compassCol: '#C2413B', label: 'SOUTH' },
  W: { color: '#4A8E80', compassCol: '#7FBFB3', label: 'WEST' },
  N: { color: '#5B3A8C', compassCol: '#C8B8E0', label: 'NORTH' },
};

interface WindTileProps { direction: 'E'|'S'|'W'|'N'; size?: string; }

export const WindTile: React.FC<WindTileProps> = ({ direction }) => {
  const cfg = WIND_CONFIG[direction];
  return (
    <>
      {/* Compass star background */}
      <svg viewBox="0 0 80 80" width="80" height="80" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
        <polygon points="40,2 44,30 40,24 36,30" fill={cfg.compassCol}/>
        <polygon points="40,78 44,50 40,56 36,50" fill={cfg.compassCol}/>
        <polygon points="2,40 30,36 24,40 30,44" fill={cfg.compassCol}/>
        <polygon points="78,40 50,36 56,40 50,44" fill={cfg.compassCol}/>
        <polygon points="12,12 32,30 26,28 30,32" fill={cfg.compassCol} opacity="0.7"/>
        <polygon points="68,12 48,30 54,28 50,32" fill={cfg.compassCol} opacity="0.7"/>
        <polygon points="12,68 32,50 26,52 30,48" fill={cfg.compassCol} opacity="0.7"/>
        <polygon points="68,68 48,50 54,52 50,48" fill={cfg.compassCol} opacity="0.7"/>
        <circle cx="40" cy="40" r="8" fill={cfg.compassCol} opacity="0.4"/>
        <circle cx="40" cy="40" r="4" fill={cfg.compassCol} opacity="0.6"/>
      </svg>
      {/* Letter */}
      <span className="relative z-10 leading-none" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 36, fontWeight: 700, color: cfg.color }}>
        {direction}
      </span>
      <span className="relative z-10" style={{ fontFamily: "'Bodoni Moda', serif", fontSize: 8, letterSpacing: 2, fontWeight: 600, color: cfg.color }}>
        {cfg.label}
      </span>
    </>
  );
};
