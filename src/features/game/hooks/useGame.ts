import { useCallback, useEffect, useReducer } from 'react';

import { MISMATCH_DELAY_MS } from '@/features/game/lib/constants';
import { createInitialState, gameReducer, isSolo } from '@/features/game';

import type { GameSettings } from '@/features/game';

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState());

  useEffect(() => {
    if (!state.isLocked) {
      return;
    }
    const id = window.setTimeout(() => {
      dispatch({ type: 'RESOLVE_MISMATCH' });
    }, MISMATCH_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [state.isLocked]);

  useEffect(() => {
    if (state.status !== 'playing' || !state.timerStarted || !isSolo(state.settings)) {
      return;
    }
    const id = window.setInterval(() => {
      dispatch({ type: 'TICK', deltaMs: 1000 });
    }, 1000);
    return () => window.clearInterval(id);
  }, [state.status, state.timerStarted, state.settings]);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', patch });
  }, []);

  const start = useCallback(() => dispatch({ type: 'START' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const newGame = useCallback(() => dispatch({ type: 'NEW_GAME' }), []);
  const flip = useCallback((tileId: number) => dispatch({ type: 'FLIP', tileId }), []);

  return {
    state,
    updateSettings,
    start,
    restart,
    newGame,
    flip,
  };
}
