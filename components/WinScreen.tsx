import React from "react";

interface WinScreenProps {
  onPlayAgain: () => void;
}

const WinScreen: React.FC<WinScreenProps> = ({ onPlayAgain }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-900 via-purple-900 to-green-900 rounded-lg border border-green-400/20 shadow-2xl">
      <div className="text-center space-y-6 p-8">
        <h2 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 [text-shadow:0_0_15px_#22c55e]">
          🎉 勝利！
        </h2>
        <p className="text-lg text-pink-300/90 mb-6 max-w-md mx-auto leading-relaxed">
          素晴らしい！すべての敵を倒しました！
          <br />
          あなたは真のボンバーガールです！
        </p>
        <div className="space-y-4">
          <div className="text-sm text-green-300/80 space-y-1">
            <p>
              🏆 <strong>勝利条件達成:</strong>
            </p>
            <p>• すべての敵を倒しました</p>
            <p>• 爆弾の使い方が完璧でした</p>
            <p>• 戦略的な思考が光りました</p>
          </div>
          <button
            onClick={onPlayAgain}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-green-400/30"
          >
            🎮 もう一度プレイ
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinScreen;
