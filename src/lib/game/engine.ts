import { Player, BoardState, Position, Move, GameState, PieceType } from './types';

export const P1: Player = 1;
export const P2: Player = 2;
export const P1_KING: PieceType = 3;
export const P2_KING: PieceType = 4;
export const EMPTY: PieceType = 0;

export const initialBoard = (): BoardState => {
  const board = Array(8).fill(null).map(() => Array(8).fill(EMPTY));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) board[r][c] = P2; // Top side (Black/P2)
        else if (r > 4) board[r][c] = P1; // Bottom side (Red/P1)
      }
    }
  }
  return board;
};

export const isOpponent = (piece: PieceType, player: Player): boolean => {
  if (piece === EMPTY) return false;
  return player === P1 ? piece === P2 || piece === P2_KING : piece === P1 || piece === P1_KING;
};

export const isOwnPiece = (piece: PieceType, player: Player): boolean => {
  if (piece === EMPTY) return false;
  return player === P1 ? piece === P1 || piece === P1_KING : piece === P2 || piece === P2_KING;
};

export const getValidMoves = (state: GameState): Move[] => {
  const { board, turn, mustJumpPos } = state;
  const moves: Move[] = [];
  const jumpMoves: Move[] = [];

  const addMovesForPiece = (r: number, c: number) => {
    const piece = board[r][c];
    if (!isOwnPiece(piece, turn)) return;

    const isKing = piece === P1_KING || piece === P2_KING;
    const forwardDir = turn === P1 ? -1 : 1; 
    
    const dirs = [[forwardDir, -1], [forwardDir, 1]];
    if (isKing) {
      dirs.push([-forwardDir, -1], [-forwardDir, 1]);
    }

    for (const [dr, dc] of dirs) {
      // 1. Simple move
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
        if (board[nr][nc] === EMPTY && !mustJumpPos) {
          moves.push({ from: { r, c }, to: { r: nr, c: nc }, isJump: false });
        }
        
        // 2. Jump move
        const jr = r + 2 * dr;
        const jc = c + 2 * dc;
        if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
          if (isOpponent(board[nr][nc], turn) && board[jr][jc] === EMPTY) {
            jumpMoves.push({
              from: { r, c },
              to: { r: jr, c: jc },
              isJump: true,
              jumpedPiece: { r: nr, c: nc }
            });
          }
        }
      }
    }
  };

  if (mustJumpPos) {
    addMovesForPiece(mustJumpPos.r, mustJumpPos.c);
    // Return only jumps for the piece that must jump
    return jumpMoves.filter(m => m.from.r === mustJumpPos.r && m.from.c === mustJumpPos.c);
  }

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      addMovesForPiece(r, c);
    }
  }

  // Mandatory capture rule
  if (jumpMoves.length > 0) {
    return jumpMoves;
  }
  return moves;
};

export const performMove = (state: GameState, move: Move): GameState => {
  const newBoard = state.board.map(row => [...row]);
  let newTurn = state.turn;
  let newMustJumpPos: Position | null = null;
  
  const piece = newBoard[move.from.r][move.from.c];
  newBoard[move.from.r][move.from.c] = EMPTY;
  
  let promoted = false;
  let nextPiece = piece;

  // King promotion
  if (piece === P1 && move.to.r === 0) {
    nextPiece = P1_KING;
    promoted = true;
  } else if (piece === P2 && move.to.r === 7) {
    nextPiece = P2_KING;
    promoted = true;
  }
  
  newBoard[move.to.r][move.to.c] = nextPiece;

  if (move.isJump && move.jumpedPiece) {
    newBoard[move.jumpedPiece.r][move.jumpedPiece.c] = EMPTY;
    
    // Check for multi-jump if not promoted this turn
    if (!promoted) {
      const tempState: GameState = { ...state, board: newBoard, mustJumpPos: move.to };
      const nextMoves = getValidMoves(tempState);
      if (nextMoves.length > 0 && nextMoves[0].isJump) {
        newMustJumpPos = move.to;
      }
    }
  }

  if (!newMustJumpPos) {
    newTurn = state.turn === P1 ? P2 : P1;
  }
  
  const tempNextState = { ...state, board: newBoard, turn: newTurn, mustJumpPos: newMustJumpPos };
  const winner = checkWinner(tempNextState);

  return {
    ...tempNextState,
    winner: state.winner || winner
  };
};

export const checkWinner = (state: GameState): Player | null => {
  const nextMoves = getValidMoves({ ...state, mustJumpPos: state.mustJumpPos });
  if (nextMoves.length === 0) {
    return state.turn === P1 ? P2 : P1;
  }
  
  // Also check if any pieces remain
  let p1Pieces = 0;
  let p2Pieces = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (state.board[r][c] === P1 || state.board[r][c] === P1_KING) p1Pieces++;
      if (state.board[r][c] === P2 || state.board[r][c] === P2_KING) p2Pieces++;
    }
  }
  
  if (p1Pieces === 0) return P2;
  if (p2Pieces === 0) return P1;
  
  return null;
};
