import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatElapsed, getPlayerRankings, isSolo } from '@/features/game';
import { cn } from '@/lib/utils';

import type { GameState } from '@/features/game';

interface GameOverDialogProps {
  state: GameState;
  onRestart: () => void;
  onNewGame: () => void;
}

export function GameOverDialog({ state, onRestart, onNewGame }: GameOverDialogProps) {
  const open = state.status === 'finished';
  const solo = isSolo(state.settings);

  return (
    <Dialog open={open} onOpenChange={() => undefined}>
      <DialogContent
        onOpenAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
        className="flex flex-col gap-500"
      >
        {solo ? (
          <SoloResults state={state} onRestart={onRestart} onNewGame={onNewGame} />
        ) : (
          <MultiResults state={state} onNewGame={onNewGame} />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface ResultsProps {
  state: GameState;
  onRestart?: () => void;
  onNewGame: () => void;
}

function SoloResults({ state, onRestart, onNewGame }: ResultsProps) {
  return (
    <>
      <DialogHeader className="gap-100">
        <DialogTitle>You did it!</DialogTitle>
        <DialogDescription>Game over! Here&apos;s how you got on...</DialogDescription>
      </DialogHeader>
      <div className="flex w-full flex-col gap-200">
        <ResultRow label="Time Elapsed" value={formatElapsed(state.elapsedMs)} />
        <ResultRow label="Moves Taken" value={`${state.moves} Moves`} />
      </div>
      <div className="flex w-full gap-200">
        <Button type="button" variant="primary" size="lg" className="flex-1" onClick={onRestart}>
          Restart
        </Button>
        <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={onNewGame}>
          Setup New Game
        </Button>
      </div>
    </>
  );
}

function MultiResults({ state, onNewGame }: ResultsProps) {
  const rankings = getPlayerRankings(state.scores);
  const winners = rankings.filter((r) => r.isWinner);
  const title =
    winners.length > 1 ? "It's a tie!" : `Player ${(winners[0]?.playerIndex ?? 0) + 1} Wins!`;

  return (
    <>
      <DialogHeader className="gap-100">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Game over! Here are the results...</DialogDescription>
      </DialogHeader>
      <ul className="flex w-full flex-col gap-200">
        {rankings.map((rank) => (
          <li
            key={rank.playerIndex}
            className={cn(
              'rounded-10 flex items-center justify-between px-300 py-300',
              rank.isWinner ? 'bg-blue-950 text-white' : 'bg-blue-100 text-blue-950',
            )}
          >
            <span
              className={cn(
                'text-preset-5 font-bold',
                rank.isWinner ? 'text-white' : 'text-blue-800',
              )}
            >
              Player {rank.playerIndex + 1}
              {rank.isWinner ? ' (Winner!)' : ''}
            </span>
            <span className="text-preset-4 font-bold">
              {rank.pairs} {rank.pairs === 1 ? 'Pair' : 'Pairs'}
            </span>
          </li>
        ))}
      </ul>
      <Button type="button" variant="secondary" size="lg" className="w-full" onClick={onNewGame}>
        Setup New Game
      </Button>
    </>
  );
}

interface ResultRowProps {
  label: string;
  value: string;
}

function ResultRow({ label, value }: ResultRowProps) {
  return (
    <div className="rounded-10 flex items-center justify-between bg-blue-100 px-300 py-300">
      <span className="text-preset-5 font-bold text-blue-800">{label}</span>
      <span className="text-preset-2 font-bold text-blue-950">{value}</span>
    </div>
  );
}
