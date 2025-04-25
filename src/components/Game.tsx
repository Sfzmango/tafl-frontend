import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { api, Move } from '../services/api';
import { PieceType, Position } from '../types/game';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import './Game.css';
import king from '../assets/king.webp';
import attacker from '../assets/attacker.webp';
import defender from '../assets/defender.webp';

const Game: React.FC = () => {
  const { game, setGame, selectedPiece, setSelectedPiece, moveTargets, setMoveTargets } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = async () => {
    try {
      setLoading(true);
      const newGame = await api.createGame();
      setGame(newGame);
      setSelectedPiece(null);
      setMoveTargets([]);
    } catch (err) {
      setError('Failed to create game');
      toast.error('Failed to create game');
    } finally {
      setLoading(false);
    }
  };

  const isRestrictedSquare = (row: number, col: number) => {
    return (row === 5 && col === 5) || // Throne
           (row === 0 && col === 0) || // Top-left corner
           (row === 0 && col === 10) || // Top-right corner
           (row === 10 && col === 0) || // Bottom-left corner
           (row === 10 && col === 10); // Bottom-right corner
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    if (!game) return false;

    if (fromRow !== toRow && fromCol !== toCol) return false;

    if (isRestrictedSquare(toRow, toCol) && game.board[fromRow][fromCol] !== 'KING') {
      return false;
    }

    const rowStep = fromRow === toRow ? 0 : (toRow - fromRow) / Math.abs(toRow - fromRow);
    const colStep = fromCol === toCol ? 0 : (toCol - fromCol) / Math.abs(toCol - fromCol);
    
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    
    while (currentRow !== toRow || currentCol !== toCol) {
      if (game.board[currentRow][currentCol] !== 'EMPTY') return false;
      currentRow += rowStep;
      currentCol += colStep;
    }

    return true;
  };

  const calculateMoveTargets = (row: number, col: number) => {
    if (!game) return;

    const targets: Position[] = [];
    const piece = game.board[row][col];

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    directions.forEach(([dRow, dCol]) => {
      let currentRow = row + dRow;
      let currentCol = col + dCol;
      
      while (
        currentRow >= 0 &&
        currentRow < 11 &&
        currentCol >= 0 &&
        currentCol < 11 &&
        game.board[currentRow][currentCol] === 'EMPTY' &&
        isValidMove(row, col, currentRow, currentCol)
      ) {
        targets.push({ row: currentRow, col: currentCol });
        currentRow += dRow;
        currentCol += dCol;
      }
    });

    setMoveTargets(targets);
  };

  const handleSquareClick = async (row: number, col: number) => {
    if (!game || game.status !== 'IN_PROGRESS') return;

    const piece = game.board[row][col];
    
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
      setSelectedPiece(null);
      setMoveTargets([]);
      return;
    }

    if (selectedPiece) {
      if (!isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
        toast.error('Invalid move');
        return;
      }

      try {
        const move: Move = {
          from_row: selectedPiece.row,
          from_col: selectedPiece.col,
          to_row: row,
          to_col: col,
          piece_type: game.board[selectedPiece.row][selectedPiece.col]
        };
        
        const updatedGame = await api.makeMove(game.id, move);
        setGame(updatedGame);
        setSelectedPiece(null);
        setMoveTargets([]);

        if (updatedGame.status === 'DEFENDER_WIN') {
          toast.success('Defenders win! The king has reached a corner.');
        } else if (updatedGame.status === 'ATTACKER_WIN') {
          toast.success('Attackers win! The king has been captured.');
        }
      } catch (err) {
        toast.error('Invalid move');
      }
    } else if (piece !== 'EMPTY') {
      if ((game.current_turn === 'ATTACKER' && piece === 'ATTACKER') ||
          (game.current_turn === 'DEFENDER' && (piece === 'DEFENDER' || piece === 'KING'))) {
        setSelectedPiece({ row, col });
        calculateMoveTargets(row, col);
      } else {
        toast.error("It's not your turn");
      }
    }
  };

  const getPieceImage = (type: PieceType) => {
    switch (type) {
      case 'KING':
        return king;
      case 'ATTACKER':
        return attacker;
      case 'DEFENDER':
        return defender;
      default:
        return '';
    }
  };

  const getSquareClass = (row: number, col: number) => {
    const classes = ['square'];
    if (isRestrictedSquare(row, col)) {
      classes.push('restricted');
    }
    if (selectedPiece && selectedPiece.row === row && selectedPiece.col === col) {
      classes.push('selected');
    }
    if (moveTargets.some(target => target.row === row && target.col === col)) {
      classes.push('target');
    }
    return classes.join(' ');
  };

  if (loading) return <div className="text-center p-5">Loading game...</div>;
  if (error) return <div className="text-danger text-center p-5">{error}</div>;
  if (!game) return null;

  return (
    <div className="game-container">
      <div className="game-content">
        <h1 className="game-title">Fetlar Hnefatafl</h1>
        <div className="board">
          {game.board.map((row, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {row.map((piece, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={getSquareClass(rowIndex, colIndex)}
                  onClick={() => handleSquareClick(rowIndex, colIndex)}
                >
                  {piece !== 'EMPTY' && (
                    <img
                      src={getPieceImage(piece)}
                      alt={piece}
                      className="piece"
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="game-status">
          <span className="turn-badge">
            {game.current_turn === 'ATTACKER' ? 'Attackers' : 'Defenders'} Turn
          </span>
          {game.status !== 'IN_PROGRESS' && (
            <div className="mt-3">
              {game.status === 'DEFENDER_WIN' && (
                <div className="alert alert-success">
                  Defenders win! The king has reached a corner.
                </div>
              )}
              {game.status === 'ATTACKER_WIN' && (
                <div className="alert alert-danger">
                  Attackers win! The king has been captured.
                </div>
              )}
              {game.status === 'DRAW' && 'Game Ended in a Draw!'}
            </div>
          )}
        </div>
        <div className="text-center mt-3">
          <button
            className="btn btn-warning game-text"
            onClick={initializeGame}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game; 