import { useEffect, useRef } from 'react';

import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';

import { MAP_CONFIG } from '../config/constants';
import { useBuildingStore } from '../store/useBuildingStore';

import 'maplibre-gl/dist/maplibre-gl.css';

const MapView = () => {
  const building = useBuildingStore((state) => state.building);
  const pois = useBuildingStore((state) => state.getFilteredPois());

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Initialize the map once the building is available
  useEffect(() => {
    if (!building || !mapContainerRef.current || mapRef.current) return;

    const { lat, lng } = building.location;
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_CONFIG.STYLE_URL,
      center: [lng, lat],
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      // minZoom: MAP_CONFIG.MIN_ZOOM,
      // maxZoom: MAP_CONFIG.MAX_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    const marker = new maplibregl.Marker({ color: '#2563eb' }).setLngLat([lng, lat]).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    map.on('load', () => {
      // map.addSource('floorplan', {
      //   // GeoJSON Data source used in vector tiles, documented at
      //   // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
      //   type: 'geojson',
      //   data: 'https://api.situm.com/api/v1/vectormaps/7033/7033_20251119074703.geojson',
      // });

      map.addSource('building-outline', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: building.name },
          geometry: {
            type: 'Polygon',
            coordinates: [building.corners.map((corner) => [corner.lng, corner.lat])],
          },
        },
      });

      // Add fill layer
      map.addLayer({
        id: 'building-fill',
        type: 'fill',
        source: 'building-outline',
        paint: {
          'fill-color': '#088',
          'fill-opacity': 0.1,
        },
      });

      // Add outline layer
      map.addLayer({
        id: 'building-border',
        type: 'line',
        source: 'building-outline',
        paint: {
          'line-color': '#088',
          'line-width': 2,
        },
      });

      console.log('Building floors:', building.floors);

      map.addSource('floor-plan', {
        type: 'image',
        url: building.floors[1].maps.mapUrl,
        coordinates: [
          [-8.426001, 43.352942],
          [-8.423549, 43.352517],
          [-8.423938, 43.351322],
          [-8.42639, 43.351747],
        ],
      });

      map.addLayer({
        id: 'floor-plan-layer',
        type: 'raster',
        source: 'floor-plan',
        paint: {
          'raster-opacity': 0.85,
          'raster-fade-duration': 0,
        },
      });

      pois.map((poi) => {
        console.log('POI on map:', poi.name, poi.location);
        new maplibregl.Marker().setLngLat([poi.location.lng, poi.location.lat]).addTo(map);
      });
    });

    return () => {
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [building, pois]);

  // Keep map/marker in sync if building location changes
  useEffect(() => {
    if (!building || !mapRef.current) return;

    const { lat, lng } = building.location;
    mapRef.current.setCenter([lng, lat]);
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [building]);

  if (!building) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-600">
        Select or load a building to view it on the map.
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg border" />;
};

export default MapView;
