import { useEffect, useRef } from "react";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet/Popup";
import { useMap } from "react-leaflet/hooks";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Hike, Waypoint } from "@/lib/types";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Create custom icons
function createHikeIcon(isUpcoming: boolean, isSelected: boolean) {
  const color = isUpcoming ? "#2563eb" : "#6b7280";
  const size = isSelected ? 40 : 32;

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createWaypointIcon() {
  return L.divIcon({
    className: "waypoint-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#22c55e" stroke="white" stroke-width="2"/>
          <path d="M12 6L14 10H10L12 6Z" fill="white"/>
          <rect x="10" y="10" width="4" height="6" fill="white"/>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

interface HikingMapProps {
  hikes: Hike[];
  waypoints?: Waypoint[];
  selectedHikeId?: string | null;
  onHikeSelect?: (hike: Hike) => void;
  className?: string;
}

// Component to handle map view updates
function MapController({ selectedHike, hikes }: { selectedHike?: Hike; hikes: Hike[] }) {
  const map = useMap();
  const previousSelectedRef = useRef<string | undefined>(undefined);
  const initialFitDone = useRef(false);

  useEffect(() => {
    // Leaflet can render a blank map when mounted inside dynamically-sized containers;
    // forcing a size recalculation after paint fixes it.
    const t = window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => window.clearTimeout(t);
  }, [map]);

  useEffect(() => {
    const getValidCoords = (lat: unknown, lng: unknown): [number, number] | null => {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
        return [latNum, lngNum];
      }
      return null;
    };

    if (selectedHike) {
      const coords = getValidCoords(selectedHike.location_lat, selectedHike.location_lng);
      if (!coords) return;

      const bounds = L.latLngBounds([coords]);

      if (selectedHike.waypoints) {
        selectedHike.waypoints.forEach((wp) => {
          const wpCoords = getValidCoords(wp.latitude, wp.longitude);
          if (wpCoords) bounds.extend(wpCoords);
        });
      }

      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
      map.invalidateSize();
      previousSelectedRef.current = selectedHike.id;
    } else if (previousSelectedRef.current && hikes.length > 0) {
      const validHikes = hikes.map((h) => getValidCoords(h.location_lat, h.location_lng)).filter(Boolean) as [
        number,
        number,
      ][];
      if (validHikes.length > 0) {
        map.fitBounds(L.latLngBounds(validHikes), { padding: [50, 50] });
        map.invalidateSize();
      }
      previousSelectedRef.current = undefined;
    } else if (hikes.length > 0 && !initialFitDone.current) {
      const validHikes = hikes.map((h) => getValidCoords(h.location_lat, h.location_lng)).filter(Boolean) as [
        number,
        number,
      ][];
      if (validHikes.length > 0) {
        map.fitBounds(L.latLngBounds(validHikes), { padding: [50, 50] });
        map.invalidateSize();
      }
      initialFitDone.current = true;
    }
  }, [selectedHike, hikes, map]);

  return null;
}

function HikingMap({ hikes, waypoints = [], selectedHikeId = null, onHikeSelect, className = "" }: HikingMapProps) {
  const selectedHike = hikes.find((h) => h.id === selectedHikeId);
  const displayWaypoints =
    selectedHike?.waypoints?.filter((w) => w.type === "overnight_stop") ||
    waypoints.filter((w) => w.type === "overnight_stop" && w.hike_id === selectedHikeId);

  const defaultCenter: [number, number] = [47.5, 11.5];
  const defaultZoom = 8;
  const waypointIcon = createWaypointIcon();

  const getValidCoords = (lat: unknown, lng: unknown): [number, number] | null => {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    if (Number.isFinite(latNum) && Number.isFinite(lngNum)) {
      return [latNum, lngNum];
    }
    return null;
  };

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedHike={selectedHike} hikes={hikes} />

        {hikes.map((hike) => {
          const coords = getValidCoords(hike.location_lat, hike.location_lng);
          if (!coords) return null;

          const isSelected = selectedHikeId === hike.id;
          const isUpcoming = hike.status === "upcoming";

          return (
            <Marker
              key={hike.id}
              position={coords}
              icon={createHikeIcon(isUpcoming, isSelected)}
              eventHandlers={{
                click: () => onHikeSelect?.(hike),
              }}
            >
              <Popup>
                <div className="min-w-[180px] p-1">
                  <h3 className="font-heading font-semibold text-foreground">{hike.name}</h3>
                  <p className="text-sm text-muted-foreground">{hike.location_name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(hike.date).toLocaleDateString("en-DE", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {hike.end_date &&
                      ` - ${new Date(hike.end_date).toLocaleDateString("en-DE", {
                        month: "short",
                        day: "numeric",
                      })}`}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {displayWaypoints.map((waypoint) => {
          const coords = getValidCoords(waypoint.latitude, waypoint.longitude);
          if (!coords) return null;

          return (
            <Marker key={waypoint.id} position={coords} icon={waypointIcon}>
              <Popup>
                <div className="min-w-[120px] p-1">
                  <h3 className="font-heading font-semibold text-foreground">{waypoint.name}</h3>
                  {waypoint.day_number && <p className="text-xs text-muted-foreground">Night {waypoint.day_number}</p>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="absolute bottom-4 right-4 z-[1000] rounded-lg bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <h4 className="mb-2 font-heading text-sm font-semibold">Legend</h4>
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground" />
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span>Overnight</span>
          </div>
        </div>
      </div>

      <div className="absolute left-4 top-4 z-[1000] rounded-lg bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <h4 className="font-heading font-semibold">Hiking Map</h4>
        <p className="text-sm text-muted-foreground">{hikes.length} hikes available</p>
      </div>
    </div>
  );
}

export default HikingMap;
