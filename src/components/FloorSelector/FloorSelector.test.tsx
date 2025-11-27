import { fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';

import type { BuildingStore } from '../../store/useBuildingStore';
import { mockFloors } from '../../test/fixtures';

import { FloorSelector } from './FloorSelector';

const mockSetSelectedFloorId = vi.fn();

vi.mock('../../store/useBuildingStore', () => {
  return {
    useBuildingStore: (selector: (state: BuildingStore) => unknown) =>
      selector({
        floors: mockFloors,
        selectedFloorId: null,
        setSelectedFloorId: mockSetSelectedFloorId,
      } as BuildingStore),
  };
});

describe('FloorSelector', () => {
  beforeEach(() => {
    mockSetSelectedFloorId.mockClear();
  });

  it('renders floor buttons and calls setter on click', () => {
    const { getByText, getByRole } = render(<FloorSelector />);

    const allFloors = getByText('All Floors');
    const groundFloor = getByText('Ground Floor');
    const firstFloor = getByText('First Floor');
    const basementFloor = getByText('Floor -1');

    expect(allFloors).toBeInTheDocument();
    expect(groundFloor).toBeInTheDocument();
    expect(firstFloor).toBeInTheDocument();
    expect(basementFloor).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'floor-2' }));

    expect(mockSetSelectedFloorId).toHaveBeenCalledWith(2);
  });
});
