import clsx from 'clsx';

import { useBuildingStore } from '../store/useBuildingStore';

export function FloorSelector() {
  const floors = useBuildingStore((state) => state.floors);
  const selectedFloorId = useBuildingStore((state) => state.selectedFloorId);
  const setSelectedFloorId = useBuildingStore((state) => state.setSelectedFloorId);

  if (floors.length === 0) {
    return null;
  }

  const sortedFloors = [...floors].sort((a, b) => b.level - a.level);

  const handleChangeFloor = (floorId: number | null) => {
    setSelectedFloorId(floorId);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-light text-gray-700">Filter by Floor</label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedFloorId(null)}
          className={clsx(
            'cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            {
              'bg-blue-600 text-white shadow-sm': selectedFloorId === null,
              'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50':
                selectedFloorId !== null,
            }
          )}
        >
          All Floors
        </button>

        {sortedFloors.map((floor) => (
          <button
            key={floor.id}
            onClick={() => handleChangeFloor(floor.id)}
            className={clsx(
              'cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              {
                'bg-blue-600 text-white shadow-sm': selectedFloorId === floor.id,
                'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50':
                  selectedFloorId !== floor.id,
              }
            )}
            title={`Floor ${floor.level}: ${floor.name}`}
          >
            {floor.name ? floor.name : `Floor ${floor.level}`}
          </button>
        ))}
      </div>
    </div>
  );
}
