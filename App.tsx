import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import GameScreen from './components/GameScreen';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import WinScreen from './components/WinScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [gameId, setGameId] = useState<number>(1);

  const handleStartGame = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, []);

  const handleWin = useCallback(() => {
    setGameState(GameState.WIN);
  }, []);

  const handleGameOver = useCallback(() => {
    setGameState(GameState.GAME_OVER);
  }, []);
  
  const handleRestart = useCallback(() => {
    setGameId(prevId => prevId + 1);
    setGameState(GameState.PLAYING);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGameId(prevId => prevId + 1);
    setGameState(GameState.START);
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={handleStartGame} />;
      case GameState.PLAYING:
        return <GameScreen key={gameId} onWin={handleWin} onGameOver={handleGameOver} />;
      case GameState.GAME_OVER:
        return <GameOverScreen onRestart={handleRestart} />;
      case GameState.WIN:
        return <WinScreen onPlayAgain={handlePlayAgain} />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 tracking-wider [text-shadow:0_0_10px_#06b6d4]">
        Bomber Girl Victory
      </h1>
       <p className="text-lg text-pink-300/80 mb-4 -mt-1 [text-shadow:0_0_5px_#ec4899]">
          Blast the creepy old men to claim your prize!
        </p>
      <div className="w-full max-w-4xl aspect-square md:aspect-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;