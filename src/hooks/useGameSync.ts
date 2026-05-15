import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GameState } from '@/lib/game/types';
import { initialBoard, P1 } from '@/lib/game/engine';

export const useGameSync = (gameId: string) => {
  const supabase = createClient();
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard(),
    turn: P1,
    winner: null,
    mustJumpPos: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('game_id', gameId)
        .single();
      
      if (data && data.board_state.length > 0) {
        setGameState({
          board: data.board_state,
          turn: data.turn,
          winner: null, 
          mustJumpPos: data.must_jump_pos
        });
      }
      setIsLoading(false);
    };

    fetchGame();

    const channel = supabase
      .channel(`game:${gameId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `game_id=eq.${gameId}`
      }, (payload) => {
        const newData = payload.new as any;
        setGameState({
          board: newData.board_state,
          turn: newData.turn,
          winner: null,
          mustJumpPos: newData.must_jump_pos
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const pushMove = async (newState: GameState) => {
    // Optimistic UI update
    setGameState(newState);
    
    // Update DB
    await supabase
      .from('games')
      .update({
        board_state: newState.board,
        turn: newState.turn,
        must_jump_pos: newState.mustJumpPos,
      })
      .eq('game_id', gameId);
  };

  return { gameState, setGameState, pushMove, isLoading };
};
