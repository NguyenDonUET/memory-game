import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  onRestart: () => void;
  onNewGame: () => void;
}

export function GameHeader({ onRestart, onNewGame }: GameHeaderProps) {
  return (
    <header className="flex w-full items-center justify-between">
      <p className="text-preset-2 font-bold text-blue-950">memory</p>
      <div className="flex gap-200">
        <Button type="button" variant="primary" size="default" onClick={onRestart}>
          Restart
        </Button>
        <Button type="button" variant="secondary" size="default" onClick={onNewGame}>
          New Game
        </Button>
      </div>
    </header>
  );
}
