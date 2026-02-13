
import React, { useState, useCallback, useEffect } from 'react';
import { GameStage, CatType, GameState, MissionType } from './types';
import { MISSIONS, CAT_STATS, ENDINGS } from './constants';
import DiceRoller from './components/DiceRoller';
import ProgressBar from './components/ProgressBar';
import Typewriter from './components/Typewriter';
import ThinkingAssistant from './components/ThinkingAssistant';
import ImageEditor from './components/ImageEditor';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    catType: null,
    currentMissionIndex: 0,
    results: [],
    stage: GameStage.START
  });

  const [isRolling, setIsRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastBonus, setLastBonus] = useState(0);
  const [paws, setPaws] = useState<{id: number, x: number, y: number}[]>([]);
  const [hearts, setHearts] = useState<{id: number, x: number}[]>([]);

  const triggerPawEffect = useCallback((x: number, y: number) => {
    const newPaw = { id: Date.now(), x, y };
    setPaws(prev => [...prev, newPaw]);
    setTimeout(() => {
      setPaws(prev => prev.filter(p => p.id !== newPaw.id));
    }, 1000);
  }, []);

  const spawnHearts = useCallback(() => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100
    }));
    setHearts(prev => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 3000);
  }, []);

  const startSelecting = () => {
    setGameState(prev => ({ ...prev, stage: GameStage.CHARACTER_SELECT }));
  };

  const selectCat = (type: CatType) => {
    setGameState(prev => ({ 
      ...prev, 
      catType: type, 
      stage: GameStage.MISSION 
    }));
  };

  const currentMission = MISSIONS[gameState.currentMissionIndex];

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    setRollResult(null);
    setShowResult(false);
  };

  const onRollComplete = useCallback((value: number) => {
    setIsRolling(false);
    const bonus = gameState.catType ? (CAT_STATS[gameState.catType] as any)[currentMission.bonusAttribute] || 0 : 0;
    setLastBonus(bonus);
    setRollResult(value);
    
    const isSuccess = gameState.currentMissionIndex === 4 || (value + bonus) >= currentMission.difficulty;
    
    if (isSuccess) spawnHearts();

    setTimeout(() => {
      setShowResult(true);
      setGameState(prev => ({
        ...prev,
        results: [...prev.results, isSuccess]
      }));
    }, 500);
  }, [gameState.catType, currentMission, gameState.currentMissionIndex, spawnHearts]);

  const handleChoice = (index: number) => {
    const isSuccess = index === currentMission.correctOption;
    if (isSuccess) spawnHearts();
    setShowResult(true);
    setGameState(prev => ({
      ...prev,
      results: [...prev.results, isSuccess]
    }));
  };

  const nextMission = () => {
    if (gameState.currentMissionIndex < MISSIONS.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentMissionIndex: prev.currentMissionIndex + 1
      }));
      setShowResult(false);
      setRollResult(null);
    } else {
      setGameState(prev => ({
        ...prev,
        stage: GameStage.ENDING
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      catType: null,
      currentMissionIndex: 0,
      results: [],
      stage: GameStage.START
    });
    setShowResult(false);
    setRollResult(null);
  };

  const successCount = gameState.results.filter(r => r).length;

  const handleGlobalClick = (e: React.MouseEvent) => {
    triggerPawEffect(e.clientX, e.clientY);
  };

  const renderStart = () => (
    <div className="flex flex-col items-center text-center p-6 space-y-6">
      <h1 className="text-5xl font-game text-brown-800 drop-shadow-md">🐱 侦探喵的情人节任务 💝</h1>
      <p className="text-xl text-brown-600 font-handwriting">一个充满爱与谜题的冒险</p>
      
      <div className="notebook-page max-w-lg w-full p-8 rounded-lg rotate-1 transform shadow-2xl border-l-8 border-brown-700">
        <h2 className="text-2xl font-game text-brown-700 mb-6 border-b-2 border-brown-100 pb-2">【案卷：#20250214】</h2>
        <Typewriter 
          text="原本约定好要来送情人节礼物的 YYQ 突然失踪了！作为一名专业的侦探猫，你需要集齐线索，找到失踪的YYQ并唤醒他..." 
          className="text-brown-800 leading-relaxed text-lg mb-8 h-24"
        />
        <div className="bg-pink-100 p-4 rounded-md text-pink-700 text-sm font-bold mb-8 transform -rotate-2">
          ⚠️ 提示：至少成功完成 3 个任务才能解救YYQ！
        </div>
        <button 
          onClick={startSelecting}
          className="w-full bg-brown-700 hover:bg-brown-800 text-[#FDF5E6] font-game text-2xl py-4 px-12 rounded shadow-lg transition-all duration-300"
        >
          打开案卷
        </button>
      </div>
    </div>
  );

  const renderCharacterSelect = () => (
    <div className="flex flex-col items-center text-center p-6 space-y-8">
      <h2 className="text-4xl font-game text-brown-800">【指派侦探猫】</h2>
      <div className="flex flex-col md:flex-row gap-8 max-w-4xl w-full">
        {Object.entries(CAT_STATS).map(([type, stats]) => (
          <div 
            key={type}
            onClick={() => selectCat(type as CatType)}
            className="flex-1 notebook-page rounded-xl p-8 border-t-8 border-brown-600 hover:scale-105 transition-all cursor-pointer shadow-xl group hover:shadow-brown-200"
          >
            <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{stats.icon}</div>
            <h3 className="text-3xl font-game text-brown-700 mb-2">{type}</h3>
            <p className="text-gray-700 mb-4 text-lg font-handwriting">{stats.description}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMission = () => {
    const isSuccess = gameState.results[gameState.currentMissionIndex];
    return (
      <div className="flex flex-col items-center max-w-2xl w-full p-4 space-y-6">
        <div className="w-full flex justify-between items-center mb-2">
          <ProgressBar total={MISSIONS.length} current={gameState.currentMissionIndex} results={gameState.results} />
          <div className="bg-brown-700 px-4 py-1 rounded text-[#FDF5E6] font-game shadow-md text-sm">
            侦探: {gameState.catType} {CAT_STATS[gameState.catType!].icon}
          </div>
        </div>

        <div className="notebook-page w-full p-8 rounded-lg border-l-4 border-brown-500 shadow-xl relative">
          {!showResult ? (
            <div className="animate-fadeIn pl-6">
              <h2 className="text-3xl font-game text-brown-800 mb-4 flex items-center gap-2">
                <span className="text-brown-400 text-sm">Case #{currentMission.id}</span>
                {currentMission.title}
              </h2>
              
              <div className="flex gap-4 mb-6">
                <span className="bg-amber-50 text-brown-600 px-3 py-1 rounded border border-brown-200 text-xs font-bold">技能: {currentMission.skill}</span>
                <span className="bg-amber-50 text-brown-600 px-3 py-1 rounded border border-brown-200 text-xs font-bold">难度: {currentMission.difficulty}</span>
              </div>

              <Typewriter text={currentMission.description} className="text-gray-800 text-lg leading-relaxed mb-8 h-28" />

              {currentMission.type === MissionType.DICE ? (
                <div className="flex flex-col items-center space-y-6">
                  <DiceRoller onRollComplete={onRollComplete} isRolling={isRolling} />
                  <div className="text-center w-full">
                    <button 
                      onClick={handleRoll}
                      disabled={isRolling}
                      className="w-full bg-brown-700 hover:bg-brown-800 text-[#FDF5E6] font-game text-2xl py-4 rounded shadow-lg transition-all disabled:opacity-50"
                    >
                      {isRolling ? '检定中...' : '掷出侦探之魂'}
                    </button>
                    <ThinkingAssistant context={`Current Mission: ${currentMission.title}. Goal: ${currentMission.description}. Logic Difficulty: ${currentMission.difficulty}.`} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {currentMission.options?.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleChoice(i)}
                      className="bg-[#FDF5E6]/30 hover:bg-pink-50 text-brown-800 text-left p-4 rounded border-2 border-brown-100 font-handwriting text-xl transition-all hover:border-pink-300 shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                  <ThinkingAssistant context={`Task: Deduction. Options: ${currentMission.options?.join(', ')}. Hint: It's the most private place.`} />
                </div>
              )}
            </div>
          ) : (
            <div className="animate-fadeIn pl-6">
              <h3 className={`text-4xl font-game mb-6 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {isSuccess ? '🎉 线索突破！' : '💫 陷入僵局'}
              </h3>
              
              {currentMission.type === MissionType.DICE && rollResult !== null && (
                <div className="mb-6 p-4 bg-brown-50 border border-brown-100 rounded flex items-center justify-between">
                  <span className="text-brown-700 font-bold">D20结果: {rollResult} {lastBonus > 0 && `(+${lastBonus} 属性)`}</span>
                  <span className="text-brown-500 text-xs">所需: {currentMission.difficulty}</span>
                </div>
              )}

              <p className="text-gray-800 text-lg leading-relaxed mb-8 font-handwriting">
                {isSuccess ? currentMission.successText : currentMission.failureText}
              </p>

              <button 
                onClick={nextMission}
                className="w-full bg-brown-700 hover:bg-brown-800 text-[#FDF5E6] font-game text-2xl py-4 rounded shadow-lg transition-all"
              >
                记录并继续
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderEnding = () => {
    let ending = ENDINGS.WARM;
    if (successCount === 5) ending = ENDINGS.PERFECT;
    else if (successCount >= 3) ending = ENDINGS.SUCCESS;

    return (
      <div className="flex flex-col items-center text-center max-w-3xl w-full p-6 space-y-10 animate-fadeIn">
        <div className="notebook-page p-12 rounded-lg shadow-2xl border-t-8 border-pink-400 relative overflow-hidden">
          <div className="text-8xl mb-6 animate-bounce">{ending.icon}</div>
          <h2 className="text-4xl font-game text-brown-800 mb-6">{ending.title}</h2>
          
          <div className="notebook-paper p-8 text-left mb-8 shadow-inner border border-brown-100">
            <p className="text-brown-900 text-2xl font-handwriting leading-loose">
              {ending.text.replace('{猫咪类型}', gameState.catType || '侦探喵')}
            </p>
          </div>

          <p className="text-pink-600 text-2xl mb-12 font-handwriting">
            "爱，就是愿意为对方解开所有谜题"
          </p>

          <div className="space-y-8 flex flex-col items-center">
            <ImageEditor />
            
            <button 
              onClick={resetGame}
              className="bg-brown-700 hover:bg-brown-800 text-[#FDF5E6] font-game text-xl py-4 px-12 rounded shadow-lg transition-all"
            >
              再次开始冒险
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FDF5E6] selection:bg-pink-200"
      onClick={handleGlobalClick}
    >
      {/* Paws */}
      {paws.map(paw => (
        <div 
          key={paw.id} 
          className="paw-print animate-paw text-3xl opacity-50"
          style={{ left: paw.x - 15, top: paw.y - 15 }}
        >
          🐾
        </div>
      ))}

      {/* Heart Particles */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="fixed bottom-0 text-pink-500 text-2xl pointer-events-none animate-bounce"
          style={{ 
            left: `${heart.x}%`, 
            animation: `float-up ${2 + Math.random() * 2}s linear forwards` 
          }}
        >
          ❤️
        </div>
      ))}

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
      `}</style>

      <main className="w-full flex justify-center py-10 z-10">
        {gameState.stage === GameStage.START && renderStart()}
        {gameState.stage === GameStage.CHARACTER_SELECT && renderCharacterSelect()}
        {gameState.stage === GameStage.MISSION && renderMission()}
        {gameState.stage === GameStage.ENDING && renderEnding()}
      </main>

      <footer className="w-full text-center py-6 text-brown-400 font-medium text-sm">
        © 2025 侦探喵的情人节特别行动 | 情人节快乐 💝
      </footer>
    </div>
  );
};

export default App;
