import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const SearchInput: React.FC<SearchInputProps> = ({ searchTerm, setSearchTerm, inputRef }) => {
  return (
    <div className="relative mb-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search models..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 pl-8 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--border-color)] transition-all"
      />
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    </div>
  );
};

export default SearchInput;
