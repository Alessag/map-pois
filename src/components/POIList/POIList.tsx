import { useEffect, useRef } from 'react';

import { useBuildingStore } from '../../store/useBuildingStore';

import { POIListItem } from './POIListItem';

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
