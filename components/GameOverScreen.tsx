import React from "react";

interface GameOverScreenProps {
  onRestart: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-red-900 via-purple-900 to-red-900 rounded-lg border border-red-400/20 shadow-2xl">
      <div className="text-center space-y-6 p-8">
        <h2 className="text-4xl md:text-5xl font-bold text-red-400 mb-4 [text-shadow:0_0_15px_#ef4444]">
          💥 ゲームオーバー
        </h2>
        <p className="text-lg text-pink-300/90 mb-6 max-w-md mx-auto leading-relaxed">
          爆弾に巻き込まれてしまいました...
          <br />
          でも諦めないで！もう一度挑戦してみよう！
        </p>
        <div className="space-y-4">
          <div className="text-sm text-red-300/80 space-y-1">
            <p>
              💀 <strong>結果:</strong>
            </p>
            <p>• 爆弾の爆発に巻き込まれました</p>
            <p>• もっと慎重に爆弾を設置しましょう</p>
            <p>• 敵の動きを予測して行動しましょう</p>
          </div>
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-red-400/30"
          >
            🔄 もう一度挑戦
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
