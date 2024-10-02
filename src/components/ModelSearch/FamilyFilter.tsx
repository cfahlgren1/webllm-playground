import React from 'react';

interface FamilyFilterProps {
  sortedModelFamilies: [string, { name: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }][];
  selectedFamilies: string[];
  onToggleFamilyFilter: (family: string) => void;
}

const FamilyFilter: React.FC<FamilyFilterProps> = ({
  sortedModelFamilies,
  selectedFamilies,
  onToggleFamilyFilter,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {sortedModelFamilies.map(([key, { name, icon: Icon }]) => (
        <button
          key={key}
          onClick={() => onToggleFamilyFilter(key)}
          className={`flex items-center px-3 py-1.5 rounded-md border-2 transition-colors duration-200 ${
            selectedFamilies.includes(key)
              ? 'bg-[var(--border-color)] border-[var(--border-color)] text-white'
              : 'bg-[var(--bg-color)] border-gray-700 text-gray-300 hover:border-[var(--border-color)]'
          }`}
        >
          <Icon className={`mr-2 ${key === 'llama' ? 'w-4 h-4' : 'w-5 h-5'}`} />
          {name}
        </button>
      ))}
    </div>
  );
};

export default FamilyFilter;
