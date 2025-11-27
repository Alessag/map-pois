import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { BuildingStore } from '../../store/useBuildingStore';
import { createMockStoreState, mockFloors, mockPois } from '../../test/mocks';

import { Sidebar } from './Sidebar';

vi.mock('../../store/useBuildingStore', () => {
  return {
    useBuildingStore: (selector: (state: BuildingStore) => unknown) =>
      selector(
        createMockStoreState({
          pois: mockPois,
          floors: mockFloors,
        }) as BuildingStore
      ),
  };
});

describe('Sidebar', () => {
  test('should render sidebar with title and POI count', () => {
    const { getByText } = render(<Sidebar />);

    const title = getByText('Points of Interest');
    const poiCount = getByText(`${mockPois.length} POIs`);

    expect(title).toBeInTheDocument();
    expect(poiCount).toBeInTheDocument();
  });

  test('should render all child components', () => {
    const { getByPlaceholderText, getByText } = render(<Sidebar />);

    const searchBar = getByPlaceholderText('Search POIs by name or category');
    const floorSelector = getByText('All Floors');

    expect(searchBar).toBeInTheDocument();
    expect(floorSelector).toBeInTheDocument();
  });
});
