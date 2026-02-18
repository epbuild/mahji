// src/components/tiles/TileBack.tsx
import React from 'react';

export const TileBack: React.FC = () => (
  <svg viewBox="0 0 50 66" width="50" height="66">
    <rect x="4" y="4" width="42" height="58" rx="6" fill="none" stroke="#B8A9C9" strokeWidth="3"/>
    <rect x="11" y="11" width="28" height="44" rx="4" fill="none" stroke="#89B4D4" strokeWidth="2.5"/>
    <rect x="17" y="17" width="16" height="32" rx="3" fill="none" stroke="#7FBFB3" strokeWidth="2"/>
    <circle cx="25" cy="33" r="5" fill="#89B4D4" opacity="0.9"/>
    <circle cx="25" cy="33" r="3" fill="#7FBFB3" opacity="0.7"/>
    <circle cx="25" cy="33" r="1.5" fill="white" opacity="0.6"/>
  </svg>
);
