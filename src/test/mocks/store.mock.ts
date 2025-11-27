import { vi } from 'vitest';

import type { BuildingStore } from '../../store/useBuildingStore';

import { mockBuilding } from './building.mock';
import { mockFloors } from './floor.mock';
import { mockCategories } from './poiCategory.mock';
import { mockPois } from './pois.mock';

export const createMockStoreState = (overrides?: Partial<BuildingStore>): BuildingStore => {
  const baseState: BuildingStore = {
    building: mockBuilding,
    floors: mockFloors,
    pois: mockPois,
    poiCategories: mockCategories,
    selectedPoiId: null,
    selectedFloorId: null,
    searchQuery: '',
    isLoading: false,
    error: null,
    setBuilding: vi.fn(),
    setFloors: vi.fn(),
    setPois: vi.fn(),
    setPoiCategories: vi.fn(),
    setSelectedPoiId: vi.fn(),
    setSelectedFloorId: vi.fn(),
    setSearchQuery: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    reset: vi.fn(),
    getFilteredPois: vi.fn(() => mockPois),
    getFloorById: vi.fn((id: number) => mockFloors.find((f) => f.id === id)),
    getPoiById: vi.fn((id: number) => mockPois.find((p) => p.id === id)),
    getPoiCategoryById: vi.fn((id: number) => mockCategories.find((c) => c.id === id)),
  };

  return {
    ...baseState,
    ...overrides,
  };
};
