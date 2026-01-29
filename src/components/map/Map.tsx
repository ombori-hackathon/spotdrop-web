import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { useSpotsStore } from '../../stores/spotsStore';
import { getCategoryColor, type Spot } from '../../types';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { spots, selectSpot } = useSpotsStore();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [18.0686, 59.3293],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    spots.forEach((spot) => {
      const marker = createMarker(spot, () => selectSpot(spot));
      marker.addTo(map.current!);
      markersRef.current.push(marker);
    });
  }, [spots, selectSpot]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

function createMarker(spot: Spot, onClick: () => void): mapboxgl.Marker {
  const el = document.createElement('div');
  el.className = 'spot-marker';

  const primaryImage = spot.images.find((img) => img.is_primary) || spot.images[0];
  const color = getCategoryColor(spot.category);

  el.innerHTML = `
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
  `;

  const innerEl = el.querySelector('.marker-inner') as HTMLElement;
  el.addEventListener('mouseenter', () => {
    innerEl.style.transform = 'scale(1.1)';
  });
  el.addEventListener('mouseleave', () => {
    innerEl.style.transform = 'scale(1)';
  });
  el.addEventListener('click', onClick);

  return new mapboxgl.Marker(el).setLngLat([spot.longitude, spot.latitude]);
}
