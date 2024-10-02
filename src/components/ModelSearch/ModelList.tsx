import React from 'react';

interface ModelListProps {
  filteredModels: [string, string[]][];
  renderModelRow: (model: [string, string[]], index: number) => React.ReactNode;
}

const ModelList: React.FC<ModelListProps> = ({ filteredModels, renderModelRow }) => {
  const columns: React.ReactNode[][] = [[], [], []];
  
  for (const [index, model] of filteredModels.entries()) {
    const columnIndex = index % 3;
    columns[columnIndex].push(renderModelRow(model, index));
  }

  return (
    <div className="overflow-y-auto flex-grow p-4 custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {columns.map((column, index) => (
          <div key={index} className="flex flex-col space-y-3">
            {column}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelList;