import clsx from 'clsx';

import { useBuildingStore } from '../store/useBuildingStore';

export function SearchBar() {
  const searchQuery = useBuildingStore((state) => state.searchQuery);
  const setSearchQuery = useBuildingStore((state) => state.setSearchQuery);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search POIs by name, description, or category..."
        className={clsx(
          'w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 text-sm',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
        )}
      />
      <svg
        className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute top-1/2 right-10 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
