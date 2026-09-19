"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import type { SituationalEvent } from "@/types/db";
import { countryCentroid } from "@/lib/format";
import "leaflet/dist/leaflet.css";

interface MarkerPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
}

export default function IncidentMap({
  events,
  center,
  zoom,
}: {
  events: SituationalEvent[];
  center: [number, number];
  zoom: number;
}) {
  const points: MarkerPoint[] = events
    .map((ev) => {
      const coords: [number, number] | null =
        ev.lat !== null && ev.lng !== null ? [ev.lat, ev.lng] : countryCentroid(ev.country);
      if (!coords) return null;
      return { id: ev.id, lat: coords[0], lng: coords[1], title: ev.title, description: ev.description };
    })
    .filter((p): p is MarkerPoint => p !== null);

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-slate-200">
      <MapContainer center={center} zoom={zoom} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.lat, p.lng]}
            radius={7}
            pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.8 }}
          >
            <Popup>
              <strong>{p.title}</strong>
              <br />
              {p.description}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
