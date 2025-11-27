// src/setupTests.ts
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
});

type MapEventCallback = (...args: unknown[]) => void;

type ListenerMap = Record<string, MapEventCallback[]>;

type MockMap = {
  on: (event: string, callback: MapEventCallback) => void;
  remove: () => void;
  addControl: () => void;
  fitBounds: () => void;
  addSource: () => void;
  addLayer: () => void;
  removeLayer: () => void;
  removeSource: () => void;
  getLayer: () => unknown;
  getSource: () => unknown;
  flyTo: () => void;
  setCenter: () => void;
};

// Not empty: explicitly an object
type MockNavigationControl = object;

type MockMarker = {
  setLngLat: (lngLat: unknown) => MockMarker;
  setPopup: (popup: unknown) => MockMarker;
  addTo: (map: unknown) => MockMarker;
  remove: () => void;
  getPopup: () => unknown;
  togglePopup: () => void;
};

type MockPopup = {
  setHTML: (html: string) => MockPopup;
  on: (event: string, callback: MapEventCallback) => void;
  isOpen: () => boolean;
  remove: () => void;
};

type MockLngLatBounds = {
  extend: (value: unknown) => MockLngLatBounds;
  getSouthWest: () => { lng: number; lat: number };
  getNorthEast: () => { lng: number; lat: number };
};

// ----------------------------------
// Global Mock for maplibre-gl
// ----------------------------------
vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(function (this: MockMap) {
      const listeners: ListenerMap = {};

      this.on = vi.fn((event: string, callback: MapEventCallback) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);

        if (event === 'load') {
          setTimeout(() => callback(), 0);
        }
      });

      this.remove = vi.fn();
      this.addControl = vi.fn();
      this.fitBounds = vi.fn();
      this.addSource = vi.fn();
      this.addLayer = vi.fn();
      this.removeLayer = vi.fn();
      this.removeSource = vi.fn();
      this.getLayer = vi.fn();
      this.getSource = vi.fn();
      this.flyTo = vi.fn();
      this.setCenter = vi.fn();

      return this;
    }),

    NavigationControl: vi.fn(function (this: MockNavigationControl) {
      return this;
    }),

    Marker: vi.fn(function (this: MockMarker) {
      this.setLngLat = vi.fn().mockReturnThis();
      this.setPopup = vi.fn().mockReturnThis();
      this.addTo = vi.fn().mockReturnThis();
      this.remove = vi.fn();
      this.getPopup = vi.fn();
      this.togglePopup = vi.fn();
      return this;
    }),

    Popup: vi.fn(function (this: MockPopup) {
      this.setHTML = vi.fn().mockReturnThis();
      this.on = vi.fn();
      this.isOpen = vi.fn(() => false);
      this.remove = vi.fn();
      return this;
    }),

    LngLatBounds: vi.fn(function (this: MockLngLatBounds) {
      this.extend = vi.fn().mockReturnThis();
      this.getSouthWest = vi.fn(() => ({ lng: 0, lat: 0 }));
      this.getNorthEast = vi.fn(() => ({ lng: 1, lat: 1 }));
      return this;
    }),
  },
}));

vi.mock('maplibre-gl/dist/maplibre-gl.css', () => ({}));
