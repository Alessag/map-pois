import type { Building, Floor, Poi } from '@situm/sdk-js';
import { create } from 'zustand';

interface BuildingStore {
  // Data state
  building: Building | null;
  floors: Floor[];
  pois: Poi[];

  // UI state
  selectedPoiId: number | null;
  selectedFloorId: number | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setBuilding: (building: Building) => void;
  setFloors: (floors: Floor[]) => void;
  setPois: (pois: Poi[]) => void;
  setSelectedPoiId: (id: number | null) => void;
  setSelectedFloorId: (id: number | null) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Computed/derived data
  getFilteredPois: () => Poi[];
  getFloorById: (floorId: number) => Floor | undefined;
  getPoiById: (poiId: number) => Poi | undefined;
}

const initialState = {
  building: null,
  floors: [],
  pois: [],
  selectedPoiId: null,
  selectedFloorId: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

let lastPois: Poi[] = initialState.pois;
let lastSelectedFloorId: number | null = initialState.selectedFloorId;
let lastSearchQuery: string = initialState.searchQuery;
let lastFilteredPois: Poi[] = initialState.pois;

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  ...initialState,

  // Actions
  setBuilding: (building) => set({ building }),
  setFloors: (floors) => set({ floors }),
  setPois: (pois) => set({ pois }),
  setSelectedPoiId: (id) => set({ selectedPoiId: id }),
  setSelectedFloorId: (id) => set({ selectedFloorId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),

  // Computed/derived data
  getFilteredPois: () => {
    const { pois, selectedFloorId, searchQuery } = get();

    if (
      pois === lastPois &&
      selectedFloorId === lastSelectedFloorId &&
      searchQuery === lastSearchQuery
    ) {
      return lastFilteredPois;
    }

    let filtered = pois;

    // Filter by floor
    if (selectedFloorId !== null) {
      filtered = filtered.filter((poi) => poi.floorId === selectedFloorId);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (poi) => poi.name.toLowerCase().includes(query)
        //||
        // poi.description?.toLowerCase().includes(query) ||
        // poi.category?.name.toLowerCase().includes(query)
      );
    }

    lastPois = pois;
    lastSelectedFloorId = selectedFloorId;
    lastSearchQuery = searchQuery;
    lastFilteredPois = filtered;

    return filtered;
  },

  getFloorById: (floorId) => {
    return get().floors.find((floor) => floor.id === floorId);
  },

  getPoiById: (poiId) => {
    return get().pois.find((poi) => poi.id === poiId);
  },

  getBuilding: () => {
    return get().building;
  },
}));
