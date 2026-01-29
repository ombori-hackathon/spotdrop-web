import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useCallback } from 'react';
import { useSpotsStore } from '../../stores/spotsStore';
import { getCategoryColor, type Spot } from '../../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

const SOURCE_ID = 'spots-source';
const CLUSTER_LAYER_ID = 'clusters';
const CLUSTER_COUNT_LAYER_ID = 'cluster-count';

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const { spots, selectSpot } = useSpotsStore();

  const updateMarkers = useCallback(() => {
    if (!map.current) return;

    const newMarkerIds = new Set<number>();
    const features = map.current.querySourceFeatures(SOURCE_ID);

    for (const feature of features) {
      const props = feature.properties;
      if (!props || props.cluster) continue;

      const spotId = props.id as number;
      newMarkerIds.add(spotId);

      if (markersRef.current[spotId]) continue;

      const spot = spots.find((s) => s.id === spotId);
      if (!spot) continue;

      const marker = createMarker(spot, () => selectSpot(spot));
      marker.addTo(map.current!);
      markersRef.current[spotId] = marker;
    }

    // Remove markers that are now clustered
    for (const id of Object.keys(markersRef.current)) {
      const numId = Number(id);
      if (!newMarkerIds.has(numId)) {
        markersRef.current[numId].remove();
        delete markersRef.current[numId];
      }
    }
  }, [spots, selectSpot]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [28.14097033479196, 38.82616383570824],
      zoom: 3.75,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add empty source with clustering
      map.current.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        cluster: true,
        clusterMaxZoom: 12,
        clusterRadius: 50,
      });

      // Cluster circles
      map.current.addLayer({
        id: CLUSTER_LAYER_ID,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#6366F1',
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
          'circle-stroke-width': 3,
          'circle-stroke-color': '#818CF8',
        },
      });

      // Cluster count labels
      map.current.addLayer({
        id: CLUSTER_COUNT_LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Click on cluster to zoom in
      map.current.on('click', CLUSTER_LAYER_ID, (e) => {
        const features = map.current!.queryRenderedFeatures(e.point, {
          layers: [CLUSTER_LAYER_ID],
        });
        if (!features.length) return;

        const clusterId = features[0].properties?.cluster_id;
        const source = map.current!.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current) return;
          const geometry = features[0].geometry;
          if (geometry.type !== 'Point') return;

          map.current.easeTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom ?? 10,
          });
        });
      });

      // Cursor changes for clusters
      map.current.on('mouseenter', CLUSTER_LAYER_ID, () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current.on('mouseleave', CLUSTER_LAYER_ID, () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });
    });

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update source data when spots change
  useEffect(() => {
    if (!map.current) return;

    const updateSource = () => {
      const source = map.current?.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
      if (!source) return;

      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: spots.map((spot) => ({
          type: 'Feature',
          properties: {
            id: spot.id,
            title: spot.title,
            category: spot.category,
          },
          geometry: {
            type: 'Point',
            coordinates: [spot.longitude, spot.latitude],
          },
        })),
      };

      source.setData(geojson);
    };

    if (map.current.isStyleLoaded()) {
      updateSource();
    } else {
      map.current.once('load', updateSource);
    }
  }, [spots]);

  // Update markers on map movement
  useEffect(() => {
    if (!map.current) return;

    const onRender = () => updateMarkers();

    map.current.on('render', onRender);
    return () => {
      map.current?.off('render', onRender);
    };
  }, [updateMarkers]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

function createMarker(spot: Spot, onClick: () => void): mapboxgl.Marker {
  const el = document.createElement('div');
  el.className = 'spot-marker';

  const primaryImage = spot.images.find((img) => img.is_primary) || spot.images[0];
  const color = getCategoryColor(spot.category);

  el.innerHTML = `
    <div class="marker-container" style="display: flex; flex-direction: column; align-items: center;">
      <div class="marker-inner" style="
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 3px solid ${color};
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      ">
        ${
          primaryImage
            ? `<img src="${primaryImage.url}" alt="${spot.title}" style="width: 100%; height: 100%; object-fit: cover;" />`
            : `<div style="width: 100%; height: 100%; background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${spot.title[0]}</div>`
        }
      </div>
      <div class="marker-pin" style="
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid ${color};
        margin-top: -2px;
      "></div>
    </div>
  `;

  const innerEl = el.querySelector('.marker-inner') as HTMLElement;
  el.addEventListener('mouseenter', () => {
    innerEl.style.transform = 'scale(1.1)';
  });
  el.addEventListener('mouseleave', () => {
    innerEl.style.transform = 'scale(1)';
  });
  el.addEventListener('click', onClick);

  return new mapboxgl.Marker({ element: el, anchor: 'bottom' }).setLngLat([
    spot.longitude,
    spot.latitude,
  ]);
}
