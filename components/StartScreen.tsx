import React from "react";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-lg border border-cyan-400/20 shadow-2xl">
      <div className="text-center space-y-6 p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4 [text-shadow:0_0_15px_#06b6d4]">
          🎮 ゲームスタート
        </h2>
        <p className="text-lg text-pink-300/90 mb-6 max-w-md mx-auto leading-relaxed">
          爆弾を投げて気持ち悪いおじさんたちを倒そう！
          <br />
          すべての敵を倒して勝利を掴め！
        </p>
        <div className="space-y-4">
          <div className="text-sm text-cyan-300/80 space-y-1">
            <p>
              🎯 <strong>操作方法:</strong>
            </p>
            <p>• 矢印キー: 移動</p>
            <p>• スペースキー: 爆弾設置</p>
            <p>• すべての敵を倒すと勝利！</p>
          </div>
          <button
            onClick={onStart}
            className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-pink-400/30"
          >
            🚀 ゲーム開始
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
