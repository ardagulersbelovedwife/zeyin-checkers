'use client';

import { useState } from 'react';
import { Piece } from './Piece';
import { GameState, Move, Position } from '@/lib/game/types';
import { cn } from '@/lib/utils';

interface CheckersBoardProps {
  gameState: GameState;
  validMoves: Move[];
  onMove: (move: Move) => void;
  playerPerspective?: 1 | 2; 
}

export function CheckersBoard({ gameState, validMoves, onMove, playerPerspective = 1 }: CheckersBoardProps) {
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);

  const handleSquareClick = (r: number, c: number) => {
    if (gameState.winner) return;

    if (selectedPos) {
      const move = validMoves.find(
        m => m.from.r === selectedPos.r && m.from.c === selectedPos.c && m.to.r === r && m.to.c === c
      );
      if (move) {
        onMove(move);
        setSelectedPos(null);
        return;
      }
    }

    const piece = gameState.board[r][c];
    if (piece !== 0) {
      const hasMoves = validMoves.some(m => m.from.r === r && m.from.c === c);
      if (hasMoves) {
        setSelectedPos({ r, c });
      } else {
        setSelectedPos(null);
      }
    } else {
      setSelectedPos(null);
    }
  };

  const boardSize = 8;
  const rows = [];

  for (let r = 0; r < boardSize; r++) {
    const cols = [];
    for (let c = 0; c < boardSize; c++) {
      const isDark = (r + c) % 2 === 1;
      const piece = gameState.board[r][c];
      const isSelected = selectedPos?.r === r && selectedPos?.c === c;
      const isHighlighted = selectedPos && validMoves.some(
        m => m.from.r === selectedPos.r && m.from.c === selectedPos.c && m.to.r === r && m.to.c === c
      );

      cols.push(
        <div
          key={`${r}-${c}`}
          onClick={() => handleSquareClick(r, c)}
          className={cn(
            'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center transition-colors',
            isDark ? 'bg-muted/80 dark:bg-muted/30' : 'bg-background dark:bg-background/90',
            isSelected && 'ring-2 ring-inset ring-ring bg-accent/20',
            isHighlighted && 'ring-2 ring-inset ring-ring/50 bg-accent/40 cursor-pointer hover:bg-accent/60',
            !isSelected && !isHighlighted && 'cursor-default'
          )}
        >
          <Piece type={piece} />
        </div>
      );
    }
    rows.push(<div key={r} className="flex">{cols}</div>);

  }

  const renderRows = playerPerspective === 2 ? [...rows].reverse() : rows;

  return (
    <div className="border border-border/80 rounded-lg overflow-hidden bg-card p-2 shadow-2xl mx-auto max-w-max">
      <div className="border border-border/50 rounded-md overflow-hidden flex flex-col bg-background">
        {renderRows.map((row, i) => {
           if (playerPerspective === 2) {
             return (
               <div key={i} className="flex flex-row-reverse">
                 {row.props.children}
               </div>
             );
           }
           return row;
        })}
      </div>
    </div>
  );
}
