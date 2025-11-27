import type { Floor } from '@situm/sdk-js';

export const mockFloors: Floor[] = [
  {
    id: 1,
    buildingId: 7033,
    level: 0,
    name: 'Ground Floor',
    maps: {
      map_url: 'https://situm.com/floorplans/floor-0.png',
    },
  } as Floor,
  {
    id: 2,
    buildingId: 7033,
    level: 1,
    name: 'First Floor',
    maps: {
      map_url: 'https://situm.com/floorplans/floor-1.png',
    },
  } as Floor,
  {
    id: 3,
    buildingId: 7033,
    level: -1,
    name: '',
    maps: {
      map_url: 'https://situm.com/floorplans/basement.png',
    },
  } as Floor,
];

export const mockEmptyFloors: Floor[] = [];
