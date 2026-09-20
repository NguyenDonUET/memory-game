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
  const faceClassName = cols === 4 ? 'text-tile-4' : 'text-tile-6';

  return (
    <div className="bg-grey-50 flex min-h-dvh flex-col px-300 py-300 sm:px-500 sm:py-500 lg:px-1000">
      <div className="max-w-board-lg mx-auto flex w-full flex-1 flex-col">
        <GameHeader onRestart={onRestart} onNewGame={onNewGame} />

        <div className="flex flex-1 flex-col items-center justify-center gap-500 py-400 sm:gap-800 sm:py-500">
          <div
            className={cn(
              'max-w-board-sm sm:max-w-board-md grid w-full',
              cols === 4 ? 'grid-cols-4 gap-150 sm:gap-200' : 'grid-cols-6 gap-100 sm:gap-150',
            )}
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
                faceClassName={faceClassName}
              />
            ))}
          </div>

          <div className="max-w-board-sm sm:max-w-board-md lg:max-w-board-lg w-full">
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
        </div>
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
