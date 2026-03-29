import React, { useEffect, useState } from "react";
import { getProducts } from "../api";
import ProductCard from "../components/ProductCard";
import VoiceInput from "../components/VoiceInput";

export default function Marketplace() {
  const [filters, setFilters] = useState({
    q: "",
    organic: false,
    pesticideFree: false,
    sort: "newest",
    maxDistance: "",
    lat: "",
    lng: ""
  });
  const [products, setProducts] = useState([]);

  const load = async () => {
    const params = {
      q: filters.q,
      organic: filters.organic ? "true" : "",
      pesticideFree: filters.pesticideFree ? "true" : "",
      sort: filters.sort,
      maxDistance: filters.maxDistance,
      lat: filters.lat,
      lng: filters.lng
    };
    const res = await getProducts(params);
    setProducts(res.data);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const useLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      setFilters((f) => ({
        ...f,
        lat: pos.coords.latitude.toFixed(6),
        lng: pos.coords.longitude.toFixed(6)
      }));
    }, () => alert("Location unavailable"));
  };

  return (
    <div className="page">
      <section className="card soft">
        <h2>Marketplace</h2>
        <div className="toolbar">
          <div className="field-row">
            <input
              placeholder="Search products"
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
            <VoiceInput onResult={(v) => setFilters({ ...filters, q: v })} />
          </div>
          <label><input type="checkbox" checked={filters.organic} onChange={(e) => setFilters({ ...filters, organic: e.target.checked })} /> Organic</label>
          <label><input type="checkbox" checked={filters.pesticideFree} onChange={(e) => setFilters({ ...filters, pesticideFree: e.target.checked })} /> Pesticide Free</label>
          <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price Low → High</option>
            <option value="price_desc">Price High → Low</option>
            <option value="trust_desc">Trust Score</option>
            <option value="distance_asc">Distance</option>
          </select>
          <input placeholder="Max distance (km)" value={filters.maxDistance} onChange={(e) => setFilters({ ...filters, maxDistance: e.target.value })} />
          <input placeholder="Lat" value={filters.lat} onChange={(e) => setFilters({ ...filters, lat: e.target.value })} />
          <input placeholder="Lng" value={filters.lng} onChange={(e) => setFilters({ ...filters, lng: e.target.value })} />
          <button className="btn btn-secondary" onClick={useLocation}>Use My Location</button>
          <button className="btn btn-primary" onClick={load}>Search</button>
        </div>
      </section>

      <section className="grid-2">
        {products.map((p) => <ProductCard product={p} key={p._id} />)}
      </section>
    </div>
  );
}
