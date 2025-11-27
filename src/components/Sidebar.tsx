import { useBuildingStore } from '../store/useBuildingStore';

import { FloorSelector } from './FloorSelector/FloorSelector';
import { POIList } from './POIList/POIList';
import { SearchBar } from './SearchBar/SearchBar';

export function Sidebar() {
  const pois = useBuildingStore((state) => state.pois);

  return (
    <aside className="flex w-96 flex-col gap-4 border-r bg-white p-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Points of Interest</h2>
        <p className="text-sm text-gray-600">{pois.length} POIs</p>
      </div>
      <SearchBar />
      <FloorSelector />
      <div className="border-t border-gray-200"></div>
      <POIList />
    </aside>
  );
}
