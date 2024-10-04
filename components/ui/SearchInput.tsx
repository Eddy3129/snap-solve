// components/ui/SearchInput.tsx

'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query) return;

    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search location..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-input border border-neonPink text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neonBlue"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 p-2 text-neonPink hover:text-neonBlue focus:outline-none"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};
