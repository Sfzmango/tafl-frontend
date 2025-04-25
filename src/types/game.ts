export type PieceType = 'KING' | 'DEFENDER' | 'ATTACKER' | 'EMPTY';

export interface Position {
  row: number;
  col: number;
}

export interface GamePiece {
  type: PieceType;
  position: Position;
}

export type GameStatus = 'IN_PROGRESS' | 'DEFENDER_WIN' | 'ATTACKER_WIN' | 'DRAW';

export interface GameState {
  board: PieceType[][];
  currentTurn: 'ATTACKER' | 'DEFENDER';
  status: GameStatus;
  selectedPiece: Position | null;
  validMoves: Position[];
}

export interface GameMove {
  from: Position;
  to: Position;
  pieceType: PieceType;
  capturedPieces?: Position[];
} 