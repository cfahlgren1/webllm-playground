import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ModelRowProps {
  baseModel: string;
  variants: string[];
  isExpanded: boolean;
  hasSingleVariant: boolean;
  determineModelIcon: (model: string) => JSX.Element;
  extractModelDetails: (model: string) => { displayName: string; quantBadge: string | null };
  onSelectModel: (model: string) => void;
  onClose: () => void;
  handleToggleExpand: (modelName: string) => void;
}

const ModelRow: React.FC<ModelRowProps> = ({
  baseModel,
  variants,
  isExpanded,
  hasSingleVariant,
  determineModelIcon,
  extractModelDetails,
  onSelectModel,
  onClose,
  handleToggleExpand,
}) => {
  const { quantBadge } = hasSingleVariant ? extractModelDetails(variants[0]) : { quantBadge: null };

  return (
    <div className="flex flex-col bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg overflow-hidden" key={baseModel}>
      <div 
        className="p-3 hover:bg-gray-800 transition-colors duration-200 group cursor-pointer"
        onClick={() => {
          if (hasSingleVariant) {
            onSelectModel(variants[0]);
            onClose();
          } else {
            handleToggleExpand(baseModel);
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {determineModelIcon(baseModel)}
            <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors ml-2">
              {baseModel}
            </span>
            {hasSingleVariant && quantBadge && (
              <span className="ml-2 truncate px-1.5 py-0.5 bg-gray-700 text-gray-300 text-[10px] rounded-full">
                {quantBadge}
              </span>
            )}
          </div>
          {!hasSingleVariant && (
            isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>
      {isExpanded && !hasSingleVariant && (
        <div className="bg-gray-800 p-2 space-y-1">
          {variants.map(variant => {
            const { quantBadge } = extractModelDetails(variant);
            return (
              <div
                key={variant}
                onClick={() => {
                  onSelectModel(variant);
                  onClose();
                }}
                className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer"
              >
                <span className="text-xs text-gray-300 truncate flex-grow mr-2">{quantBadge || variant}</span>
                <button className="text-xs text-blue-400 hover:text-blue-300 whitespace-nowrap">Select</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModelRow;
