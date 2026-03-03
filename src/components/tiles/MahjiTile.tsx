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
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const sizeClasses: Record<string, string> = {
  xs: 'w-[34px] h-[46px]',
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

  // xs renders a proportionally scaled-down sm tile — everything shrinks together
  const isXs = size === 'xs';
  const renderSize = isXs ? 'sm' : size;

  if (faceDown || !tile) {
    if (isXs) {
      return (
        <div className={`w-[34px] h-[46px] overflow-hidden ${className}`} onClick={onClick}>
          <div style={{ transform: 'scale(0.607)', transformOrigin: 'top left' }}>
            <div
              className={`${sizeClasses.sm} rounded-[10px] shadow-md flex items-center justify-center cursor-default`}
              style={{ background: '#C2413B', border: '1px solid #D4534D' }}
            >
              <TileBack />
            </div>
          </div>
        </div>
      );
    }
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

  const tileShell = (children: React.ReactNode) => {
    const inner = (
      <div
        className={`${sizeClasses[renderSize]} bg-white rounded-[10px] shadow-md flex flex-col items-center justify-center relative cursor-default overflow-hidden`}
        style={{ border: '1px solid #C2413B' }}
      >
        {children}
      </div>
    );

    if (isXs) {
      // Wrap sm tile in a 34×46 container, scale everything proportionally
      return (
        <div className={`w-[34px] h-[46px] overflow-hidden ${className}`} onClick={onClick}>
          <div style={{ transform: 'scale(0.607)', transformOrigin: 'top left' }}>
            {inner}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`${sizeClasses[size]} bg-white rounded-[10px] shadow-md flex flex-col items-center justify-center relative cursor-default transition-transform hover:-translate-y-0.5 overflow-hidden ${className}`}
        style={{ border: '1px solid #C2413B' }}
        onClick={onClick}
      >
        {children}
      </div>
    );
  };

  switch (tile.suit) {
    case 'dots':
      return tileShell(<DotTile number={tile.number!} size={renderSize} />);
    case 'bamboo':
      return tileShell(<BambooTile number={tile.number!} size={renderSize} />);
    case 'characters':
      return tileShell(<CharacterTile number={tile.number!} size={renderSize} />);
    case 'winds':
      return tileShell(<WindTile direction={tile.type as 'E'|'S'|'W'|'N'} size={renderSize} />);
    case 'dragons':
      return tileShell(<DragonTile type={tile.type as 'red'|'green'|'white'} size={renderSize} />);
    case 'flowers':
      return tileShell(<FlowerTile index={tile.number!} size={renderSize} />);
    case 'jokers':
      return tileShell(<JokerTile index={tile.number!} size={renderSize} />);
    default:
      return tileShell(<span className="text-xs text-gray-400">?</span>);
  }
};
