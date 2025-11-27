import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';

import { mockBuilding, mockCategories, mockFloors, mockPois } from '../test/mocks';

import { useBuildingStore } from './useBuildingStore';

describe('useBuildingStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBuildingStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('getFilteredPois', () => {
    test('should return all POIs when no filters applied', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
      });

      const filteredPois = result.current.getFilteredPois();

      expect(filteredPois).toHaveLength(mockPois.length);
      expect(filteredPois).toEqual(mockPois);
    });

    test('should filter POIs by selected floor ID', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
        result.current.setSelectedFloorId(1);
      });

      const filteredPois = result.current.getFilteredPois();

      expect(filteredPois).toHaveLength(2);
    });

    test('should filter POIs by name', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
        result.current.setSearchQuery('coffee');
      });

      const filteredPois = result.current.getFilteredPois();

      expect(filteredPois).toHaveLength(1);
      expect(filteredPois[0].name).toBe(mockPois[1].name);
    });

    test('should filter POIs category', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
        result.current.setSearchQuery('meeting');
      });

      const filteredPois = result.current.getFilteredPois();

      expect(filteredPois).toHaveLength(1);
      expect(filteredPois[0].name).toBe(mockPois[2].name);
      expect(filteredPois[0].categoryName).toBe(mockPois[2].categoryName);
    });

    test('should filter by floor and name', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
        result.current.setSelectedFloorId(1);
        result.current.setSearchQuery('entrance');
      });

      const filtered = result.current.getFilteredPois();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe(mockPois[0].name);
      expect(filtered[0].floorId).toBe(1);
    });

    test('should be case-insensitive when searching', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
        result.current.setSearchQuery('COFFEE');
      });

      const filtered = result.current.getFilteredPois();

      expect(filtered).toHaveLength(1);
      expect(filtered[0].name).toBe('Coffee Shop');
    });

    test('should return empty array when search query has no matches', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
        result.current.setSearchQuery('nonexistent');
      });

      const filtered = result.current.getFilteredPois();

      expect(filtered).toHaveLength(0);
    });
  });

  describe('lookup functions', () => {
    test('getFloorById should return correct floor', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setFloors(mockFloors);
      });

      const floor = result.current.getFloorById(1);

      expect(floor).toBeDefined();
      expect(floor?.id).toBe(1);
      expect(floor?.name).toBe('Ground Floor');
    });

    test('getFloorById should return undefined for non-existent ID', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setFloors(mockFloors);
      });

      const floor = result.current.getFloorById(999);

      expect(floor).toBeUndefined();
    });

    test('getPoiById should return correct POI', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
      });

      const poi = result.current.getPoiById(2);

      expect(poi).toBeDefined();
      expect(poi?.id).toBe(2);
      expect(poi?.name).toBe('Coffee Shop');
    });

    test('getPoiById should return undefined for non-existent ID', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
      });

      const poi = result.current.getPoiById(999);
      expect(poi).toBeUndefined();
    });

    test('getPoiCategoryById should return correct category', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPoiCategories(mockCategories);
      });

      const category = result.current.getPoiCategoryById(2);

      expect(category).toBeDefined();
      expect(category?.id).toBe(2);
    });

    test('getPoiCategoryById should return undefined for non-existent ID', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPoiCategories(mockCategories);
      });

      const category = result.current.getPoiCategoryById(999);

      expect(category).toBeUndefined();
    });
  });

  describe('state updates', () => {
    test('setSearchQuery should update search query', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setSearchQuery('test query');
      });

      expect(result.current.searchQuery).toBe('test query');
    });

    test('setSelectedPoiId should update selected POI', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setSelectedPoiId(10);
      });

      expect(result.current.selectedPoiId).toBe(10);
    });

    test('setBuilding should update building', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setBuilding(mockBuilding);
      });

      expect(result.current.building).toEqual(mockBuilding);
    });

    test('setFloors should update floors array', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setFloors(mockFloors);
      });

      expect(result.current.floors).toEqual(mockFloors);
      expect(result.current.floors).toHaveLength(mockFloors.length);
    });

    test('setPois should update POIs array', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPois(mockPois);
      });

      expect(result.current.pois).toEqual(mockPois);
      expect(result.current.pois).toHaveLength(mockPois.length);
    });

    test('setPoiCategories should update categories array', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setPoiCategories(mockCategories);
      });

      expect(result.current.poiCategories).toEqual(mockCategories);
      expect(result.current.poiCategories).toHaveLength(mockCategories.length);
    });

    test('setLoading should update loading state', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });

    test('setError should update error state', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });

    test('reset should restore initial state', () => {
      const { result } = renderHook(() => useBuildingStore());

      act(() => {
        result.current.setBuilding(mockBuilding);
        result.current.setFloors(mockFloors);
        result.current.setPois(mockPois);
        result.current.setSelectedFloorId(1);
        result.current.setSearchQuery('test');
        result.current.setLoading(true);
        result.current.setError('error');
      });

      expect(result.current.building).not.toBeNull();
      expect(result.current.floors).toHaveLength(mockFloors.length);

      act(() => {
        result.current.reset();
      });

      expect(result.current.building).toBeNull();
      expect(result.current.floors).toEqual([]);
      expect(result.current.pois).toEqual([]);
      expect(result.current.selectedFloorId).toBeNull();
      expect(result.current.selectedPoiId).toBeNull();
      expect(result.current.searchQuery).toBe('');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
