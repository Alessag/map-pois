import { useEffect, useRef } from 'react';

import maplibregl, { type Map as MapLibreMap, type Marker } from 'maplibre-gl';

import { MAP_CONFIG } from '../config/constants';
import { useBuildingStore } from '../store/useBuildingStore';

import 'maplibre-gl/dist/maplibre-gl.css';

const SITUM_DOMAIN = 'https://dashboard.situm.com';

type Corner = { lat: number; lng: number };

const getPaddedBounds = (corners: Corner[], paddingDegrees: number) => {
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

const MapView = () => {
  const building = useBuildingStore((state) => state.building);
  const pois = useBuildingStore((state) => state.getFilteredPois());
  const selectedFloorId = useBuildingStore((state) => state.selectedFloorId);
  const floors = useBuildingStore((state) => state.floors);
  const selectedPoi = useBuildingStore((state) => state.getPoiById(state.selectedPoiId ?? -1));
  const setSelectedPoiId = useBuildingStore((state) => state.setSelectedPoiId);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  // Mapa para guardar referencias a los marcadores de POIs por ID
  const markersRef = useRef<Map<number, Marker>>(new Map());

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

    const marker = new maplibregl.Marker({ color: '#2563eb' }).setLngLat([lng, lat]).addTo(map);

    mapRef.current = map;
    markerRef.current = marker;

    map.on('load', () => {
      if (paddedBounds) {
        map.fitBounds(paddedBounds, {
          padding: MAP_CONFIG.BOUNDS_PADDING,
          maxZoom: MAP_CONFIG.MAX_ZOOM,
        });
      }
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

      const getFloorById = (floorId: number | null) => {
        if (floorId === null) return null;
        return floors.find((floor) => floor.id === floorId) || null;
      };

      map.addSource('floor-plan', {
        type: 'image',
        url: getFloorById(selectedFloorId)?.maps.mapUrl,
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

      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();

      pois.map((poi) => {
        // TODO: Well, improve the info  poi
        const popup = new maplibregl.Popup({ offset: 30 }).setText(`${poi.name} ${poi.info}`);

        const iconUrl = `${SITUM_DOMAIN}${poi.categories[0].iconUrl}`;
        const selectedIconUrl = `${SITUM_DOMAIN}${poi.categories[0].selectedIconUrl}`;

        const el = document.createElement('div');
        el.className = 'poi-marker';
        el.style.backgroundImage = `url(${iconUrl})`;
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.cursor = 'pointer';

        popup.on('open', () => {
          el.style.backgroundImage = `url(${selectedIconUrl})`;
          setSelectedPoiId(poi.id);
        });

        popup.on('close', () => {
          el.style.backgroundImage = `url(${iconUrl})`;
          const currentSelected = useBuildingStore.getState().selectedPoiId;
          if (currentSelected === poi.id) {
            setSelectedPoiId(null);
          }
        });

        const poiMarker = new maplibregl.Marker({ element: el })
          .setLngLat([poi.location.lng, poi.location.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.set(poi.id, poiMarker);
      });
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current.clear();
      marker.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [building, floors, pois, selectedFloorId, setSelectedPoiId]);

  // Keep map/marker in sync if building location changes
  useEffect(() => {
    if (!building || !mapRef.current) return;

    const { lat, lng } = building.location;
    mapRef.current.setCenter([lng, lat]);
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }
  }, [building]);

  // Reaccionar cuando se selecciona un POI desde el sidebar
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPoi) return;

    const marker = markersRef.current.get(selectedPoi.id);
    if (!marker) return;

    // Cerrar cualquier popup abierto primero
    markersRef.current.forEach((m) => {
      const popup = m.getPopup();
      if (popup?.isOpen()) {
        popup.remove();
      }
    });

    // Abrir el popup del POI seleccionado
    marker.togglePopup();

    // Centrar el mapa en el POI seleccionado
    map.flyTo({
      center: [selectedPoi.location.lng, selectedPoi.location.lat],
      zoom: 20,
      duration: 500,
    });
  }, [selectedPoi]); // <-- Añadir selectedPoi como dependencia

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
