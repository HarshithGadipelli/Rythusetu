function haversine(a, b) {
  const R = 6371;
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad((b.lat || 0) - (a.lat || 0));
  const dLng = toRad((b.lng || 0) - (a.lng || 0));
  const lat1 = toRad(a.lat || 0);
  const lat2 = toRad(b.lat || 0);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function optimizeRoute(stops = [], origin = { lat: 0, lng: 0 }) {
  return [...stops]
    .map((stop) => ({ ...stop, distanceKm: Number(haversine(origin, stop).toFixed(2)) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

module.exports = { optimizeRoute };
