import { GameState, Move, Player, PieceType } from "./types";
import { getValidMoves, performMove, P1, P2, P1_KING, P2_KING } from "./engine";

const PIECE_VALUE = 10;
const KING_VALUE = 15;

export const evaluateBoard = (state: GameState, aiPlayer: Player): number => {
  if (state.winner) {
    return state.winner === aiPlayer ? 1000 : -1000;
  }

  let score = 0;
  const humanPlayer = aiPlayer === 1 ? 2 : 1;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece === 0) continue;

      let value = 0;
      if (piece === P1 || piece === P2) {
        value = PIECE_VALUE;
        // Positional bonus: advancing further gives a small bonus
        if (piece === P1) {
          value += (7 - r) * 0.1; // P1 moves up (towards r=0)
        } else {
          value += r * 0.1; // P2 moves down (towards r=7)
        }
      } else if (piece === P1_KING || piece === P2_KING) {
        value = KING_VALUE;
      }

      // Edge protection bonus
      if (c === 0 || c === 7) {
        value += 0.5;
      }

      if ((aiPlayer === 1 && (piece === P1 || piece === P1_KING)) ||
          (aiPlayer === 2 && (piece === P2 || piece === P2_KING))) {
        score += value;
      } else {
        score -= value;
      }
    }
  }

  return score;
};

export const minimax = (
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  aiPlayer: Player
): { score: number; move: Move | null } => {
  if (depth === 0 || state.winner) {
    return { score: evaluateBoard(state, aiPlayer), move: null };
  }

  const moves = getValidMoves(state);
  
  // If no moves, current player lost
  if (moves.length === 0) {
    return { score: maximizingPlayer ? -1000 : 1000, move: null };
  }

  let bestMove = moves[0];

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextState = performMove(state, move);
      // If turn didn't change (e.g. multi-jump), keep maximizingPlayer true
      const nextMaximizing = nextState.turn === aiPlayer;
      const evalResult = minimax(nextState, depth - 1, alpha, beta, nextMaximizing, aiPlayer);
      
      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const nextState = performMove(state, move);
      const nextMaximizing = nextState.turn === aiPlayer;
      const evalResult = minimax(nextState, depth - 1, alpha, beta, nextMaximizing, aiPlayer);
      
      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
};

export const getBestMove = (state: GameState, depth: number): Move | null => {
  const result = minimax(state, depth, -Infinity, Infinity, true, state.turn);
  return result.move;
};
