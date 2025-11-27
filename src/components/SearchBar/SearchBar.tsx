import { useCallback, useEffect, useState } from 'react';

import { useBuildingStore } from '../../store/useBuildingStore';
import { ClearIcon } from '../Icons/ClearIcon';
import { SearchIcon } from '../Icons/SearchIcon';

export function SearchBar() {
  const setSearchQuery = useBuildingStore((state) => state.setSearchQuery);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
  }, [setSearchQuery]);

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleSearch}
        placeholder="Search POIs by name or category"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
      />
      <SearchIcon />

      {inputValue && (
        <button
          onClick={handleClearSearch}
          className="absolute top-1/2 right-10 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}
