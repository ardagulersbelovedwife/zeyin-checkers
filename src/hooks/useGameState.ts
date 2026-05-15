import { useState, useCallback } from 'react';
import { initialBoard, P1, getValidMoves, performMove } from '@/lib/game/engine';
import { GameState, Move } from '@/lib/game/types';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard(),
    turn: P1,
    winner: null,
    mustJumpPos: null
  });

  const validMoves = getValidMoves(gameState);

  const makeMove = useCallback((move: Move) => {
    setGameState(prev => performMove(prev, move));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: initialBoard(),
      turn: P1,
      winner: null,
      mustJumpPos: null
    });
  }, []);

  return { gameState, setGameState, validMoves, makeMove, resetGame };
};
