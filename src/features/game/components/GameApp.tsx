import { useGame } from '@/features/game/hooks/useGame';
import { GameBoard } from '@/features/game/components/GameBoard';
import { SetupScreen } from '@/features/game/components/SetupScreen';

export function GameApp() {
  const { state, updateSettings, start, restart, newGame, flip } = useGame();

  if (state.status === 'setup') {
    return <SetupScreen settings={state.settings} onChange={updateSettings} onStart={start} />;
  }

  return <GameBoard state={state} onFlip={flip} onRestart={restart} onNewGame={newGame} />;
}
