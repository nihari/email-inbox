import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Memoize to prevent re-renders when parent re-renders but props haven't changed
export const SearchBar: React.FC<SearchBarProps> = React.memo(({ searchQuery, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search emails..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

