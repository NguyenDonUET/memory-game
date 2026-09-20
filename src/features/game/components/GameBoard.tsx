import { GameHeader } from '@/features/game/components/GameHeader';
import { PlayerScoreboard, SoloStats } from '@/features/game/components/GameFooter';
import { GameOverDialog } from '@/features/game/components/GameOverDialog';
import { GameTile } from '@/features/game/components/GameTile';
import { isSolo } from '@/features/game';
import { cn } from '@/lib/utils';

import type { GameState } from '@/features/game';

interface GameBoardProps {
  state: GameState;
  onFlip: (tileId: number) => void;
  onRestart: () => void;
  onNewGame: () => void;
}

export function GameBoard({ state, onFlip, onRestart, onNewGame }: GameBoardProps) {
  const { settings, tiles } = state;
  const solo = isSolo(settings);
  const cols = settings.gridSize;
  const tileSize = cols === 4 ? 'size-tile-4' : 'size-tile-6';
  const faceClassName = cols === 4 ? 'text-tile-4' : 'text-tile-6';

  return (
    <div className="bg-grey-50 flex min-h-dvh flex-col px-1000 py-500">
      <GameHeader onRestart={onRestart} onNewGame={onNewGame} />

      <div className="flex flex-1 flex-col items-center justify-center gap-1000 py-500">
        <div
          className={cn('grid', cols === 4 ? 'grid-cols-4 gap-200' : 'grid-cols-6 gap-100')}
          role="grid"
          aria-label={`${cols} by ${cols} memory board`}
        >
          {tiles.map((tile) => (
            <GameTile
              key={tile.id}
              tile={tile}
              theme={settings.theme}
              disabled={state.isLocked}
              onFlip={onFlip}
              sizeClassName={tileSize}
              faceClassName={faceClassName}
            />
          ))}
        </div>

        {solo ? (
          <SoloStats elapsedMs={state.elapsedMs} moves={state.moves} />
        ) : (
          <PlayerScoreboard
            playerCount={settings.players}
            scores={state.scores}
            currentPlayer={state.currentPlayer}
          />
        )}
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {solo
          ? `Moves ${state.moves}. Time ${Math.floor(state.elapsedMs / 1000)} seconds.`
          : `Player ${state.currentPlayer + 1}'s turn.`}
      </div>

      <GameOverDialog state={state} onRestart={onRestart} onNewGame={onNewGame} />
    </div>
  );
}
