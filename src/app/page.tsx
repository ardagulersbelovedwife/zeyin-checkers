"use client";

import { useState, useEffect } from "react";
import { CheckersBoard } from "@/components/board/CheckersBoard";
import { initialBoard, getValidMoves, performMove } from "@/lib/game/engine";
import { GameState, Move } from "@/lib/game/types";
import { ThemeToggle } from "@/components/theme-toggle";
import { getBestMove } from "@/lib/game/ai";
import { createClient } from "@/lib/supabase/client";
import { Login } from "@/components/auth/login";
import { MatchHistory } from "@/components/history/MatchHistory";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    board: initialBoard(),
    turn: 1,
    winner: null,
    mustJumpPos: null,
  });
  const [difficulty, setDifficulty] = useState<string>("2"); // Depth 2, 4, 6
  const [isThinking, setIsThinking] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [resultSaved, setResultSaved] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoadingUser(false);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const validMoves = getValidMoves(gameState);

  const handleMove = (move: Move) => {
    // Only allow human moves if it's Player 1's turn
    if (gameState.turn !== 1 || isThinking || gameState.winner) return;
    const newState = performMove(gameState, move);
    setGameState(newState);
  };

  useEffect(() => {
    if (gameState.turn === 2 && !gameState.winner) {
      setIsThinking(true);
      
      const timer = setTimeout(() => {
        const bestMove = getBestMove(gameState, parseInt(difficulty));
        if (bestMove) {
          const newState = performMove(gameState, bestMove);
          setGameState(newState);
        } else {
          setGameState(prev => ({ ...prev, winner: 1 }));
        }
        setIsThinking(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [gameState, difficulty]);

  useEffect(() => {
    if (gameState.winner && user && !resultSaved) {
      setResultSaved(true);
      const saveResult = async () => {
        await supabase.from("games_history").insert({
          user_id: user.id,
          difficulty: difficulty,
          result: gameState.winner === 1 ? "win" : "loss"
        });
      };
      saveResult();
    }
  }, [gameState.winner, user, difficulty, resultSaved, supabase]);

  const handleRestart = () => {
    setGameState({
      board: initialBoard(),
      turn: 1,
      winner: null,
      mustJumpPos: null,
    });
    setResultSaved(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 selection:bg-muted">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">Zeyin Checkers</h1>
          <p className="text-muted-foreground">Sign in to start playing and track your history.</p>
        </div>
        <Login />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-muted">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 w-full z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-semibold text-xl tracking-tight text-primary">
            Zeyin Checkers
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleLogout}>Sign Out</Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24 flex-1 w-full flex flex-col items-center">
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-semibold mb-4 tracking-tight text-primary">
            Player vs AI Match
          </h1>
          <p className="text-muted-foreground max-w-xl mb-6">
            Test your skills against the Minimax AI. Select a difficulty below.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Difficulty:</span>
            <Select value={difficulty} onValueChange={(val) => { if (val) setDifficulty(val); }} disabled={isThinking || gameState.turn === 2 || gameState.turn > 1}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Easy (Depth 2)</SelectItem>
                <SelectItem value="4">Medium (Depth 4)</SelectItem>
                <SelectItem value="6">Hard (Depth 6)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center h-12">
          <div className="text-lg font-medium">
            {gameState.winner ? (
              <span className="text-primary font-bold">Player {gameState.winner} wins!</span>
            ) : (
              <span>
                {gameState.turn === 1 ? (
                  <span className="text-primary">Your turn (Light)</span>
                ) : (
                  <span className="text-secondary-foreground font-semibold">
                    {isThinking ? "AI is thinking..." : "Opponent's turn (Dark)"}
                  </span>
                )}
              </span>
            )}
          </div>
          {gameState.mustJumpPos && !gameState.winner && (
            <span className="mt-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded border border-destructive/20">
              Mandatory jump required
            </span>
          )}
          {gameState.winner && (
            <Button size="sm" variant="outline" className="mt-2" onClick={handleRestart}>
              Play Again
            </Button>
          )}
        </div>

        <CheckersBoard 
          gameState={gameState} 
          validMoves={validMoves} 
          onMove={handleMove}
          playerPerspective={1}
        />

        <div className="w-full max-w-2xl mt-16">
          <MatchHistory userId={user.id} />
        </div>
      </main>
    </div>
  );
}
