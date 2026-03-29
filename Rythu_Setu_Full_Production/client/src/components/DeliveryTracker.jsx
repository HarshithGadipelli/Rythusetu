import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

export default function DeliveryTracker({ orderId }) {
  const [driverLocation, setDriverLocation] = useState(null);
  const [status, setStatus] = useState("waiting");

  useEffect(() => {
    const onLocation = (payload) => {
      if (!orderId || payload.orderId === orderId) {
        setDriverLocation(payload.driverLocation || null);
      }
    };
    const onStatus = (payload) => {
      if (!orderId || payload.orderId === orderId) {
        setStatus(payload.status || "updated");
        if (payload.driverLocation) setDriverLocation(payload.driverLocation);
      }
    };

    socket.on("driverLocationUpdated", onLocation);
    socket.on("orderStatusUpdated", onStatus);

    return () => {
      socket.off("driverLocationUpdated", onLocation);
      socket.off("orderStatusUpdated", onStatus);
    };
  }, [orderId]);

  return (
    <div className="card soft">
      <h3>Live Delivery Tracking</h3>
      <p>Status: {status}</p>
      {driverLocation ? (
        <>
          <p>Driver Location: {driverLocation.lat}, {driverLocation.lng}</p>
          <a
            href={`https://www.openstreetmap.org/?mlat=${driverLocation.lat}&mlon=${driverLocation.lng}#map=14/${driverLocation.lat}/${driverLocation.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            Open in OpenStreetMap
          </a>
        </>
      ) : (
        <p>Waiting for driver updates...</p>
      )}
    </div>
  );
}
