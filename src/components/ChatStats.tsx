import React, { useState, useRef, useEffect } from 'react';

interface ChatStatsProps {
  stats: Usage;
  onClose: () => void;
}

export interface Usage {
  promptTokens: number;
  completionTokens: number;
  prefillSpeed: number;
  decodingSpeed: number;
}


const ChatStats: React.FC<ChatStatsProps> = ({ stats, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 100 }); 
  const statsRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const shouldShowStats = Object.values(stats).some(value => value !== 0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (statsRef.current) {
      const rect = statsRef.current.getBoundingClientRect();
      offsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsDragging(true);
    }
  };

  if (!shouldShowStats) {
    return null;
  }

  return (
    <div
      ref={statsRef}
      className="fixed border-[var(--border-color)] border-[1.5px] rounded-lg bg-[var(--bg-color)] text-white font-mono text-sm overflow-hidden"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div 
        className="p-2 cursor-move select-none bg-[var(--bg-color)] border-b border-[var(--border-color)] flex justify-between items-center"
        onMouseDown={handleMouseDown}
      >
        <span className="font-bold">Chat Stats</span>
        <button
          className="text-gray-400 hover:text-white transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="p-4">
        <div className="table">
          <div className="table-row">
            <div className="table-cell pr-4">Prompt:</div>
            <div className="table-cell">{Math.round(stats.promptTokens || 0)}</div>
          </div>
          <div className="table-row">
            <div className="table-cell pr-4">Completion:</div>
            <div className="table-cell">{Math.round(stats.completionTokens || 0)}</div>
          </div>
          <div className="table-row">
            <div className="table-cell pr-4">Total:</div>
            <div className="table-cell">{Math.round((stats.promptTokens || 0) + (stats.completionTokens || 0))}</div>
          </div>
          <div className="table-row">
            <div className="table-cell pr-4">Prefill:</div>
            <div className="table-cell">{Math.round(stats.prefillSpeed || 0)} tok/s</div>
          </div>
          <div className="table-row">
            <div className="table-cell pr-4">Decoding:</div>
            <div className="table-cell">{Math.round(stats.decodingSpeed || 0)} tok/s</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatStats;