import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getMyOrders } from "../api";
import DeliveryTracker from "../components/DeliveryTracker";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const res = await getMyOrders();
    setOrders(res.data);
    setSelected((prev) => prev || res.data[0] || null);
  };

  useEffect(() => {
    load().catch(() => {});
    const onUpdate = (payload) => {
      setOrders((prev) =>
        prev.map((o) => (String(o._id) === String(payload.orderId) ? { ...o, status: payload.status, driverLocation: payload.driverLocation } : o))
      );
    };
    socket.on("orderStatusUpdated", onUpdate);
    return () => socket.off("orderStatusUpdated", onUpdate);
  }, []);

  return (
    <div className="page">
      <div className="grid-2">
        <div className="card soft">
          <h2>My Orders</h2>
          {orders.map((o) => (
            <div
              key={o._id}
              className={`mini-card selectable ${selected?._id === o._id ? "active" : ""}`}
              onClick={() => setSelected(o)}
            >
              <strong>{o.product?.name}</strong>
              <div>Status: {o.status}</div>
              <div>Total: ₹{o.totalPrice}</div>
            </div>
          ))}
        </div>
        <DeliveryTracker orderId={selected?._id} />
      </div>
    </div>
  );
}
