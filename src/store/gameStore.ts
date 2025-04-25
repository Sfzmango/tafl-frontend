import { create } from 'zustand';
import { Game, Move } from '../services/api';
import { Position } from '../types/game';

interface GameStore {
  game: Game | null;
  selectedPiece: Position | null;
  moveTargets: Position[];
  setGame: (game: Game | null) => void;
  setSelectedPiece: (piece: Position | null) => void;
  setMoveTargets: (targets: Position[]) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  selectedPiece: null,
  moveTargets: [],
  setGame: (game) => set({ game }),
  setSelectedPiece: (piece) => set({ selectedPiece: piece }),
  setMoveTargets: (targets) => set({ moveTargets: targets }),
})); 