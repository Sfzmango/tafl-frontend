import { PieceType } from '../types/game';

export const BOARD_SIZE = 11; // Standard Hnefatafl board size

// Initial board setup for 11x11 Hnefatafl
export const INITIAL_BOARD: PieceType[][] = Array(BOARD_SIZE).fill(null).map(() => 
  Array(BOARD_SIZE).fill('EMPTY')
);

// Set up attackers
const ATTACKER_POSITIONS = [
  // Top
  [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
  [1, 5],
  // Bottom
  [10, 3], [10, 4], [10, 5], [10, 6], [10, 7],
  [9, 5],
  // Left
  [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
  [5, 1],
  // Right
  [3, 10], [4, 10], [5, 10], [6, 10], [7, 10],
  [5, 9]
];

// Set up defenders
const DEFENDER_POSITIONS = [
  [3, 5], [4, 4], [4, 5], [4, 6],
  [5, 3], [5, 4], [5, 6], [5, 7],
  [6, 4], [6, 5], [6, 6],
  [7, 5]
];

// King position
const KING_POSITION: [number, number] = [5, 5];

// Initialize the board with pieces
ATTACKER_POSITIONS.forEach(([row, col]) => {
  INITIAL_BOARD[row][col] = 'ATTACKER';
});

DEFENDER_POSITIONS.forEach(([row, col]) => {
  INITIAL_BOARD[row][col] = 'DEFENDER';
});

INITIAL_BOARD[KING_POSITION[0]][KING_POSITION[1]] = 'KING';

// Corner squares (considered in win conditions)
export const CORNER_POSITIONS: [number, number][] = [
  [0, 0], [0, BOARD_SIZE - 1],
  [BOARD_SIZE - 1, 0], [BOARD_SIZE - 1, BOARD_SIZE - 1]
];

export const PIECE_COLORS = {
  KING: '#FFD700', // Gold
  DEFENDER: '#4169E1', // Royal Blue
  ATTACKER: '#8B0000', // Dark Red
  EMPTY: 'transparent'
}; 