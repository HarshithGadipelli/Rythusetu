import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api";
import VoiceInput from "../components/VoiceInput";

const Field = ({ label, value, onChange, type = "text", voice = true, lang = "en-IN" }) => (
  <label className="field">
    <span>{label}</span>
    <div className="field-row">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      {voice && <VoiceInput onResult={onChange} lang={lang} />}
    </div>
  </label>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer",
    lat: "",
    lng: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="page narrow">
      <div className="card">
        <h2>Create Account</h2>
        <form onSubmit={submit} className="form">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <Field label="Latitude" value={form.lat} onChange={(v) => setForm({ ...form, lat: v })} />
          <Field label="Longitude" value={form.lng} onChange={(v) => setForm({ ...form, lng: v })} />

          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="farmer">Farmer</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button className="btn btn-primary" type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}
