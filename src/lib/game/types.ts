export type Player = 1 | 2;
export type PieceType = 0 | 1 | 2 | 3 | 4;

export type BoardState = PieceType[][];

export interface Position {
  r: number;
  c: number;
}

export interface Move {
  from: Position;
  to: Position;
  isJump: boolean;
  jumpedPiece?: Position;
}

export interface GameState {
  board: BoardState;
  turn: Player;
  winner: Player | null;
  mustJumpPos: Position | null;
}
