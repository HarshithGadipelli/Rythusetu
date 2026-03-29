import React from "react";

export default function MapPicker({ value, onChange }) {
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      onChange({
        address: value?.address || "",
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    }, () => alert("Location unavailable"));
  };

  const hasCoords = value && value.lat !== "" && value.lng !== "" && value.lat != null && value.lng != null;
  const openMap = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${value.lat}&mlon=${value.lng}#map=14/${value.lat}/${value.lng}`
    : null;

  return (
    <div className="map-box">
      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={useCurrentLocation}>Use My Current Location</button>
        {openMap && (
          <a className="btn btn-ghost" href={openMap} target="_blank" rel="noreferrer">Open Map</a>
        )}
      </div>
      <div className="small">
        Current: {value?.lat != null && value?.lng != null ? `${value.lat}, ${value.lng}` : "not selected"}
      </div>
    </div>
  );
}
