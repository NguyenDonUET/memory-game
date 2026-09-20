import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GameHeaderProps {
  onRestart: () => void;
  onNewGame: () => void;
}

export function GameHeader({ onRestart, onNewGame }: GameHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex w-full items-center justify-between gap-200">
      <p className="text-preset-3 md:text-preset-2 font-bold text-blue-950">memory</p>

      {/* Desktop / tablet actions */}
      <div className="hidden gap-200 sm:flex">
        <Button type="button" variant="primary" size="default" onClick={onRestart}>
          Restart
        </Button>
        <Button type="button" variant="secondary" size="default" onClick={onNewGame}>
          New Game
        </Button>
      </div>

      {/* Mobile menu */}
      <Button
        type="button"
        variant="primary"
        size="sm"
        className="px-300 sm:hidden"
        onClick={() => setMenuOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
      >
        Menu
      </Button>

      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogContent className="flex w-[min(100%,20.4375rem)] flex-col gap-200 p-300">
          <DialogHeader className="sr-only">
            <DialogTitle>Game menu</DialogTitle>
            <DialogDescription>Restart the round or set up a new game.</DialogDescription>
          </DialogHeader>
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              setMenuOpen(false);
              onRestart();
            }}
          >
            Restart
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => {
              setMenuOpen(false);
              onNewGame();
            }}
          >
            New Game
          </Button>
        </DialogContent>
      </Dialog>
    </header>
  );
}
