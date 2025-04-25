const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  createGame: async () => {
    const response = await fetch(`${API_BASE_URL}/api/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  makeMove: async (gameId: string, from: { row: number; col: number }, to: { row: number; col: number }) => {
    const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/move`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to }),
    });
    return response.json();
  },
}; 