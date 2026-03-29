import React, { useEffect, useState } from "react";
import { getAdminAnalytics, getAllOrders, getPendingFarmers, verifyFarmer, updateOrderStatus } from "../api";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [orders, setOrders] = useState([]);

  const load = async () => {
    const [a, f, o] = await Promise.all([getAdminAnalytics(), getPendingFarmers(), getAllOrders()]);
    setAnalytics(a.data);
    setFarmers(f.data);
    setOrders(o.data);
  };

  useEffect(() => { load().catch(() => {}); }, []);

  const update = async (id, status) => {
    await updateOrderStatus(id, { status, driverLocation: { lat: 17.385, lng: 78.486 } });
    await load();
  };

  return (
    <div className="page">
      <section className="card soft">
        <h2>Admin Analytics</h2>
        <div className="grid-4">
          <div className="metric">Total Farmers: <strong>{analytics?.farmers ?? 0}</strong></div>
          <div className="metric">Total Customers: <strong>{analytics?.customers ?? 0}</strong></div>
          <div className="metric">Total Products: <strong>{analytics?.products ?? 0}</strong></div>
          <div className="metric">Total Orders: <strong>{analytics?.orders ?? 0}</strong></div>
          <div className="metric full">Total Revenue: <strong>₹{analytics?.revenue ?? 0}</strong></div>
        </div>
        <div className="mini-card">
          <strong>Demand Insight:</strong> {analytics?.demand?.message || "No demand data yet"}
        </div>
      </section>

      <section className="grid-2">
        <div className="card soft">
          <h3>Pending Farmer Verification</h3>
          {farmers.length === 0 && <p>No pending farmers.</p>}
          {farmers.map((f) => (
            <div className="mini-card" key={f._id}>
              <strong>{f.name}</strong>
              <div>{f.email}</div>
              <button className="btn btn-primary" onClick={async () => { await verifyFarmer(f._id); await load(); }}>Verify</button>
            </div>
          ))}
        </div>

        <div className="card soft">
          <h3>Orders Management</h3>
          {orders.map((o) => (
            <div className="mini-card" key={o._id}>
              <strong>{o.product?.name}</strong>
              <div>Customer: {o.customer?.name}</div>
              <div>Status: {o.status}</div>
              <div>Payment: {o.paymentMode}</div>
              <div className="button-row">
                <button className="btn btn-secondary" onClick={() => update(o._id, "out_for_delivery")}>Out for Delivery</button>
                <button className="btn btn-primary" onClick={() => update(o._id, "delivered")}>Delivered</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
