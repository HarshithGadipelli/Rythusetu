import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api";
import { clearCart, getCart } from "../utils/cart";
import VoiceInput from "../components/VoiceInput";

const modes = ["UPI", "Debit Card", "Credit Card", "Cash"];

export default function Checkout() {
  const navigate = useNavigate();
  const items = getCart();
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [qr, setQr] = useState("");
  const total = useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [items]);

  const useLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, () => alert("Unable to detect location"));
  };

  const submit = async () => {
    try {
      const payload = {
        items: items.map((x) => ({ productId: x.product._id, quantity: x.quantity })),
        deliveryAddress: address,
        paymentMode,
        customerLocation: location
      };

      const res = await checkout(payload);
      if (res.data.paymentQr) setQr(res.data.paymentQr);
      clearCart();
      alert("Order placed successfully");
      navigate("/tracking");
    } catch (err) {
      alert(err.response?.data?.message || "Checkout failed");
    }
  };

  if (items.length === 0) {
    return <div className="page"><div className="card">Cart empty. <button className="btn btn-primary" onClick={() => navigate("/market")}>Go Shopping</button></div></div>;
  }

  return (
    <div className="page narrow">
      <div className="card">
        <h2>Checkout</h2>
        <div className="mini-card">
          {items.map((item) => (
            <div key={item.product._id}>{item.product.name} x {item.quantity}</div>
          ))}
          <strong>Total: ₹{total}</strong>
        </div>

        <label className="field">
          <span>Delivery Address</span>
          <div className="field-row">
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
            <VoiceInput onResult={setAddress} />
          </div>
        </label>

        <div className="button-row">
          <button className="btn btn-secondary" onClick={useLocation}>Use Current Location</button>
          <span className="small">Lat: {location.lat || "—"} | Lng: {location.lng || "—"}</span>
        </div>

        <label className="field">
          <span>Payment Mode</span>
          <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
            {modes.map((mode) => <option key={mode}>{mode}</option>)}
          </select>
        </label>

        <button className="btn btn-primary" onClick={submit}>Place Order</button>

        {qr && (
          <div className="qr-block">
            <h3>UPI QR</h3>
            <img src={qr} alt="UPI QR" />
            <p>Scan and pay to complete the order.</p>
          </div>
        )}
      </div>
    </div>
  );
}
