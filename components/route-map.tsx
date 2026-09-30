"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Stop = {
  id: string;
  title: string;
  lat: number | null;
  lng: number | null;
  order: number;
};

export function RouteMap({ stops }: { stops: Stop[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const withCoords = stops.filter((s) => s.lat !== null && s.lng !== null);
    if (withCoords.length === 0) return;

    // Центр карты — середина маршрута
    const avgLat =
      withCoords.reduce((sum, s) => sum + s.lat!, 0) / withCoords.length;
    const avgLng =
      withCoords.reduce((sum, s) => sum + s.lng!, 0) / withCoords.length;

    const map = L.map(mapRef.current).setView([avgLat, avgLng], 8);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    // Маркеры
    const markers: L.Marker[] = [];
    withCoords.forEach((stop) => {
      const icon = L.divIcon({
        className: "custom-route-marker",
        html: `<div style="background: #c75b3a; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${stop.order + 1}</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([stop.lat!, stop.lng!], { icon })
        .bindPopup(`<strong>${stop.title}</strong>`)
        .addTo(map);
      markers.push(marker);
    });

    // Линия маршрута
    if (withCoords.length > 1) {
      const latlngs: [number, number][] = withCoords.map((s) => [
        s.lat!,
        s.lng!,
      ]);
      L.polyline(latlngs, {
        color: "#c75b3a",
        weight: 3,
        opacity: 0.8,
        dashArray: "8, 8",
      }).addTo(map);

      map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50] });
    }

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [stops]);

  return (
    <div
      ref={mapRef}
      className="h-96 w-full overflow-hidden rounded-lg border border-border/60"
    />
  );
}