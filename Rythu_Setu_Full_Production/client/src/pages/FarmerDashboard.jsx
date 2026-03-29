import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProducts, getProductInsights, me } from "../api";

export default function FarmerDashboard() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [insights, setInsights] = useState(null);

  const load = async () => {
    const u = await me();
    setUser(u.data);
    const p = await getMyProducts();
    setProducts(p.data);
    const i = await getProductInsights();
    setInsights(i.data);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  return (
    <div className="page">
      <section className="grid-2">
        <div className="card soft">
          <h2>Farmer Dashboard</h2>
          <p>{user?.name || "Farmer"}</p>
          <p>Trust Score: {user?.trustScore ?? "—"}</p>
          <p>Verified: {user?.verified ? "Yes" : "No"}</p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/farmer/add-product">Add Product</Link>
            <button className="btn btn-secondary" onClick={load}>Refresh</button>
          </div>
        </div>
        <div className="card soft">
          <h3>AI Demand Insight</h3>
          <p>{insights?.message || "No insights yet"}</p>
          <ul>
            {(insights?.recommendedProducts || []).map((item) => (
              <li key={item.productId}>{item.name} • score {item.demandScore}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card soft">
        <h3>My Products</h3>
        <div className="grid-3">
          {products.map((p) => (
            <div className="mini-card" key={p._id}>
              <strong>{p.name}</strong>
              <div>₹{p.price}</div>
              <div>Qty {p.quantity}</div>
              <div>{p.organic ? "Organic" : "Regular"}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
