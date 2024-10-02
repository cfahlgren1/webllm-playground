import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import ModelSearch from './ModelSearch/ModelSearch';
import { modelDetailsList } from '../utils/llm';

interface ModelSelectorProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onModelLoad: () => void;
  isModelLoaded: boolean;
  availableModels: string[];
  loadProgress: string;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  selectedModel, 
  setSelectedModel, 
  onModelLoad, 
  isModelLoaded, 
  availableModels,
  loadProgress 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Find the icon for the selected model
  const selectedModelDetails = modelDetailsList.find(model => selectedModel.toLowerCase().includes(model.name));
  const SelectedModelIcon = selectedModelDetails ? selectedModelDetails.icon : null;

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openModal();
      } else if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openModal, closeModal, isModalOpen]);

  return (
    <div className="border-[var(--border-color)] border-[1.5px] rounded-lg bg-[var(--bg-color)] shadow-md p-4 mb-4 mx-auto w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Models</h2>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
        <button
          onClick={openModal}
          className="flex-grow p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] bg-[var(--bg-color)] text-gray-300 flex justify-between items-center"
        >
          <div className="flex items-center">
            {SelectedModelIcon && <SelectedModelIcon className="w-5 h-5 mr-2" />}
            <span>{selectedModel}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">⌘K</span>
            <ChevronDown className="h-5 w-5" />
          </div>
        </button>
        <button
          onClick={onModelLoad}
          disabled={isModelLoaded}
          className="px-4 py-2 border-[var(--border-color)] border-[1.5px] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isModelLoaded ? 'Loaded' : 'Load Model'}
        </button>
      </div>
      {!isModelLoaded && (
        <p className="mt-2 text-xs italic text-gray-400">
          First download may take a little bit. Subsequent loads will read from cache.
        </p>
      )}
      {loadProgress && (
        <div className="mt-2 text-sm text-gray-400">{loadProgress}</div>
      )}
      <ModelSearch
        isOpen={isModalOpen}
        onClose={closeModal}
        availableModels={availableModels}
        onSelectModel={setSelectedModel}
      />
    </div>
  );
};

export default ModelSelector;