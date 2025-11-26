import { useEffect } from 'react';

import { situmService } from '../services/situm.service';
import { useBuildingStore } from '../store/useBuildingStore';

export function useBuildingData(buildingId: number) {
  const setBuilding = useBuildingStore((state) => state.setBuilding);
  const setFloors = useBuildingStore((state) => state.setFloors);
  const setPois = useBuildingStore((state) => state.setPois);
  const setLoading = useBuildingStore((state) => state.setLoading);
  const setError = useBuildingStore((state) => state.setError);
  const setSelectedFloorId = useBuildingStore((state) => state.setSelectedFloorId);

  const isLoading = useBuildingStore((state) => state.isLoading);
  const error = useBuildingStore((state) => state.error);

  useEffect(() => {
    let isMounted = true;

    async function loadBuildingData() {
      if (!buildingId) return;

      setLoading(true);
      setError(null);

      try {
        const { building, floors, pois } = await situmService.getBuildingData(buildingId);

        if (isMounted) {
          setBuilding(building);
          setFloors(Array.from(floors));
          setSelectedFloorId(floors[0]?.id ?? null);
          setPois(pois);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load building data';
          setError(errorMessage);
          setLoading(false);
        }
      }
    }

    loadBuildingData();

    return () => {
      isMounted = false;
    };
  }, [buildingId, setBuilding, setFloors, setPois, setLoading, setError]);

  return { isLoading, error };
}
