import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../api";
import VoiceInput from "../components/VoiceInput";
import MapPicker from "../components/MapPicker";

const Field = ({ label, value, onChange, type = "text", voice = true }) => (
  <label className="field">
    <span>{label}</span>
    <div className="field-row">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {voice && <VoiceInput onResult={onChange} />}
    </div>
  </label>
);

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "vegetables",
    address: "",
    lat: "",
    lng: "",
    organic: true,
    pesticideFree: true,
    saleLive: true
  });
  const [photo, setPhoto] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (photo) fd.append("photo", photo);

      await addProduct(fd);
      alert("Product added successfully");
      navigate("/farmer");
    } catch (err) {
      alert(err.response?.data?.message || "Add product failed");
    }
  };

  return (
    <div className="page narrow">
      <div className="card">
        <h2>Add Product</h2>
        <form onSubmit={submit} className="form">
          <Field label="Product Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
          <Field label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <Field label="Quantity" type="number" value={form.quantity} onChange={(v) => setForm({ ...form, quantity: v })} />
          <Field label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
          <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field label="Latitude" value={form.lat} onChange={(v) => setForm({ ...form, lat: v })} />
          <Field label="Longitude" value={form.lng} onChange={(v) => setForm({ ...form, lng: v })} />

          <div className="toggle-row">
            <label><input type="checkbox" checked={form.organic} onChange={(e) => setForm({ ...form, organic: e.target.checked })} /> Organic</label>
            <label><input type="checkbox" checked={form.pesticideFree} onChange={(e) => setForm({ ...form, pesticideFree: e.target.checked })} /> Pesticide Free</label>
            <label><input type="checkbox" checked={form.saleLive} onChange={(e) => setForm({ ...form, saleLive: e.target.checked })} /> Sale Live</label>
          </div>

          <label className="field">
            <span>Product Photo</span>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
          </label>

          <MapPicker
            value={{ lat: form.lat, lng: form.lng, address: form.address }}
            onChange={(loc) => setForm({ ...form, lat: loc.lat ?? "", lng: loc.lng ?? "", address: loc.address ?? form.address })}
          />

          <button className="btn btn-primary" type="submit">Save Product</button>
        </form>
      </div>
    </div>
  );
}
