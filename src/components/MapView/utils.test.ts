import { describe, expect, test } from 'vitest';

import { mockFloors } from '../../test/fixtures';

import { SITUM_DOMAIN } from './constants';
import {
  createBuildingOutlineData,
  createPoiMarkerElement,
  getFloorById,
  getPaddedBounds,
  normalizeIconUrl,
} from './utils';

describe('MapView Utils', () => {
  describe('normalizeIconUrl', () => {
    test('should return empty string for empty input', () => {
      expect(normalizeIconUrl('')).toBe('');
    });

    test('should return URL unchanged if starts with http://', () => {
      const url = 'http://example.com/icon.png';

      expect(normalizeIconUrl(url)).toBe(url);
    });

    test('should prepend Situm domain if URL starts with /', () => {
      const url = '/path/to/icon.png';

      expect(normalizeIconUrl(url)).toBe(`${SITUM_DOMAIN}${url}`);
    });

    test('should prepend SITUM_DOMAIN/ if URL does not start with /', () => {
      const url = 'path/to/icon.png';

      expect(normalizeIconUrl(url)).toBe(`${SITUM_DOMAIN}/${url}`);
    });

    test('should handle relative path without slash', () => {
      const url = 'icon.png';

      expect(normalizeIconUrl(url)).toBe(`${SITUM_DOMAIN}/icon.png`);
    });
  });

  describe('getPaddedBounds', () => {
    test('should return null for empty corners array', () => {
      const result = getPaddedBounds([], 0.001);

      expect(result).toBeNull();
    });
  });

  describe('createBuildingOutlineData', () => {
    test('should create valid GeoJSON Feature', () => {
      const corners = [
        { lat: 40.0, lng: -3.0 },
        { lat: 41.0, lng: -2.0 },
      ];
      const result = createBuildingOutlineData('Building', corners);

      expect(result.type).toBe('Feature');
      expect(result.properties).toBeDefined();
      expect(result.geometry).toBeDefined();
    });
  });

  describe('createPoiMarkerElement', () => {
    test('should set background image from iconUrl', () => {
      const el = createPoiMarkerElement({
        iconUrl: 'icon.png',
        selectedIconUrl: 'selected.png',
      });

      expect(el.style.backgroundImage).toBe('url("icon.png")');
    });

    test('should handle URL paths in iconUrl', () => {
      const el = createPoiMarkerElement({
        iconUrl: 'https://example.com/icons/poi.png',
        selectedIconUrl: 'https://example.com/icons/poi-selected.png',
      });

      expect(el.style.backgroundImage).toBe('url("https://example.com/icons/poi.png")');
      expect(el.dataset.iconUrl).toBe('https://example.com/icons/poi.png');
    });
  });

  describe('getFloorById', () => {
    test('should return null when floorId is null', () => {
      const result = getFloorById(mockFloors, null);

      expect(result).toBeNull();
    });

    test('should return matching floor', () => {
      const result = getFloorById(mockFloors, 1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Ground Floor');
    });

    test('should return null for non-existent floor ID', () => {
      const result = getFloorById(mockFloors, 999);

      expect(result).toBeNull();
    });

    test('should handle empty floors array', () => {
      const result = getFloorById([], 1);

      expect(result).toBeNull();
    });
  });
});
