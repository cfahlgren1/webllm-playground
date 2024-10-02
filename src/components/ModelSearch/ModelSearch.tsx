import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Cpu } from 'lucide-react';
import SearchInput from './SearchInput';
import FamilyFilter from './FamilyFilter';
import ModelList from './ModelList';
import ModelRow from './ModelRow';
import { modelDetailsList } from '../../utils/llm';

export interface ModelSearchProps {
  isOpen: boolean;
  onClose: () => void;
  availableModels: string[];
  onSelectModel: (model: string) => void;
}

const modelFamilies: { [key: string]: { name: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> } } = {};

for (const modelDetail of modelDetailsList) {
  modelFamilies[modelDetail.name] = {
    name: modelDetail.name.charAt(0).toUpperCase() + modelDetail.name.slice(1),
    icon: modelDetail.icon
  };
}

const ModelSearch: React.FC<ModelSearchProps> = ({
  isOpen,
  onClose,
  availableModels,
  onSelectModel,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModels, setFilteredModels] = useState<[string, string[]][]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [expandedModels, setExpandedModels] = useState<Set<string>>(new Set());

  const determineModelIcon = (model: string) => {
    const modelDetail = modelDetailsList.find(md => model.toLowerCase().includes(md.name));
    return modelDetail ? <modelDetail.icon className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" />
                       : <Cpu className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" />;
  };

  const identifyModelFamily = (model: string): string | null => {
    return modelDetailsList.find(md => model.toLowerCase().includes(md.name))?.name || null;
  };

  const extractModelDetails = (model: string) => {
    const parts = model.split('-');
    const displayName: string[] = [];
    const quantBadges: string[] = [];
    let isBadge = false;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (isBadge || part.startsWith('q') || part.startsWith('b')) {
        isBadge = true;
        if (part !== 'MLC') {
          quantBadges.push(part);
        }
      } else {
        displayName.push(part);
      }
    }

    return {
      displayName: displayName.join(' '),
      quantBadge: quantBadges.length > 0 ? quantBadges.join('-') : null,
    };
  };

  const sortAndGroupModels = useCallback((models: string[]): [string, string[]][] => {
    const groupedModels: { [key: string]: string[] } = {};

    for (const model of models) {
      const { displayName } = extractModelDetails(model);
      const family = identifyModelFamily(model);

      if (family) {
        if (!groupedModels[displayName]) {
          groupedModels[displayName] = [];
        }
        groupedModels[displayName].push(model);
      }
    }

    for (const key in groupedModels) {
      groupedModels[key].sort((a, b) => a.localeCompare(b));
    }

    return Object.entries(groupedModels).sort(([, aVariants], [, bVariants]) => {
      const familyA = identifyModelFamily(aVariants[0]) || '';
      const familyB = identifyModelFamily(bVariants[0]) || '';
      return familyA.localeCompare(familyB);
    });
  }, []);

  const handleToggleExpand = (modelName: string) => {
    setExpandedModels(prev => {
      const updatedSet = new Set<string>(prev);
      if (updatedSet.has(modelName)) {
        updatedSet.delete(modelName);
      } else {
        updatedSet.add(modelName);
      }
      return updatedSet;
    });
  };

  const resetState = useCallback(() => {
    setSearchTerm('');
    setSelectedFamilies([]);
    setExpandedModels(new Set());
  }, []);

  const handleClose = useCallback(() => {
    resetState();
    onClose();
  }, [onClose, resetState]);

  useEffect(() => {
    const sortedModels = sortAndGroupModels(availableModels);

    let filtered = sortedModels;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = sortedModels.filter(([baseModel, variants]) =>
        baseModel.toLowerCase().includes(lowerSearchTerm) ||
        variants.some(v => v.toLowerCase().includes(lowerSearchTerm))
      );
    }

    if (selectedFamilies.length > 0) {
      filtered = filtered.filter(([, variants]) => {
        const family = identifyModelFamily(variants[0]);
        return family && selectedFamilies.includes(family);
      });
    }

    setFilteredModels(filtered);
  }, [searchTerm, availableModels, selectedFamilies, sortAndGroupModels]);

  const handleToggleFamilyFilter = (family: string) => {
    setSelectedFamilies(prev =>
      prev.includes(family)
        ? prev.filter(f => f !== family)
        : [...prev, family]
    );
  };

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus on the search input when the modal opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
      resetState();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, resetState]);

  if (!isOpen) return null;

  const countModelsPerFamily = (models: string[]): { [key: string]: number } => {
    const counts: { [key: string]: number } = {};
    for (const model of models) {
      const family = identifyModelFamily(model);
      if (family) {
        counts[family] = (counts[family] || 0) + 1;
      }
    }
    return counts;
  };

  const modelCounts = countModelsPerFamily(availableModels);
  const sortedModelFamilies = Object.entries(modelFamilies)
    .sort(([a], [b]) => (modelCounts[b] || 0) - (modelCounts[a] || 0));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden">
      <div className="bg-[var(--bg-color)] rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col shadow-xl overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-semibold text-gray-100">Select Model</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 border-b border-[var(--border-color)]">
          <SearchInput 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            inputRef={searchInputRef}
          />
          <FamilyFilter
            sortedModelFamilies={sortedModelFamilies}
            selectedFamilies={selectedFamilies}
            onToggleFamilyFilter={handleToggleFamilyFilter}
          />
        </div>
        <ModelList
          filteredModels={filteredModels}
          renderModelRow={(model) => (
            <ModelRow
              key={model[0]}
              baseModel={model[0]}
              variants={model[1]}
              isExpanded={expandedModels.has(model[0])}
              hasSingleVariant={model[1].length === 1}
              determineModelIcon={determineModelIcon}
              extractModelDetails={extractModelDetails}
              onSelectModel={onSelectModel}
              onClose={onClose}
              handleToggleExpand={handleToggleExpand}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ModelSearch;