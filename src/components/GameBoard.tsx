import React from 'react';
import styled from '@emotion/styled';
import { GameState, Position } from '../types/game';
import { BOARD_SIZE, PIECE_COLORS, CORNER_POSITIONS } from '../constants/gameConfig';

interface GameBoardProps {
  gameState: GameState;
  onSquareClick: (position: Position) => void;
}

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(${BOARD_SIZE}, 50px);
  grid-template-rows: repeat(${BOARD_SIZE}, 50px);
  gap: 1px;
  background-color: #2c3e50;
  padding: 10px;
  border-radius: 8px;
`;

interface SquareProps {
  isCorner: boolean;
  isSelected: boolean;
  isValidMove: boolean;
}

const Square = styled.div<SquareProps>`
  width: 50px;
  height: 50px;
  background-color: ${props => 
    props.isSelected ? '#4a69bd' :
    props.isValidMove ? '#78e08f' :
    props.isCorner ? '#d35400' : '#ecf0f1'
  };
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const GamePiece = styled.div<{ pieceType: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => PIECE_COLORS[props.pieceType as keyof typeof PIECE_COLORS]};
  border: 2px solid #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const GameBoard: React.FC<GameBoardProps> = ({ gameState, onSquareClick }) => {
  const isCornerSquare = (row: number, col: number): boolean => {
    return CORNER_POSITIONS.some(([r, c]) => r === row && c === col);
  };

  const isValidMove = (row: number, col: number): boolean => {
    return gameState.validMoves.some(move => move.row === row && move.col === col);
  };

  const isSelected = (row: number, col: number): boolean => {
    return gameState.selectedPiece?.row === row && gameState.selectedPiece?.col === col;
  };

  return (
    <BoardContainer>
      <Board>
        {gameState.board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <Square
              key={`${rowIndex}-${colIndex}`}
              isCorner={isCornerSquare(rowIndex, colIndex)}
              isSelected={isSelected(rowIndex, colIndex)}
              isValidMove={isValidMove(rowIndex, colIndex)}
              onClick={() => onSquareClick({ row: rowIndex, col: colIndex })}
            >
              {piece !== 'EMPTY' && <GamePiece pieceType={piece} />}
            </Square>
          ))
        )}
      </Board>
    </BoardContainer>
  );
};

export default GameBoard; 