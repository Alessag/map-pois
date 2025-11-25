import type { Poi } from '@situm/sdk-js';
import clsx from 'clsx';

import { useBuildingStore } from '../store/useBuildingStore';

interface POIListItemProps {
  poi: Poi;
  isSelected: boolean;
  onClick: () => void;
}

function POIListItem({ poi, isSelected, onClick }: POIListItemProps) {
  const floor = useBuildingStore((state) => state.getFloorById(poi.floorId));

  return (
    <li
      onClick={onClick}
      className={clsx(
        'cursor-pointer rounded-lg border p-3 transition-all',
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <h3 className={clsx('text-lg', isSelected && 'font-bold')}>{poi.name}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {poi.categoryName && (
              <span
                className={clsx(
                  'inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 transition-all',
                  isSelected && 'font-bold'
                )}
              >
                {poi.categoryName}
              </span>
            )}
            {floor && (
              <span
                className={clsx(
                  'inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700',
                  isSelected && 'font-bold'
                )}
              >
                {floor.name}
              </span>
            )}
          </div>
        </div>
        {isSelected && (
          <svg className="h-5 w-5 shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    </li>
  );
}

export function POIList() {
  const pois = useBuildingStore((state) => state.getFilteredPois());
  const selectedPoiId = useBuildingStore((state) => state.selectedPoiId);
  const setSelectedPoiId = useBuildingStore((state) => state.setSelectedPoiId);

  // const hasFilters = searchQuery.trim() !== '' || selectedFloorId !== null;

  if (pois.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {/* <p className="mt-2 text-sm text-gray-600">
            {hasFilters ? 'No POIs match your filters' : 'No POIs available'}
          </p>
          {hasFilters && (
            <p className="mt-1 text-xs text-gray-500">Try adjusting your search or floor filter</p>
          )} */}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <ul className="space-y-2">
        {pois.map((poi) => (
          <POIListItem
            key={poi.id}
            poi={poi}
            isSelected={poi.id === selectedPoiId}
            onClick={() => {
              setSelectedPoiId(poi.id);
            }}
          />
        ))}
      </ul>
    </div>
  );
}
