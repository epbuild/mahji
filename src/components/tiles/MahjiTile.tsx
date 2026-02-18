// src/components/tiles/MahjiTile.tsx
import React from 'react';
import { TileDefinition, TILE_DEFINITIONS } from '@/data/tileData';
import { DotTile } from './DotTile';
import { BambooTile } from './BambooTile';
import { CharacterTile } from './CharacterTile';
import { WindTile } from './WindTile';
import { DragonTile } from './DragonTile';
import { FlowerTile } from './FlowerTile';
import { JokerTile } from './JokerTile';
import { TileBack } from './TileBack';

interface MahjiTileProps {
  tile?: TileDefinition;
  tileId?: string;
  faceDown?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-[56px] h-[76px]',
  md: 'w-[72px] h-[98px]',
  lg: 'w-[84px] h-[114px]',
};

export const MahjiTile: React.FC<MahjiTileProps> = ({
  tile: tileProp,
  tileId,
  faceDown = false,
  size = 'md',
  className = '',
  onClick,
}) => {
  const tile = tileProp || TILE_DEFINITIONS.find(t => t.id === tileId);

  if (faceDown || !tile) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-[10px] shadow-md flex items-center justify-center cursor-default transition-transform hover:-translate-y-0.5 ${className}`}
        style={{ background: '#C2413B', border: '1px solid #D4534D' }}
        onClick={onClick}
      >
        <TileBack />
      </div>
    );
  }

  const tileShell = (children: React.ReactNode) => (
    <div
      className={`${sizeClasses[size]} bg-white rounded-[10px] shadow-md flex flex-col items-center justify-center relative cursor-default transition-transform hover:-translate-y-0.5 overflow-hidden ${className}`}
      style={{ border: '1px solid #C2413B' }}
      onClick={onClick}
    >
      {children}
    </div>
  );

  switch (tile.suit) {
    case 'dots':
      return tileShell(<DotTile number={tile.number!} size={size} />);
    case 'bamboo':
      return tileShell(<BambooTile number={tile.number!} size={size} />);
    case 'characters':
      return tileShell(<CharacterTile number={tile.number!} size={size} />);
    case 'winds':
      return tileShell(<WindTile direction={tile.type as 'E'|'S'|'W'|'N'} size={size} />);
    case 'dragons':
      return tileShell(<DragonTile type={tile.type as 'red'|'green'|'white'} size={size} />);
    case 'flowers':
      return tileShell(<FlowerTile index={tile.number!} size={size} />);
    case 'jokers':
      return tileShell(<JokerTile index={tile.number!} size={size} />);
    default:
      return tileShell(<span className="text-xs text-gray-400">?</span>);
  }
};
