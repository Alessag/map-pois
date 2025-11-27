import type { Building } from '@situm/sdk-js';

export const mockBuilding: Building = {
  id: 7033,
  name: 'Test Building',
  location: { lat: 40.416775, lng: -3.70379 },
  corners: [
    { lat: 40.416775, lng: -3.70379 },
    { lat: 40.417, lng: -3.70379 },
    { lat: 40.417, lng: -3.7035 },
    { lat: 40.416775, lng: -3.7035 },
  ],
  customFields: {},
} as Building;
