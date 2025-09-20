import React, { useState, useEffect, useCallback, useRef } from "react";
import { GameState, CellType, Position, Enemy, Bomb } from "../types";
import {
  GRID_SIZE,
  SOFT_BLOCK_DENSITY,
  ENEMY_COUNT,
  BOMB_TIMER_MS,
  EXPLOSION_DURATION_MS,
  BOMB_RANGE,
  GAME_TICK_MS,
  ENEMY_MOVE_INTERVAL,
} from "../constants";

interface GameScreenProps {
  onWin: () => void;
  onGameOver: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onWin, onGameOver }) => {
  const [grid, setGrid] = useState<CellType[][]>([]);
  const [playerPosition, setPlayerPosition] = useState<Position>({
    row: 1,
    col: 1,
  });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bombs, setBombs] = useState<Bomb[]>([]);
  const [explosions, setExplosions] = useState<Position[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const gameLoopRef = useRef<number>();

  // Initialize game grid
  const initializeGrid = useCallback(() => {
    const newGrid: CellType[][] = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      newGrid[row] = [];
      for (let col = 0; col < GRID_SIZE; col++) {
        if (
          row === 0 ||
          row === GRID_SIZE - 1 ||
          col === 0 ||
          col === GRID_SIZE - 1
        ) {
          newGrid[row][col] = CellType.HARD_BLOCK;
        } else if (row % 2 === 0 && col % 2 === 0) {
          newGrid[row][col] = CellType.HARD_BLOCK;
        } else if (
          Math.random() < SOFT_BLOCK_DENSITY &&
          !(row === 1 && col === 1)
        ) {
          newGrid[row][col] = CellType.SOFT_BLOCK;
        } else {
          newGrid[row][col] = CellType.EMPTY;
        }
      }
    }
    return newGrid;
  }, []);

  // Initialize enemies
  const initializeEnemies = useCallback((grid: CellType[][]) => {
    const newEnemies: Enemy[] = [];
    let enemyId = 0;

    while (newEnemies.length < ENEMY_COUNT) {
      const row = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      const col = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;

      if (grid[row][col] === CellType.EMPTY && !(row === 1 && col === 1)) {
        newEnemies.push({
          id: enemyId++,
          position: { row, col },
          direction: ["up", "down", "left", "right"][
            Math.floor(Math.random() * 4)
          ] as "up" | "down" | "left" | "right",
        });
      }
    }

    return newEnemies;
  }, []);

  // Check if position is valid
  const isValidPosition = useCallback((pos: Position, grid: CellType[][]) => {
    return (
      pos.row >= 0 &&
      pos.row < GRID_SIZE &&
      pos.col >= 0 &&
      pos.col < GRID_SIZE &&
      grid[pos.row][pos.col] === CellType.EMPTY
    );
  }, []);

  // Move enemies
  const moveEnemies = useCallback(
    (currentGrid: CellType[][], currentEnemies: Enemy[]) => {
      return currentEnemies.map((enemy) => {
        const directions = ["up", "down", "left", "right"] as const;
        const newDirection = directions[Math.floor(Math.random() * 4)];

        let newPosition = { ...enemy.position };
        switch (newDirection) {
          case "up":
            newPosition.row--;
            break;
          case "down":
            newPosition.row++;
            break;
          case "left":
            newPosition.col--;
            break;
          case "right":
            newPosition.col++;
            break;
        }

        if (isValidPosition(newPosition, currentGrid)) {
          return { ...enemy, position: newPosition, direction: newDirection };
        }

        return enemy;
      });
    },
    [isValidPosition]
  );

  // Handle bomb explosion
  const explodeBomb = useCallback((bomb: Bomb, currentGrid: CellType[][]) => {
    const explosionPositions: Position[] = [bomb.position];

    // Explode in all directions
    for (const direction of ["up", "down", "left", "right"] as const) {
      for (let i = 1; i <= bomb.range; i++) {
        let pos = { ...bomb.position };
        switch (direction) {
          case "up":
            pos.row -= i;
            break;
          case "down":
            pos.row += i;
            break;
          case "left":
            pos.col -= i;
            break;
          case "right":
            pos.col += i;
            break;
        }

        if (
          pos.row < 0 ||
          pos.row >= GRID_SIZE ||
          pos.col < 0 ||
          pos.col >= GRID_SIZE
        )
          break;

        if (currentGrid[pos.row][pos.col] === CellType.HARD_BLOCK) break;

        explosionPositions.push(pos);

        if (currentGrid[pos.row][pos.col] === CellType.SOFT_BLOCK) break;
      }
    }

    return explosionPositions;
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGrid((currentGrid) => {
      setEnemies((currentEnemies) => {
        setBombs((currentBombs) => {
          setExplosions((currentExplosions) => {
            let newGrid = [...currentGrid];
            let newEnemies = [...currentEnemies];
            let newBombs = [...currentBombs];
            let newExplosions = [...currentExplosions];

            // Update bomb timers
            newBombs = newBombs.map((bomb) => ({
              ...bomb,
              timer: bomb.timer - GAME_TICK_MS,
            }));

            // Explode bombs
            const bombsToExplode = newBombs.filter((bomb) => bomb.timer <= 0);
            for (const bomb of bombsToExplode) {
              const explosionPositions = explodeBomb(bomb, newGrid);
              newExplosions.push(...explosionPositions);

              // Destroy soft blocks
              explosionPositions.forEach((pos) => {
                if (newGrid[pos.row][pos.col] === CellType.SOFT_BLOCK) {
                  newGrid[pos.row][pos.col] = CellType.EMPTY;
                }
              });
            }

            newBombs = newBombs.filter((bomb) => bomb.timer > 0);

            // Update explosion timers
            if (newExplosions.length > 0) {
              setTimeout(() => {
                setExplosions([]);
              }, EXPLOSION_DURATION_MS);
            }

            // Move enemies
            newEnemies = moveEnemies(newGrid, newEnemies);

            // Check collisions
            const explosionPositions = newExplosions.map(
              (exp) => `${exp.row},${exp.col}`
            );

            // Check if player is hit
            setPlayerPosition((currentPlayerPosition) => {
              const playerHit = explosionPositions.includes(
                `${currentPlayerPosition.row},${currentPlayerPosition.col}`
              );
              if (playerHit) {
                setGameState(GameState.GAME_OVER);
                onGameOver();
              }
              return currentPlayerPosition;
            });

            // Check if enemies are hit
            newEnemies = newEnemies.filter(
              (enemy) =>
                !explosionPositions.includes(
                  `${enemy.position.row},${enemy.position.col}`
                )
            );

            // Check win condition
            if (newEnemies.length === 0) {
              setGameState(GameState.WIN);
              onWin();
            }

            return newExplosions;
          });
          return newBombs;
        });
        return newEnemies;
      });
      return newGrid;
    });
  }, [explodeBomb, moveEnemies, onWin, onGameOver]);

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== GameState.PLAYING) return;

      const newPosition = { ...playerPosition };

      switch (event.key) {
        case "ArrowUp":
          newPosition.row--;
          break;
        case "ArrowDown":
          newPosition.row++;
          break;
        case "ArrowLeft":
          newPosition.col--;
          break;
        case "ArrowRight":
          newPosition.col++;
          break;
        case " ":
          event.preventDefault();
          // Place bomb
          setBombs((currentBombs) => {
            const bombExists = currentBombs.some(
              (bomb) =>
                bomb.position.row === playerPosition.row &&
                bomb.position.col === playerPosition.col
            );
            if (!bombExists) {
              return [
                ...currentBombs,
                {
                  position: { ...playerPosition },
                  timer: BOMB_TIMER_MS,
                  range: BOMB_RANGE,
                },
              ];
            }
            return currentBombs;
          });
          return;
      }

      if (isValidPosition(newPosition, grid)) {
        setPlayerPosition(newPosition);
      }
    },
    [playerPosition, grid, gameState, isValidPosition]
  );

  // Initialize game
  useEffect(() => {
    const initialGrid = initializeGrid();
    const initialEnemies = initializeEnemies(initialGrid);
    setGrid(initialGrid);
    setEnemies(initialEnemies);
    setPlayerPosition({ row: 1, col: 1 });
    setBombs([]);
    setExplosions([]);
    setGameState(GameState.PLAYING);
  }, []);

  // Start game loop
  useEffect(() => {
    if (gameState === GameState.PLAYING && grid.length > 0) {
      gameLoopRef.current = window.setInterval(gameLoop, GAME_TICK_MS);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = undefined;
      }
    };
  }, [gameState, gameLoop, grid.length]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  const getCellClass = (cellType: CellType, row: number, col: number) => {
    const isExplosion = explosions.some(
      (exp) => exp.row === row && exp.col === col
    );
    const isPlayer = playerPosition.row === row && playerPosition.col === col;
    const isEnemy = enemies.some(
      (enemy) => enemy.position.row === row && enemy.position.col === col
    );
    const isBomb = bombs.some(
      (bomb) => bomb.position.row === row && bomb.position.col === col
    );

    if (isExplosion) return "bg-red-500 animate-pulse";
    if (isPlayer) return "bg-cyan-400 rounded-full";
    if (isEnemy) return "bg-pink-500 rounded-full";
    if (isBomb) return "bg-yellow-500 rounded-full";

    switch (cellType) {
      case CellType.HARD_BLOCK:
        return "bg-gray-600";
      case CellType.SOFT_BLOCK:
        return "bg-amber-600";
      case CellType.EMPTY:
        return "bg-slate-800";
      default:
        return "bg-slate-800";
    }
  };

  // Show loading state if grid is not initialized
  if (grid.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg border border-cyan-400/20 shadow-2xl p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            🎮 ゲームを読み込み中...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-lg border border-cyan-400/20 shadow-2xl p-4">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">🎮 ゲーム中</h2>
        <p className="text-pink-300">残り敵: {enemies.length}体</p>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: "400px",
          height: "400px",
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-full h-full border border-slate-700 ${getCellClass(
                cell,
                rowIndex,
                colIndex
              )}`}
            />
          ))
        )}
      </div>

      <div className="mt-4 text-center text-sm text-cyan-300/80">
        <p>🎯 矢印キー: 移動 | スペース: 爆弾設置</p>
      </div>
    </div>
  );
};

export default GameScreen;
