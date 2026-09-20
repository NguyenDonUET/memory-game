import { formatElapsed } from '@/features/game';
import { cn } from '@/lib/utils';

interface SoloStatsProps {
  elapsedMs: number;
  moves: number;
}

export function SoloStats({ elapsedMs, moves }: SoloStatsProps) {
  return (
    <div className="mx-auto flex w-full max-w-[540px] gap-200">
      <StatPill label="Time" value={formatElapsed(elapsedMs)} />
      <StatPill label="Moves" value={String(moves)} />
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-10 flex flex-1 items-center justify-between bg-blue-100 px-300 py-300">
      <span className="text-preset-5 font-bold text-blue-800">{label}</span>
      <span className="text-preset-2 font-bold text-blue-950">{value}</span>
    </div>
  );
}

interface PlayerScoreboardProps {
  playerCount: number;
  scores: number[];
  currentPlayer: number;
}

export function PlayerScoreboard({ playerCount, scores, currentPlayer }: PlayerScoreboardProps) {
  return (
    <div
      className={cn(
        'mx-auto grid w-full gap-200',
        playerCount === 2 && 'max-w-[540px] grid-cols-2',
        playerCount === 3 && 'max-w-[720px] grid-cols-3',
        playerCount === 4 && 'max-w-[1110px] grid-cols-4',
      )}
    >
      {Array.from({ length: playerCount }, (_, index) => {
        const isActive = index === currentPlayer;
        return (
          <div key={index} className="relative flex flex-col items-center">
            {isActive ? (
              <svg
                className="absolute -top-100 left-1/2 -translate-x-1/2 text-orange-400"
                width="20"
                height="10"
                viewBox="0 0 20 10"
                aria-hidden
              >
                <path d="M10 0 20 10H0Z" fill="currentColor" />
              </svg>
            ) : null}
            <div
              className={cn(
                'rounded-10 flex w-full items-center justify-between px-300 py-300',
                isActive ? 'bg-orange-400 text-blue-950' : 'bg-blue-100 text-blue-950',
              )}
            >
              <span
                className={cn(
                  'text-preset-5 font-bold',
                  isActive ? 'text-blue-950' : 'text-blue-800',
                )}
              >
                Player {index + 1}
              </span>
              <span className="text-preset-2 font-bold text-blue-950">{scores[index] ?? 0}</span>
            </div>
            {isActive ? (
              <p className="text-preset-5 mt-100 font-bold tracking-[0.05em] text-blue-950 uppercase">
                Current Turn
              </p>
            ) : (
              <span className="mt-100 block h-[1.125rem]" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}
