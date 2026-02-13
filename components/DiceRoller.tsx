
import React, { useState, useEffect } from 'react';

interface DiceRollerProps {
  onRollComplete: (result: number) => void;
  isRolling: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete, isRolling }) => {
  const [displayValue, setDisplayValue] = useState(1);

  useEffect(() => {
    let interval: number | undefined;
    if (isRolling) {
      interval = window.setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 20) + 1);
      }, 50);
      
      const timeout = window.setTimeout(() => {
        const finalValue = Math.floor(Math.random() * 20) + 1;
        setDisplayValue(finalValue);
        clearInterval(interval);
        onRollComplete(finalValue);
      }, 1500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isRolling, onRollComplete]);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-pink-200 shadow-xl">
      <div 
        className={`w-24 h-24 bg-pink-500 rounded-xl shadow-2xl flex items-center justify-center text-4xl font-bold text-white transition-all duration-300 ${isRolling ? 'rotate-[720deg] scale-110' : 'scale-100'}`}
        style={{ clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)' }}
      >
        {displayValue}
      </div>
      <p className="mt-4 text-pink-700 font-game text-xl">D20 骰子</p>
    </div>
  );
};

export default DiceRoller;
