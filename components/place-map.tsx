"use client";

import { useEffect, useRef } from "react";

type Props = {
  lat: number;
  lng: number;
  title: string;
  zoom?: number;
};

export function PlaceMap({ lat, lng, title, zoom = 13 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: any = null;

    (async () => {
      const L = (await import("leaflet")).default;

      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (cancelled || !containerRef.current) return;

      map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: '<div style="width:32px;height:32px;background:#c75b3a;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${title}</strong>`)
        .openPopup();
    })();

    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [lat, lng, title, zoom]);

  return (
    <div
      ref={containerRef}
      className="h-72 w-full overflow-hidden rounded-lg border border-border/60 bg-muted"
    />
  );
}