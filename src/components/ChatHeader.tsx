import React, { ComponentType } from 'react';

interface ChatHeaderProps {
  selectedModel: string;
  SelectedModelIcon: ComponentType<React.SVGProps<SVGSVGElement>> | null;
  onClearChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedModel, SelectedModelIcon, onClearChat }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-[var(--bg-color)] border-b border-[var(--border-color)]">
      <div className="flex items-center">
        {SelectedModelIcon && <SelectedModelIcon className="w-6 h-6 mr-2" />}
        <span className="text-lg font-semibold text-gray-100">{selectedModel}</span>
      </div>
      <button
        onClick={onClearChat}
        className="p-2 bg-transparent text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] rounded"
        aria-label="Clear Chat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </header>
  );
};

export default ChatHeader;
