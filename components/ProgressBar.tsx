
import React from 'react';

interface ProgressBarProps {
  total: number;
  current: number;
  results: boolean[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ total, current, results }) => {
  return (
    <div className="flex items-center space-x-2 mb-6">
      {Array.from({ length: total }).map((_, i) => {
        let color = 'bg-gray-200';
        if (i < current) {
          color = results[i] ? 'bg-green-400' : 'bg-red-400';
        } else if (i === current) {
          color = 'bg-pink-400 animate-pulse ring-2 ring-pink-200';
        }
        
        return (
          <div 
            key={i} 
            className={`h-4 w-4 rounded-full transition-all duration-500 ${color}`}
          />
        );
      })}
    </div>
  );
};

export default ProgressBar;
