export type Corner = { lat: number; lng: number };

export interface CreatePoiMarkerElementParams {
  iconUrl: string;
  selectedIconUrl: string;
  size?: number;
}

export interface BuildingOutlineData {
  type: 'Feature';
  properties: { name: string };
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}
