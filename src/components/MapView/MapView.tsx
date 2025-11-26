import { useEffect, useRef, useState } from 'react';

import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';

import { MAP_CONFIG } from '../../config/constants.ts';
import { useBuildingStore } from '../../store/useBuildingStore';

import {
  BUILDING_MARKER_COLOR,
  LAYER_CONFIG,
  POI_FLY_TO_DURATION,
  POI_FLY_TO_ZOOM,
  SITUM_DOMAIN,
} from './constants.ts';
import {
  createBuildingOutlineData,
  createPoiMarkerElement,
  getFloorById,
  getPaddedBounds,
} from './utils.ts';

import 'maplibre-gl/dist/maplibre-gl.css';

export const MapView = () => {
  const building = useBuildingStore((state) => state.building);
  const pois = useBuildingStore((state) => state.getFilteredPois());
  const selectedFloorId = useBuildingStore((state) => state.selectedFloorId);
  const floors = useBuildingStore((state) => state.floors);
  const selectedPoi = useBuildingStore((state) => state.getPoiById(state.selectedPoiId ?? -1));
  const setSelectedPoiId = useBuildingStore((state) => state.setSelectedPoiId);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const buildingMarkerRef = useRef<Marker | null>(null);
  const poiMarkersRef = useRef<Map<number, Marker>>(new Map());

  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize the map once the building is available
  useEffect(() => {
    if (!building || !mapContainerRef.current || mapRef.current) return;

    const { lat, lng } = building.location;
    const paddedBounds = getPaddedBounds(building.corners ?? [], MAP_CONFIG.BOUNDS_PADDING_DEGREES);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_CONFIG.STYLE_URL,
      center: [lng, lat],
      zoom: MAP_CONFIG.DEFAULT_ZOOM,
      minZoom: MAP_CONFIG.MIN_ZOOM,
      maxZoom: MAP_CONFIG.MAX_ZOOM,
      maxBounds: paddedBounds ?? undefined,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    const marker = new maplibregl.Marker({ color: BUILDING_MARKER_COLOR })
      .setLngLat([lng, lat])
      .addTo(map);

    mapRef.current = map;
    buildingMarkerRef.current = marker;

    map.on('load', () => {
      if (paddedBounds) {
        map.fitBounds(paddedBounds, {
          padding: MAP_CONFIG.BOUNDS_PADDING,
          maxZoom: MAP_CONFIG.MAX_ZOOM,
        });
      }

      map.addSource('building-outline', {
        type: 'geojson',
        data: createBuildingOutlineData(building.name, building.corners),
      });

      map.addLayer({
        id: LAYER_CONFIG.buildingFill.id,
        type: LAYER_CONFIG.buildingFill.type,
        source: 'building-outline',
        paint: LAYER_CONFIG.buildingFill.paint,
      });

      map.addLayer({
        id: LAYER_CONFIG.buildingBorder.id,
        type: LAYER_CONFIG.buildingBorder.type,
        source: 'building-outline',
        paint: LAYER_CONFIG.buildingBorder.paint,
      });

      setIsMapReady(true);
    });

    return () => {
      setIsMapReady(false);
      marker.remove();
      map.remove();
      mapRef.current = null;
      buildingMarkerRef.current = null;
    };
  }, [building]);

  // use Effect 2: Manage floor layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    const floorMapUrl = getFloorById(floors, selectedFloorId)?.maps.mapUrl;
    const sourceId = 'floor-plan';
    const layerId = LAYER_CONFIG.floorPlan.id;

    // Remove existing floor plan if present
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Add new floor plan if URL exists
    if (floorMapUrl) {
      map.addSource(sourceId, {
        type: 'image',
        url: floorMapUrl,
        coordinates: [
          [-8.426001, 43.352942],
          [-8.423549, 43.352517],
          [-8.423938, 43.351322],
          [-8.42639, 43.351747],
        ],
      });

      map.addLayer({
        id: layerId,
        type: LAYER_CONFIG.floorPlan.type,
        source: sourceId,
        paint: LAYER_CONFIG.floorPlan.paint,
      });
    }
  }, [floors, isMapReady, selectedFloorId]);

  // Effect 3: Manage POI markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) return;

    poiMarkersRef.current.forEach((m) => m.remove());
    poiMarkersRef.current.clear();

    pois.forEach((poi) => {
      const iconUrl = `${SITUM_DOMAIN}${poi.categories[0].iconUrl}`;
      const selectedIconUrl = `${SITUM_DOMAIN}${poi.categories[0].selectedIconUrl}`;

      const el = createPoiMarkerElement({ iconUrl, selectedIconUrl });

      // TODO: Improve the POI info display
      const popup = new maplibregl.Popup({ offset: 30 }).setText(`${poi.name} ${poi.info}`);

      popup.on('open', () => {
        el.style.backgroundImage = `url(${el.dataset.selectedIconUrl})`;
        setSelectedPoiId(poi.id);
      });

      popup.on('close', () => {
        el.style.backgroundImage = `url(${el.dataset.iconUrl})`;
        const currentSelected = useBuildingStore.getState().selectedPoiId;
        if (currentSelected === poi.id) {
          setSelectedPoiId(null);
        }
      });

      const poiMarker = new maplibregl.Marker({ element: el })
        .setLngLat([poi.location.lng, poi.location.lat])
        .setPopup(popup)
        .addTo(map);

      poiMarkersRef.current.set(poi.id, poiMarker);
    });

    return () => {
      poiMarkersRef.current.forEach((m) => m.remove());
      poiMarkersRef.current.clear();
    };
  }, [isMapReady, pois, setSelectedPoiId]);

  // Effect 4: Keep map/marker in sync if building location changes
  useEffect(() => {
    if (!building || !mapRef.current) return;

    const { lat, lng } = building.location;

    mapRef.current.setCenter([lng, lat]);

    if (buildingMarkerRef.current) {
      buildingMarkerRef.current.setLngLat([lng, lat]);
    }
  }, [building]);

  // Effect 5: React when a POI is selected from the sidebar
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPoi) return;

    const marker = poiMarkersRef.current.get(selectedPoi.id);
    if (!marker) return;

    poiMarkersRef.current.forEach((m) => {
      const popup = m.getPopup();
      if (popup?.isOpen()) {
        popup.remove();
      }
    });

    marker.togglePopup();

    map.flyTo({
      center: [selectedPoi.location.lng, selectedPoi.location.lat],
      zoom: POI_FLY_TO_ZOOM,
      duration: POI_FLY_TO_DURATION,
    });
  }, [selectedPoi]);

  if (!building) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-600">
        Select or load a building to view it on the map.
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-full w-full rounded-lg border" />;
};
