import axios from 'axios';
import { PieceType } from '../types/game';

const API_URL = 'http://localhost:3000/api';

export interface Game {
  id: number;
  board: PieceType[][];
  current_turn: 'ATTACKER' | 'DEFENDER';
  status: 'IN_PROGRESS' | 'ATTACKER_WIN' | 'DEFENDER_WIN' | 'DRAW';
}

export interface Move {
  from_row: number;
  from_col: number;
  to_row: number;
  to_col: number;
  piece_type: PieceType;
}

export const api = {
  createGame: async (): Promise<Game> => {
    const response = await axios.post(`${API_URL}/games`);
    return response.data;
  },

  makeMove: async (gameId: number, move: Move): Promise<Game> => {
    const response = await axios.post(`${API_URL}/games/${gameId}/make_move`, { move });
    return response.data;
  }
};

export interface GameResponse {
  id: number;
  status: 'IN_PROGRESS' | 'ATTACKER_WIN' | 'DEFENDER_WIN';
  current_turn: 'ATTACKER' | 'DEFENDER';
  board: PieceType[][];
  tafl_moves: MoveResponse[];
}

export interface MoveResponse {
  id: number;
  from_row: number;
  from_col: number;
  to_row: number;
  to_col: number;
  piece_type: PieceType;
  captured_pieces: Array<{ row: number; col: number }>;
}

export const getGame = async (id: number): Promise<GameResponse> => {
  const response = await axios.get<GameResponse>(`${API_URL}/games/${id}`);
  return response.data;
}; 