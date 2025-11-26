import { forwardRef, useEffect, useRef } from 'react';

import type { Poi } from '@situm/sdk-js';
import clsx from 'clsx';

import { useBuildingStore } from '../store/useBuildingStore';

interface POIListItemProps {
  poi: Poi;
  isSelected: boolean;
  onClick: () => void;
}

const POIListItem = forwardRef<HTMLLIElement, POIListItemProps>(
  ({ poi, isSelected, onClick }, ref) => {
    const floor = useBuildingStore((state) => state.getFloorById(poi.floorId));

    return (
      <li
        onClick={onClick}
        ref={ref}
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
);

POIListItem.displayName = 'POIListItem';

export function POIList() {
  const pois = useBuildingStore((state) => state.getFilteredPois());
  const selectedPoiId = useBuildingStore((state) => state.selectedPoiId);
  const setSelectedPoiId = useBuildingStore((state) => state.setSelectedPoiId);

  const itemRefs = useRef<Map<number, HTMLLIElement>>(new Map());

  useEffect(() => {
    if (selectedPoiId === null) return;

    const element = itemRefs.current.get(selectedPoiId);

    if (!element) return;

    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [pois, selectedPoiId]);

  if (pois.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 p-8 text-center">
        <p className="mt-2 text-sm text-gray-600">No POIs found</p>
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
            ref={(el) => {
              if (el) {
                itemRefs.current.set(poi.id, el);
              } else {
                itemRefs.current.delete(poi.id);
              }
            }}
          />
        ))}
      </ul>
    </div>
  );
}
