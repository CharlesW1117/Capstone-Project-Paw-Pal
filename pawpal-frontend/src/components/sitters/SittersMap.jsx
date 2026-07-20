import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import "./SittersMap.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER = [41.8781, -87.6298];
const DEFAULT_ZOOM = 11;

function SittersMap({ sitters }) {
  const mappableSitters = useMemo(
    () =>
      sitters.filter(
        (sitter) => sitter.latitude != null && sitter.longitude != null,
      ),
    [sitters],
  );

  const mapCenter = useMemo(() => {
    if (mappableSitters.length === 0) {
      return DEFAULT_CENTER;
    }

    const totals = mappableSitters.reduce(
      (accumulator, sitter) => ({
        lat: accumulator.lat + Number(sitter.latitude),
        lng: accumulator.lng + Number(sitter.longitude),
      }),
      { lat: 0, lng: 0 },
    );

    return [
      totals.lat / mappableSitters.length,
      totals.lng / mappableSitters.length,
    ];
  }, [mappableSitters]);

  if (mappableSitters.length === 0) {
    return (
      <div className="sitters-map sitters-map--empty">
        <p>No sitters with a mapped location yet.</p>
      </div>
    );
  }

  return (
    <div className="sitters-map">
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="sitters-map__container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappableSitters.map((sitter) => (
          <Marker
            key={sitter.id}
            position={[Number(sitter.latitude), Number(sitter.longitude)]}
          >
            <Popup>
              <div className="sitters-map__popup">
                <strong>{sitter.name}</strong>
                <span>
                  {sitter.city}
                  {sitter.state ? `, ${sitter.state}` : ""}
                </span>
                <span>
                  ⭐ {Number(sitter.averageRating || 0).toFixed(1)} (
                  {sitter.reviewCount || 0}{" "}
                  {sitter.reviewCount === 1 ? "review" : "reviews"})
                </span>
                <Link to="/login">Log in to book</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default SittersMap;
