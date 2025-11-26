import type { Floor } from '@situm/sdk-js';
import maplibregl from 'maplibre-gl';

import { MARKER_SIZE } from './constants';
import type { BuildingOutlineData, Corner, CreatePoiMarkerElementParams } from './types';

export const getPaddedBounds = (corners: Corner[], paddingDegrees: number) => {
  if (!corners.length) return null;

  const initialBounds = new maplibregl.LngLatBounds(
    [corners[0].lng, corners[0].lat],
    [corners[0].lng, corners[0].lat]
  );

  const bounds = corners
    .slice(1)
    .reduce((acc, corner) => acc.extend([corner.lng, corner.lat]), initialBounds);

  if (!paddingDegrees) return bounds;

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  return new maplibregl.LngLatBounds(
    [sw.lng - paddingDegrees, sw.lat - paddingDegrees],
    [ne.lng + paddingDegrees, ne.lat + paddingDegrees]
  );
};

export const createBuildingOutlineData = (
  name: string,
  corners: Corner[]
): BuildingOutlineData => ({
  type: 'Feature',
  properties: { name },
  geometry: {
    type: 'Polygon',
    coordinates: [corners.map((corner) => [corner.lng, corner.lat])],
  },
});

export const getFloorById = (floors: Floor[], floorId: number | null) => {
  if (floorId === null) return null;
  return floors.find((floor) => floor.id === floorId) || null;
};

export const createPoiMarkerElement = ({
  iconUrl,
  selectedIconUrl,
  size = MARKER_SIZE,
}: CreatePoiMarkerElementParams): HTMLDivElement => {
  const el = document.createElement('div');

  el.className = 'poi-marker';
  el.style.backgroundImage = `url(${iconUrl})`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center';
  el.style.cursor = 'pointer';

  el.dataset.iconUrl = iconUrl;
  el.dataset.selectedIconUrl = selectedIconUrl;

  return el;
};
