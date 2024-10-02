import React, { useState, useRef, useEffect } from 'react';

interface InputAreaProps {
  onSendMessage: (input: string) => Promise<void>;
  isGenerating: boolean;
  isModelLoaded: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, isGenerating, isModelLoaded }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() && !isGenerating && isModelLoaded) {
      onSendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (!isGenerating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGenerating]);

  const isSendDisabled = !isModelLoaded || isGenerating || !input.trim();

  return (
    <div className="border-[var(--border-color)] border-[1.5px] rounded-lg bg-[var(--bg-color)] w-full max-w-2xl mx-auto p-4 mb-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isModelLoaded ? "Type a message..." : "Select and load a model from the menu to start."}
          disabled={!isModelLoaded || isGenerating}
          className="flex-grow p-3 rounded-lg bg-[var(--bg-color)] focus:outline-none focus:ring-2 focus:[var(--border-color)] text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onKeyPress={(e) => e.key === 'Enter' && !isSendDisabled && handleSend()}
          ref={inputRef}
        />
        <button
          onClick={handleSend}
          disabled={isSendDisabled}
          className="px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:[var(--border-color)] focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputArea;