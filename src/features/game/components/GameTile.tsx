import { TileIcon } from '@/components/icons/TileIcon';
import { cn } from '@/lib/utils';

import type { Theme, Tile } from '@/features/game';

interface GameTileProps {
  tile: Tile;
  theme: Theme;
  disabled: boolean;
  onFlip: (tileId: number) => void;
  sizeClassName: string;
  faceClassName: string;
}

export function GameTile({
  tile,
  theme,
  disabled,
  onFlip,
  sizeClassName,
  faceClassName,
}: GameTileProps) {
  const isRevealed = tile.state === 'flipped' || tile.state === 'matched';
  const label =
    tile.state === 'hidden'
      ? `Tile ${tile.id + 1}, hidden`
      : theme === 'numbers'
        ? `Tile ${tile.id + 1}, number ${tile.value + 1}`
        : `Tile ${tile.id + 1}, icon ${tile.value + 1}`;

  return (
    <button
      type="button"
      disabled={disabled || tile.state !== 'hidden'}
      aria-label={label}
      aria-pressed={isRevealed}
      onClick={() => onFlip(tile.id)}
      className={cn(
        'flex items-center justify-center rounded-full font-bold transition-colors duration-200',
        sizeClassName,
        tile.state === 'hidden' && 'hover:bg-blue-350 focus-visible:bg-blue-350 bg-blue-800',
        tile.state === 'flipped' && 'bg-orange-400 text-blue-950',
        tile.state === 'matched' && 'bg-blue-300 text-blue-950',
        (disabled || tile.state !== 'hidden') && 'cursor-default',
      )}
    >
      {isRevealed ? (
        theme === 'numbers' ? (
          <span className={cn('leading-none font-bold', faceClassName)}>{tile.value + 1}</span>
        ) : (
          <TileIcon value={tile.value} className="size-3/5 text-current" />
        )
      ) : null}
    </button>
  );
}
