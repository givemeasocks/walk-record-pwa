"use client";

import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import Image from "next/image";
import type { WalkRecord } from "@/lib/types";
import { formatDate } from "@/lib/format";

const pinIcon = L.divIcon({
  className: "",
  html: '<div class="walk-pin"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

function ClickCatcher({ onClear }: { onClear: () => void }) {
  useMapEvents({ click: onClear });
  return null;
}

export default function MapView({ records }: { records: WalkRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = records.find((r) => r.id === selectedId) ?? null;

  const routePoints = useMemo(() => {
    if (!selected) return [];
    const dayKey = selected.created_at.slice(0, 10);
    const sameDay = records
      .filter((r) => r.created_at.slice(0, 10) === dayKey)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    if (sameDay.length < 2) return [];
    return sameDay.map((r) => [r.lat, r.lng] as [number, number]);
  }, [selected, records]);

  const center: [number, number] =
    records.length > 0 ? [records[0].lat, records[0].lng] : [37.5665, 126.978];

  return (
    <div className="flex-1 relative min-h-0">
      <MapContainer center={center} zoom={14} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCatcher onClear={() => setSelectedId(null)} />
        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            pathOptions={{ color: "oklch(0.60 0.09 230)", dashArray: "6 6", weight: 3 }}
          />
        )}
        {records.map((r) => (
          <Marker
            key={r.id}
            position={[r.lat, r.lng]}
            icon={pinIcon}
            eventHandlers={{ click: () => setSelectedId(r.id) }}
          />
        ))}
      </MapContainer>

      {selected && (
        <Link
          href={`/record/${selected.id}`}
          className="absolute left-4 right-4 bottom-4 z-[500] bg-surface rounded-2xl p-3 flex gap-2.5 shadow-lg"
        >
          <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-accent-soft relative">
            <Image
              src={selected.photo_url}
              alt={selected.caption}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="font-serif text-[13px] leading-snug text-foreground line-clamp-2">
              {selected.caption}
            </div>
            <div className="font-mono text-[9.5px] text-muted">
              {selected.mood} · {formatDate(selected.created_at)}
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
