import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuildingStore } from '../../store/useBuildingStore';
import {
  createMockStoreState,
  mockBuilding,
  mockCategories,
  mockFloors,
  mockPois,
} from '../../test/mocks';

import { MapView } from './MapView';

vi.mock('../../store/useBuildingStore');

describe('MapView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders placeholder message when no building is selected', () => {
    vi.mocked(useBuildingStore).mockImplementation((selector) => {
      const state = createMockStoreState({
        building: null,
        floors: [],
        selectedFloorId: null,
      });

      return selector(state);
    });

    const { getByText } = render(<MapView />);

    const message = getByText('Select or load a building to view it on the map.');

    expect(message).toBeInTheDocument();
  });

  it('renders map container when building is available', () => {
    vi.mocked(useBuildingStore).mockImplementation((selector) => {
      const state = createMockStoreState({
        building: mockBuilding,
        floors: mockFloors,
        selectedFloorId: 1,
      });
      return selector(state);
    });

    const { container, queryByText } = render(<MapView />);

    const message = queryByText('Select or load a building to view it on the map.');
    const mapContainer = container.querySelector('div.h-full.w-full');

    expect(message).not.toBeInTheDocument();
    expect(mapContainer).toBeInTheDocument();
  });

  it('initializes maplibre Map with correct config when building exists', async () => {
    const maplibregl = await import('maplibre-gl');

    vi.mocked(useBuildingStore).mockImplementation((selector) => {
      const state = createMockStoreState({
        building: mockBuilding,
        floors: mockFloors,
        selectedFloorId: 1,
      });
      return selector(state);
    });

    render(<MapView />);

    expect(maplibregl.default.Map).toHaveBeenCalled();
    expect(maplibregl.default.NavigationControl).toHaveBeenCalled();
  });

  it('creates markers for POIs when they exist', async () => {
    const maplibregl = await import('maplibre-gl');

    vi.mocked(useBuildingStore).mockImplementation((selector) => {
      const state = createMockStoreState({
        building: mockBuilding,
        floors: mockFloors,
        selectedFloorId: 1,
        getFilteredPois: vi.fn(() => mockPois),
        getPoiCategoryById: vi.fn((id: number) => mockCategories.find((c) => c.id === id)),
      });
      return selector(state);
    });

    render(<MapView />);

    await vi.waitFor(() => {
      expect(maplibregl.default.Marker).toHaveBeenCalled();
    });
  });

  it('uses fallback icons when POI category is missing', async () => {
    const maplibregl = await import('maplibre-gl');

    vi.mocked(useBuildingStore).mockImplementation((selector) => {
      const state = createMockStoreState({
        building: mockBuilding,
        floors: mockFloors,
        selectedFloorId: 1,
        getFilteredPois: vi.fn(() => mockPois),
        getPoiCategoryById: vi.fn(() => undefined),
      });
      return selector(state);
    });

    render(<MapView />);

    await vi.waitFor(() => {
      expect(maplibregl.default.Marker).toHaveBeenCalled();
    });

    expect(maplibregl.default.Marker).toHaveBeenCalledTimes(mockPois.length);
  });
});
